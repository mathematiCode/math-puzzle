import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Cut, CutAxis, Piece } from '../../types/piece';
import { availableCutAxes } from '../utils/piece';
import { useSplitPiece } from '../../hooks/useSplitPiece';
import { useCuttingPiece } from '../../context/CuttingPiece';

type Rect = { left: number; top: number; width: number; height: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Middle-ish offset for an axis, snapped into the valid 1..(len-1) range. */
function defaultOffset(piece: Piece, axis: CutAxis): number {
  const length = axis === 'vertical' ? piece.width : piece.height;
  return clamp(Math.round(length / 2), 1, length - 1);
}

/**
 * The internal grid line (of either orientation) nearest to the pointer, in the
 * piece's own unit space. This is what lets a single hover both position AND
 * orient the cut: whichever whole-unit boundary — vertical or horizontal — is
 * closest to the cursor becomes the cut. Returns null only for a 1x1 piece,
 * which has no internal boundary (and can't enter cut mode anyway).
 */
function nearestCut(
  clientX: number,
  clientY: number,
  rect: Rect,
  piece: Piece
): Cut | null {
  const unitsX = ((clientX - rect.left) / rect.width) * piece.width;
  const unitsY = ((clientY - rect.top) / rect.height) * piece.height;
  let best: (Cut & { dist: number }) | null = null;
  for (let offset = 1; offset < piece.width; offset++) {
    const dist = Math.abs(unitsX - offset);
    if (!best || dist < best.dist) best = { axis: 'vertical', offset, dist };
  }
  for (let offset = 1; offset < piece.height; offset++) {
    const dist = Math.abs(unitsY - offset);
    if (!best || dist < best.dist) best = { axis: 'horizontal', offset, dist };
  }
  if (!best) return null;
  return { axis: best.axis, offset: best.offset };
}

/**
 * The interactive cut line shown while a piece is in cut mode. Rendered in a
 * portal so it sits above everything and is never clipped by the tray's overflow
 * or the board.
 *
 * Interaction: the cut line follows the cursor, snapping to the nearest whole-unit
 * grid line (which also decides its orientation). Pressing down finalizes the cut;
 * clicking anywhere off the piece cancels. Positions are expressed as percentages
 * of the piece's on-screen rectangle, so the overlay stays aligned at any unit size.
 */
function CutOverlay({
  piece,
  targetRef,
}: {
  piece: Piece;
  targetRef: RefObject<HTMLElement>;
}) {
  const { performSplit } = useSplitPiece();
  const { setCuttingPieceId } = useCuttingPiece();

  const axes = availableCutAxes(piece);
  const initialAxis = axes[0] ?? 'vertical';
  const [cut, setCut] = useState<Cut>({
    axis: initialAxis,
    offset: defaultOffset(piece, initialAxis),
  });
  const [rect, setRect] = useState<Rect | null>(null);

  const measure = useCallback(() => {
    const node = targetRef.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    setRect({
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
    });
  }, [targetRef]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [measure]);

  const cancel = useCallback(() => {
    setCuttingPieceId(null);
  }, [setCuttingPieceId]);

  // Escape also cancels (clicking away is the primary way out).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') cancel();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cancel]);

  function handleRegionPointerMove(event: React.PointerEvent) {
    if (!rect) return;
    const next = nearestCut(event.clientX, event.clientY, rect, piece);
    if (next) setCut(next);
  }

  function handleRegionPointerDown(event: React.PointerEvent) {
    if (!rect) return;
    // Keep the backdrop (which cancels) from firing, and cut at the line nearest
    // the press — computed fresh from the event so the result matches the cursor.
    event.stopPropagation();
    const target = nearestCut(event.clientX, event.clientY, rect, piece) ?? cut;
    performSplit(piece, target);
  }

  if (!rect) return null;

  const linePercent =
    cut.axis === 'vertical'
      ? (cut.offset / piece.width) * 100
      : (cut.offset / piece.height) * 100;

  return createPortal(
    <Backdrop data-testid="cut-overlay-backdrop" onPointerDown={cancel}>
      <Region
        data-testid="cut-overlay-region"
        style={{
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }}
        onPointerMove={handleRegionPointerMove}
        onPointerDown={handleRegionPointerDown}
      >
        <CutLine
          data-testid="cut-line"
          $axis={cut.axis}
          style={
            cut.axis === 'vertical'
              ? { left: `${linePercent}%` }
              : { top: `${linePercent}%` }
          }
        />
      </Region>
    </Backdrop>,
    document.body
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1500;
`;

const Region = styled.div`
  position: fixed;
  cursor: crosshair;
  touch-action: none;
`;

const CutLine = styled.div<{ $axis: CutAxis }>`
  position: absolute;
  pointer-events: none;
  ${({ $axis }) =>
    $axis === 'vertical'
      ? `
    top: 0;
    bottom: 0;
    width: 0;
    border-left: 5px dashed white;
    /* Dark gray shadow cast to the right so the line reads on light shapes too. */
    filter: drop-shadow(3px 0 1px rgba(60, 60, 60, 0.9));
    transform: translateX(-2.5px);
  `
      : `
    left: 0;
    right: 0;
    height: 0;
    border-top: 5px dashed white;
    /* Dark gray shadow cast downward so the line reads on light shapes too. */
    filter: drop-shadow(0 3px 1px rgba(60, 60, 60, 0.9));
    transform: translateY(-2.5px);
  `}
`;

export default CutOverlay;

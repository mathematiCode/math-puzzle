import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import styled from 'styled-components';

/**
 * AnimatedToolPiece renders a small sample puzzle piece that animates to
 * demonstrate one of the game's mathematical tools. The animation loops gently
 * while the piece is hovered/focused and plays once on click/tap, then settles
 * back to its resting state.
 *
 * It is intentionally self-contained (no game context required) so it can be
 * dropped into marketing/instructional cards such as MathematicalToolsGrid.
 *
 * `transformed === true` always represents the "tool has been applied" state:
 *   - rotate:      resting = upright,        applied = rotated 90°
 *   - doubleHalve: resting = tall (2×4),     applied = wide (4×2)
 *   - cut:         resting = one rectangle,  applied = split into two
 *   - combine:     resting = two rectangles, applied = glued into one
 */

export type Tool = 'rotate' | 'doubleHalve' | 'cut' | 'combine';

const RED = 'hsla(0, 61%, 66%, 1)';
const TEAL = 'hsla(178, 64%, 40%, 1)';

interface AnimatedToolPieceProps {
  tool: Tool;
  unit?: number;
  label?: string;
}

function AnimatedToolPiece({ tool, unit = 22, label }: AnimatedToolPieceProps) {
  const [active, setActive] = useState(false);
  const [transformed, setTransformed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Loop the demonstration back and forth while the card is engaged.
  useEffect(() => {
    if (!active) {
      setTransformed(false);
      return;
    }
    setTransformed(true);
    intervalRef.current = setInterval(() => {
      setTransformed(prev => !prev);
    }, 1400);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  const engage = () => setActive(true);
  const release = () => setActive(false);
  const toggleOnce = () => {
    // Give click/tap users a single play even without a hover.
    if (!active) {
      setTransformed(prev => !prev);
    }
  };

  return (
    <Stage
      role="img"
      aria-label={label ? `${label} tool animation` : `${tool} tool animation`}
      tabIndex={0}
      $size={unit * 5}
      onMouseEnter={engage}
      onMouseLeave={release}
      onFocus={engage}
      onBlur={release}
      onClick={toggleOnce}
    >
      {tool === 'rotate' && <RotatePiece unit={unit} transformed={transformed} />}
      {tool === 'doubleHalve' && (
        <DoubleHalvePiece unit={unit} transformed={transformed} />
      )}
      {tool === 'cut' && <CutPiece unit={unit} transformed={transformed} />}
      {tool === 'combine' && (
        <CombinePiece unit={unit} transformed={transformed} />
      )}
    </Stage>
  );
}

/* ----------------------------- building blocks ---------------------------- */

interface GridProps {
  cols: number;
  rows: number;
  unit: number;
  color: string;
  layoutCells?: boolean;
}

/** A solid rectangular piece built from unit squares, like the game pieces. */
function PieceGrid({ cols, rows, unit, color, layoutCells }: GridProps) {
  const cells = Array.from({ length: cols * rows });
  return (
    <Grid $cols={cols} $unit={unit}>
      {cells.map((_, i) =>
        layoutCells ? (
          <MotionCell
            key={i}
            layout
            transition={CELL_SPRING}
            $unit={unit}
            $color={color}
          />
        ) : (
          <Cell key={i} $unit={unit} $color={color} />
        )
      )}
    </Grid>
  );
}

/* --------------------------------- rotate --------------------------------- */

function RotatePiece({ unit, transformed }: { unit: number; transformed: boolean }) {
  return (
    <PieceShadow
      animate={{ rotate: transformed ? 90 : 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 13 }}
    >
      <PieceGrid cols={3} rows={2} unit={unit} color={RED} />
    </PieceShadow>
  );
}

/* ------------------------------ double & halve ---------------------------- */

function DoubleHalvePiece({
  unit,
  transformed,
}: {
  unit: number;
  transformed: boolean;
}) {
  // 8 unit squares reflow from a tall 2×4 block to a wide 4×2 block while
  // conserving area — a visual stand-in for 4 × (2 × 3) = (4 × 2) × 3.
  const cols = transformed ? 4 : 2;
  const rows = transformed ? 2 : 4;
  return (
    <PieceShadow animate={{ scale: transformed ? [1, 1.05, 1] : 1 }}>
      <PieceGrid cols={cols} rows={rows} unit={unit} color={RED} layoutCells />
    </PieceShadow>
  );
}

/** A rectangular piece whose fill colour transitions (optionally delayed). */
function ColorGrid({
  cols,
  rows,
  unit,
  color,
  colorDelay = 0,
}: GridProps & { colorDelay?: number }) {
  const cells = Array.from({ length: cols * rows });
  return (
    <Grid $cols={cols} $unit={unit}>
      {cells.map((_, i) => (
        <ColorCell
          key={i}
          $unit={unit}
          style={{
            backgroundColor: color,
            transitionDelay: `${colorDelay}s`,
          }}
        />
      ))}
    </Grid>
  );
}

/* ----------------------------------- cut ---------------------------------- */

function CutPiece({ unit, transformed }: { unit: number; transformed: boolean }) {
  // Rest: one seamless salmon rectangle. Apply: the right product turns blue
  // first, then the two halves slide apart — 3(2 + 3) → 3(2) + 3(3).
  const sep = unit * 0.6;
  const slide = { ...SLIDE_SPRING, delay: transformed ? 0.25 : 0 };
  return (
    <SplitRow>
      <PieceShadow animate={{ x: transformed ? -sep : 0 }} transition={slide}>
        <ColorGrid cols={2} rows={2} unit={unit} color={RED} />
      </PieceShadow>
      <PieceShadow animate={{ x: transformed ? sep : 0 }} transition={slide}>
        <ColorGrid
          cols={3}
          rows={2}
          unit={unit}
          color={transformed ? TEAL : RED}
        />
      </PieceShadow>
    </SplitRow>
  );
}

/* --------------------------------- combine -------------------------------- */

function CombinePiece({
  unit,
  transformed,
}: {
  unit: number;
  transformed: boolean;
}) {
  // Rest: two separate pieces, salmon + blue, held well apart. Apply: they slam
  // together and meld into one all-salmon rectangle — 3(2) + 3(3) → 3(2 + 3).
  const sep = unit * 0.9;
  return (
    <SplitRow>
      <PieceShadow
        animate={{ x: transformed ? 0 : -sep }}
        transition={SLAM_SPRING}
      >
        <ColorGrid cols={2} rows={2} unit={unit} color={RED} />
      </PieceShadow>
      <PieceShadow
        animate={{ x: transformed ? 0 : sep }}
        transition={SLAM_SPRING}
      >
        <ColorGrid
          cols={3}
          rows={2}
          unit={unit}
          color={transformed ? RED : TEAL}
          colorDelay={transformed ? 0.18 : 0}
        />
      </PieceShadow>
    </SplitRow>
  );
}

/* --------------------------------- styles --------------------------------- */

const CELL_SPRING = { type: 'spring', stiffness: 260, damping: 24 } as const;
// Calm separation for the cut; smooth, well-damped glide (no bounce) for combine.
const SLIDE_SPRING = { type: 'spring', stiffness: 240, damping: 22 } as const;
const SLAM_SPRING = { type: 'spring', stiffness: 260, damping: 38 } as const;

const Stage = styled.div<{ $size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: ${props => props.$size + 10}px;
  cursor: pointer;
  outline: none;
  user-select: none;
`;

const Grid = styled.div<{ $cols: number; $unit: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$cols}, ${props => props.$unit}px);
  width: min-content;
`;

const Cell = styled.div<{ $unit: number; $color: string }>`
  width: ${props => props.$unit}px;
  height: ${props => props.$unit}px;
  border: 1.5px solid #1b1b1b;
  background-color: ${props => props.$color};
  box-sizing: border-box;
`;

const MotionCell = styled(motion.div)<{ $unit: number; $color: string }>`
  width: ${props => props.$unit}px;
  height: ${props => props.$unit}px;
  border: 1.5px solid #1b1b1b;
  background-color: ${props => props.$color};
  box-sizing: border-box;
`;

const ColorCell = styled.div<{ $unit: number }>`
  width: ${props => props.$unit}px;
  height: ${props => props.$unit}px;
  border: 1.5px solid #1b1b1b;
  box-sizing: border-box;
  transition: background-color 0.22s ease;
`;

const PieceShadow = styled(motion.div)`
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.28));
`;

const SplitRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default AnimatedToolPiece;

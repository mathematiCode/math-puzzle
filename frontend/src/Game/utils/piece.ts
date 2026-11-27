import { Cut, CutAxis, Piece } from '../../types/piece';
import levels from '../levels.json' with { type: 'json' };
import { colors } from '../../CONSTANTS';
import { convertLocationToXAndY } from './utilities';

/** The instructions sample piece lives in the modal, not the board/tray. */
const SAMPLE_PIECE_ORDER = [0];
const SAMPLE_PIECE_COLOR = 'hsl(0, 61%, 66%)';
const SAMPLE_PIECE_WIDTH = 3;
const SAMPLE_PIECE_HEIGHT = 2;

/**
 * Generate an opaque, stable, unique piece id. Ids never encode a piece's
 * state, order, or index — those live in separate fields (`location`,
 * `order`, `kind`). Random ids keep identity stable across splits/combines.
 */
export function generatePieceId(): string {
  return crypto.randomUUID();
}

/** Render an order path as a human-readable label, e.g. [3, 2, 1] -> "3.2.1". */
export function formatPath(order: number[]): string {
  return order.join('.');
}

/**
 * Compare two order paths segment-by-segment (numerically), so pieces sort in
 * depth-first order and split children stay adjacent to their siblings.
 * A shorter path that is a prefix of a longer one sorts first.
 * Returns <0, 0, or >0 for use with Array.prototype.sort.
 */
export function comparePath(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}

/** The stable, order-based test id / display label for a piece. */
export function pieceTestId(piece: Piece): string {
  return formatPath(piece.order);
}

export function isSample(piece: Piece): boolean {
  return piece.kind === 'sample';
}

/** A puzzle piece with a null location is in the tray; otherwise it's on the board. */
export function isOnBoard(piece: Piece): boolean {
  return piece.kind === 'puzzle' && piece.location != null;
}

/** Which cut axes are possible for a piece: an axis needs a side length >= 2. */
export function availableCutAxes(piece: Piece): CutAxis[] {
  const axes: CutAxis[] = [];
  if (piece.width >= 2) axes.push('vertical');
  if (piece.height >= 2) axes.push('horizontal');
  return axes;
}

/** A piece can be split only if it's a puzzle piece with at least one cuttable axis. */
export function canSplit(piece: Piece): boolean {
  return piece.kind === 'puzzle' && availableCutAxes(piece).length > 0;
}

/**
 * Split a piece into two children along the given cut. The two children subdivide
 * the parent exactly — no gaps, no overlap — and inherit its color, rotation and
 * kind. Each child gets a fresh unique id and a dewey-decimal order path appended
 * to the parent's (e.g. [3] -> [3, 1] and [3, 2]) so the pair sorts adjacent to
 * where the parent was (see comparePath) rather than jumping to the end of the tray.
 *
 * A vertical cut yields a left child (order .1) and a right child (order .2);
 * a horizontal cut yields a top child (.1) and a bottom child (.2). When the
 * parent is on the board, child locations tile its footprint; when it's in the
 * tray (location null), both children stay in the tray.
 */
export function createSplitPieces(parent: Piece, cut: Cut): [Piece, Piece] {
  const onBoard = isOnBoard(parent);
  const { x, y } = convertLocationToXAndY(parent.location);
  const shared = {
    kind: parent.kind,
    color: parent.color,
    isRotated: parent.isRotated,
    isStable: true,
  };

  let aSize: { width: number; height: number };
  let bSize: { width: number; height: number };
  let bLocation: string | null;

  if (cut.axis === 'vertical') {
    aSize = { width: cut.offset, height: parent.height };
    bSize = { width: parent.width - cut.offset, height: parent.height };
    bLocation = onBoard ? `(${x + cut.offset},${y})` : null;
  } else {
    aSize = { width: parent.width, height: cut.offset };
    bSize = { width: parent.width, height: parent.height - cut.offset };
    bLocation = onBoard ? `(${x},${y + cut.offset})` : null;
  }

  const childA: Piece = {
    ...shared,
    ...aSize,
    id: generatePieceId(),
    order: [...parent.order, 1],
    location: parent.location,
  };
  const childB: Piece = {
    ...shared,
    ...bSize,
    id: generatePieceId(),
    order: [...parent.order, 2],
    location: bLocation,
  };
  return [childA, childB];
}

export function createSamplePiece(): Piece {
  return {
    id: generatePieceId(),
    order: SAMPLE_PIECE_ORDER,
    kind: 'sample',
    width: SAMPLE_PIECE_WIDTH,
    height: SAMPLE_PIECE_HEIGHT,
    location: 'instructions',
    color: SAMPLE_PIECE_COLOR,
    isRotated: false,
    isStable: true,
  };
}

/**
 * Build the full set of pieces for a level: the sample piece followed by the
 * level's playable puzzle pieces. Each piece gets a fresh unique id; `order`
 * is the 1-based position so splits can subdivide it later (e.g. 3 -> 3.1, 3.2).
 */
export function createInitialPieces(level: number): Piece[] {
  return [
    createSamplePiece(),
    ...levels[level].pieces.map((piece, index) => ({
      ...piece,
      id: generatePieceId(),
      order: [index + 1],
      kind: 'puzzle' as const,
      location: null,
      color: colors[index % colors.length],
      isRotated: false,
      isStable: true,
    })),
  ];
}

export type PieceKind = 'puzzle' | 'sample';

/** Orientation of a cut line: 'vertical' slices left/right, 'horizontal' top/bottom. */
export type CutAxis = 'vertical' | 'horizontal';

/**
 * A whole-number cut of a piece. `offset` is the number of units from the left
 * (vertical axis) or top (horizontal axis) at which to divide, so it must be an
 * integer in the range 1..(side length - 1).
 */
export interface Cut {
  axis: CutAxis;
  offset: number;
}

export interface Piece {
  width: number;
  height: number;
  /** Opaque, stable, unique identifier. Never encodes state, order, or index. */
  id: string;
  /**
   * Display order + split lineage, as a hierarchical path.
   * e.g. [3] -> split into [3, 1] and [3, 2] -> [3, 2] split into [3, 2, 1], [3, 2, 2].
   * Sort pieces by comparing paths segment-by-segment (see comparePath).
   */
  order: number[];
  /** Whether this is a playable puzzle piece or the instructions sample piece. */
  kind: PieceKind;
  location: string | null;
  isRotated: boolean;
  color: string;
  isStable: boolean;
}

export interface InitialPiece {
  width: number;
  height: number;
  id: string;
  order: number[];
  kind: PieceKind;
  location: string | null;
  isRotated: boolean;
  color: string;
  isStable?: boolean;
}

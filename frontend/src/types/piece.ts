export type PieceKind = 'puzzle' | 'sample';

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

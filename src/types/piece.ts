export interface Piece {
  width: number;
  height: number;
  id: string;
  location: string | null;
  isRotated: boolean;
  color: string;
}

export interface InitialPiece {
  width: number;
  height: number;
}

export interface Piece {
  width: number;
  height: number;
  id?: string;
  location: string | null;
  isRotated?: boolean;
  color?: string;
  isStable?: boolean;
}

export interface InitialPiece {
  width: number;
  height: number;
  id: string;
  location: string | null;
  isRotated: boolean;
  color: string;
  isStable?: boolean;
}

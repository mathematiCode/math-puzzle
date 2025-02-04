interface Piece {
  id: string;
  location: string | null;
  isRotated: boolean;
  width: number;
  height: number;
  color: string;
}

export default Piece;

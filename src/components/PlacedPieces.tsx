import PieceOnBoard from './PieceOnBoard.tsx';

interface Piece {
  id: string;
  location: string | null;
  isRotated: boolean;
  width: number;
  height: number;
  color: string;
}
function PlacedPieces({ piecesInPlay }: { piecesInPlay: Piece[] }) {
  return (
    <div className="placed-pieces">
      {piecesInPlay.map((piece, index) =>
        piece.location != null ? (
          <PieceOnBoard
            piece={piece}
            id={`inPlay-${index}`}
            key={`inPlay-${index}`}
          />
        ) : null
      )}
    </div>
  );
}

export default PlacedPieces;

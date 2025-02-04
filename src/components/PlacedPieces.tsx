import PieceOnBoard from './PieceOnBoard.tsx';
import Piece from '../types/piece';

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

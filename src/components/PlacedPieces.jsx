/* eslint-disable react/prop-types */
import PieceOnBoard from './PieceOnBoard';
function PlacedPieces({ piecesInPlay }) {
  return (
    <div className="placed-pieces">
      {piecesInPlay.map(piece =>
        piece.location != null ? (
          <PieceOnBoard key={piece.id} piece={piece} />
        ) : null
      )}
    </div>
  );
}

export default PlacedPieces;

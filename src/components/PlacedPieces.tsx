/* eslint-disable react/prop-types */
import PieceOnBoard from './PieceOnBoard';
function PlacedPieces({ piecesInPlay }) {
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

import PuzzlePiece from './PuzzlePiece';
function PlacedPieces({ piecesInPlay }) {
  return (
    <div className="placed-pieces">
      <PuzzlePiece width={5} height={6} color="blue" />
    </div>
  );
}

export default PlacedPieces;

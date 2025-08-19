import PieceOnBoard from '../PuzzlePieces/PieceOnBoard';
import { Piece } from '../../types/piece';
import styled from 'styled-components';

function PlacedPieces({
  piecesInPlay,
  isRotating,
  setIsRotating,
}: {
  piecesInPlay: Piece[];
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
}) {
  return (
    <PlacedPiecesWrapper>
      {piecesInPlay.map(piece =>
        piece.location != null &&
        piece.location != 'instructions' &&
        piece.id != 'sample-0' ? (
          <PieceOnBoard
            piece={piece}
            key={piece.id}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
          />
        ) : null
      )}
    </PlacedPiecesWrapper>
  );
}

export const PlacedPiecesWrapper = styled.div`
  grid-column: 1/2;
  grid-row: 1/2;
  position: relative;
`;

export default PlacedPieces;

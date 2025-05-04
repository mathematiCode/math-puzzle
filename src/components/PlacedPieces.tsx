import PieceOnBoard from './PieceOnBoard.tsx';
import { Piece } from '../types/piece';
import styled from 'styled-components';
function PlacedPieces({ piecesInPlay, isRotating, setIsRotating }: { piecesInPlay: Piece[], isRotating: boolean, setIsRotating: (isRotating: boolean) => void }) {
  return (
    <PlacedPiecesWrapper>
      {piecesInPlay.map((piece, index) =>
        piece.location != null && piece.location != 'instructions' ? (
          <PieceOnBoard
            piece={piece}
            id={`inPlay-${index}`}
            key={`inPlay-${index}`}
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

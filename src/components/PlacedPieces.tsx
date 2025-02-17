import PieceOnBoard from './PieceOnBoard.tsx';
import { Piece } from '../types/piece';
import styled from 'styled-components';
function PlacedPieces({ piecesInPlay }: { piecesInPlay: Piece[] }) {
  return (
    <PlacedPiecesWrapper>
      {piecesInPlay.map((piece, index) =>
        piece.location != null ? (
          <PieceOnBoard
            piece={piece}
            id={`inPlay-${index}`}
            key={`inPlay-${index}`}
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

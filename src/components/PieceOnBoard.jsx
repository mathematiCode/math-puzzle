/* eslint-disable react/prop-types */
import PuzzlePiece from './PuzzlePiece';
import styled from 'styled-components';

const StyledPuzzlePiece = styled(PuzzlePiece)`
  position: fixed;
  margin-left: 100px;
  margin-top: 200px;
  border: 3px solid yellow;
`;
function PieceOnBoard({ piece }) {
  return (
    <StyledPuzzlePiece
      key={piece.id}
      width={piece.width}
      height={piece.height}
      color={piece.color}
    />
  );
}

export default PieceOnBoard;

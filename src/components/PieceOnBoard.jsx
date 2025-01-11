/* eslint-disable react/prop-types */
import PuzzlePiece from './PuzzlePiece';
import styled from 'styled-components';
import { sizeOfEachUnit } from '../App';

const StyledPuzzlePiece = styled(PuzzlePiece)`
  position: absolute;
  left: ${props => props.x * sizeOfEachUnit - 1}px;
  top: ${props => props.y * sizeOfEachUnit - 1}px;
`;

function convertlocationToXAndY(location) {
  const cleanedString = location.replace(/[()]/g, '');
  const [x, y] = cleanedString.split(',').map(Number);
  return { x, y };
}
function PieceOnBoard({ piece }) {
  const { x, y } = convertlocationToXAndY(piece.location);
  console.log(x, y);
  return (
    <StyledPuzzlePiece
      key={piece.id}
      id={piece.id}
      width={piece.width}
      height={piece.height}
      color={piece.color}
      x={x}
      y={y}
    />
  );
}

export default PieceOnBoard;

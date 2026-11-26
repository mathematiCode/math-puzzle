import styled from 'styled-components';
import Rectangle from '../Rectangle';
import { Piece } from '../../types/piece';
import { convertLocationToXAndY } from '../utils/utilities';

/*
  A translucent "ghost" of the piece currently being dragged, rendered at the
  location where the piece would land if it were dropped right now. Inspired by
  the half-opacity preview in Block Blast (see GitHub issue #83).

  It is purely visual: it never receives pointer events and sits just below the
  real pieces (z-index 5, PieceOnBoard is 6) so the dragged piece stays on top.
*/

const PreviewContainer = styled.div`
  grid-column: 1/2;
  grid-row: 1/2;
  position: relative;
  pointer-events: none;
`;

const PreviewWrapper = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${({ x }) => `calc(${x} * var(--sizeOfEachUnit) - 2px)`};
  top: ${({ y }) => `calc(${y} * var(--sizeOfEachUnit) - 2px)`};
  opacity: 0.4;
  z-index: 5;
  border: 2px dashed black;
`;

function PiecePreview({
  piece,
  location,
}: {
  piece: Piece;
  location: string;
}) {
  const { x, y } = convertLocationToXAndY(location);
  return (
    <PreviewContainer>
      <PreviewWrapper x={x} y={y} data-testid="piece-preview">
        <Rectangle
          width={piece.width}
          height={piece.height}
          unitSize={1}
          color={piece.color}
        />
      </PreviewWrapper>
    </PreviewContainer>
  );
}

export default PiecePreview;

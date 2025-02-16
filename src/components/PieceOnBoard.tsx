import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle.tsx';
import ActionsToolbarPopover from './ActionsToolbarPopover.tsx';
import { memo, useContext } from 'react';
import { motion } from 'motion/react';
import styled from 'styled-components';

import { SelectedPieceContext } from '../context/SelectedPiece.tsx';
import { PiecesInPlayContext } from '../context/PiecesInPlay';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';

interface Piece {
  id: string;
  location: string | null;
  isRotated: boolean;
  width: number;
  height: number;
  color: string;
}

export const PieceWrapper = styled(motion.div).attrs(props => ({
  onClick: props.onClick,
  ref: props.ref,
  animate: props.animate,
  transition: props.transition,
}))`
  position: absolute;
  touch-action: none;
  left: ${({ x }) => `calc(${x} * var(--sizeOfEachUnit))`};
  top: ${({ y }) => `calc(${y} * var(--sizeOfEachUnit))`};
  cursor: ${({ isDragging }) => (isDragging ? 'grab' : 'auto')};
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? 'rgba(0, 0, 0, 0.5) 0px 19px 19px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
      : 'none'};
`;

function PieceOnBoard({ piece, id }: { piece: Piece; id: string }) {
  const { selectedPiece, setSelectedPiece } = useContext(SelectedPieceContext);
  const { piecesInPlay } = useContext(PiecesInPlayContext);
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);

  function convertlocationToXAndY(location: string | null) {
    if (!location) return { x: 0, y: 0 };
    const cleanedString = location.replace(/[()]/g, '');
    const [x, y] = cleanedString.split(',').map(Number);
    return { x, y };
  }

  const { x, y } = convertlocationToXAndY(piece.location);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: id,
    });
  const isSelected = selectedPiece?.id === id;

  const style = {
    position: 'absolute',
    touchAction: 'none',
    left: `${x * sizeOfEachUnit}px`,
    top: `${y * sizeOfEachUnit}px`,
    ...(isDragging && { cursor: 'grab' }),
    ...(selectedPiece?.id === id && {
      boxShadow:
        'rgba(0, 0, 0, 0.5) 0px 19px 19px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
    }),
  };

  function handlePieceSelected() {
    const chosenPiece = piecesInPlay.find((piece: Piece) => id === piece.id);
    setSelectedPiece(chosenPiece);
  }

  return (
    <ActionsToolbarPopover>
      <PieceWrapper
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={handlePieceSelected}
        animate={{
          rotate: piece.isRotated ? 90 : 0,
        }}
        transition={{ duration: 0.5 }}
        x={x}
        y={y}
        isDragging={isDragging}
        isSelected={isSelected}
      >
        <Rectangle
          width={piece.width}
          height={piece.height}
          color={piece.color}
          isMotion={true}
        />
      </PieceWrapper>
    </ActionsToolbarPopover>
  );
}

export default memo(PieceOnBoard);

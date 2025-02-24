import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle.tsx';
import ActionsToolbarPopover from './ActionsToolbarPopover.tsx';
import { memo, useContext } from 'react';
import { motion } from 'motion/react';
import styled from 'styled-components';
import { convertLocationToXAndY } from '../utilities.ts';

import {
  SelectedPieceContext,
  SelectedPieceContextType,
} from '../context/SelectedPiece.tsx';
import {
  PiecesInPlayContext,
  PiecesInPlayContextType,
} from '../context/PiecesInPlay.tsx';
import { Piece } from '../types/piece.ts';

export const PieceWrapper = styled(motion.button).attrs(props => ({
  onClick: props.onClick,
  ref: props.ref,
  animate: props.animate,
  transition: props.transition,
}))`
  position: absolute;
  left: ${({ x }) => `calc(${x} * var(--sizeOfEachUnit))`};
  top: ${({ y }) => `calc(${y} * var(--sizeOfEachUnit))`};
  cursor: ${({ isDragging }) => (isDragging ? 'grab' : 'pointer')};
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? 'rgba(0, 0, 0, 0.5) 0px 19px 19px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
      : 'none'};
`;

function PieceOnBoard({ piece, id }: { piece: Piece; id: string }) {
  const { selectedPiece, setSelectedPiece } =
    useContext<SelectedPieceContextType>(SelectedPieceContext);
  const { piecesInPlay } =
    useContext<PiecesInPlayContextType>(PiecesInPlayContext);

  const { x, y } = convertLocationToXAndY(piece.location);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: id,
    });
  const isSelected = selectedPiece?.id === id;

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

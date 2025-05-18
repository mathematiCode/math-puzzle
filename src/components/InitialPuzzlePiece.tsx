// @ts-nocheck
import { useContext, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle.tsx';
import ActionsToolbarPopover from './ActionsToolbarPopover.tsx';
import { motion, useAnimate } from 'motion/react';
import { useSelectedPiece } from '../context/SelectedPiece.tsx';
import { PiecesInPlayContext } from '../context/PiecesInPlay.tsx';
import { Piece } from '../types/piece.ts';
import styled from 'styled-components';
import { mergeRefs } from '@chakra-ui/react';

const InitialPuzzlePiece = ({
  piece,
  isRotating,
  setIsRotating,
  isExample = false,
}: {
  piece: Piece;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  isExample?: boolean;
}) => {
  const { selectedPiece, setSelectedPiece } = useSelectedPiece();
  const [scope, animate] = useAnimate();
  const { updateDimensions } = useContext(PiecesInPlayContext);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: piece.id,
  });
  const refs = mergeRefs(scope, setNodeRef);

  function handlePieceSelected() {
    setSelectedPiece(piece);
  }

  async function runRotationAnimation(selectedPiece) {
    const id = selectedPiece?.id;
    const pieceIndex = parseInt(id?.slice(id?.indexOf('-') + 1) ?? '0', 10);
    setIsRotating(true);
    await animate(
      scope.current,
      { rotate: 90 },
      { type: 'spring', stiffness: 150, damping: 11 }
    );
    updateDimensions(pieceIndex, selectedPiece?.height, selectedPiece.width);
    await animate(scope.current, { rotate: 0 }, { duration: 0 });
    setIsRotating(false);
  }

  const isSelected = selectedPiece?.id === piece.id;

  return (
    <InitialPieceWrapper isSelected={isSelected} isDragging={isDragging}>
      <ActionsToolbarPopover runRotationAnimation={runRotationAnimation}>
        <motion.button
          ref={refs}
          {...listeners}
          {...attributes}
          onClick={handlePieceSelected}
          layout={!isRotating}
        >
          <Rectangle
            width={piece.width}
            height={piece.height}
            color={piece.color}
            isMotion={true}
            layout={!isRotating}
            isSelected={isSelected}
            isExample={isExample}
          />
        </motion.button>
      </ActionsToolbarPopover>
    </InitialPieceWrapper>
  );
};

// Fix cursor type so when isDragging is true, it's grab, otherwise it's pointer
// Change to button and fix extra space below.
export const InitialPieceWrapper = styled(motion.div)`
  cursor: ${({ isDragging }) => (isDragging ? 'grab' : 'pointer')};
  visibility: ${({ isDragging }) => (isDragging ? 'hidden' : 'visible')};
  border: none;
  z-index: 2;
`;

InitialPuzzlePiece.displayName = 'InitialPuzzlePiece';

export default InitialPuzzlePiece;

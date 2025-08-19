// @ts-nocheck
import { useContext, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Rectangle from '../Rectangle';
import ActionsToolbarPopover from '../ActionsToolbar/ActionsToolbarPopover';
import { motion, useAnimate } from 'motion/react';
import { useSelectedPiece } from '../../context/SelectedPiece';
import { PiecesInPlayContext } from '../../context/PiecesInPlay';
import { Piece } from '../../types/piece';
import styled from 'styled-components';
import { mergeRefs } from '@chakra-ui/react';
import Hotjar from '@hotjar/browser';

const InitialPuzzlePiece = ({
  piece,
  isRotating,
  setIsRotating,
  isExample = false,
  isActive = false,
  setActivePiece,
}: {
  piece: Piece;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  isExample?: boolean;
  isActive?: boolean;
  setActivePiece: (piece: Piece) => void;
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
    setActivePiece(piece);
    Hotjar.event(
      `initial piece selected width:${piece.width} height:${piece.height}`
    );
  }

  async function runRotationAnimation(selectedPiece) {
    const id = selectedPiece?.id;
    const pieceIndex = parseInt(id?.slice(id?.indexOf('-') + 1) ?? '0', 10);
    setIsRotating(true);
    try {
      await animate(
        scope.current,
        { rotate: 90 },
        { type: 'spring', stiffness: 150, damping: 11 }
      );
      console.log(`selected piece to rotate is`, selectedPiece);
      // Use the current piece dimensions from the piece prop instead of selectedPiece
      updateDimensions(piece.id, piece.height, piece.width);
      await animate(scope.current, { rotate: 0 }, { duration: 0 });
    } finally {
      setIsRotating(false);
    }
    Hotjar.event('rotation');
  }

  const isSelected = selectedPiece?.id === piece.id;

  return (
    <ActionsToolbarPopover runRotationAnimation={runRotationAnimation}>
      <InitialPieceWrapper
        ref={refs}
        {...listeners}
        {...attributes}
        onClick={handlePieceSelected}
        isDragging={isDragging && isSelected}
        layout={!isRotating && !isDragging}
        {...(!(isRotating && isSelected) ? { layoutId: piece.id } : {})}
      >
        <Rectangle
          width={piece.width}
          height={piece.height}
          unitSize={
            window.innerWidth >= 750 || isActive || isDragging ? 1 : 0.7
          }
          color={piece.color}
          isMotion={true}
          layout={!isRotating}
          isSelected={isSelected}
          isExample={isExample}
        />
      </InitialPieceWrapper>
    </ActionsToolbarPopover>
  );
};

export const InitialPieceWrapper = styled(motion.button)`
  visibility: ${({ isDragging }) => (isDragging ? 'hidden' : 'visible')};
  border: none;
  z-index: 2;
  border: 2px solid black;
  margin: 0;
  &:active {
    cursor: grab;
  }
`;

InitialPuzzlePiece.displayName = 'InitialPuzzlePiece';

export default InitialPuzzlePiece;

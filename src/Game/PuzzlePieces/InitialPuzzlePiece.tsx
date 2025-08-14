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

  // Safari-specific focus management
  const handleFocus = (event: React.FocusEvent) => {
    // Ensure proper focus management in Safari
    event.currentTarget.setAttribute('data-focused', 'true');
  };

  const handleBlur = (event: React.FocusEvent) => {
    // Clean up focus state in Safari
    event.currentTarget.removeAttribute('data-focused');
  };

  function handlePieceSelected() {
    setSelectedPiece(piece);
    setActivePiece(piece);
    Hotjar.event(
      `initial piece selected width:${piece.width} height:${piece.height}`
    );
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePieceSelected();
    }
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
      updateDimensions(piece.id, selectedPiece.height, selectedPiece.width);
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
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isDragging={isDragging && isSelected}
        layout={!isRotating && !isDragging}
        tabIndex={0}
        role="button"
        aria-label={`Select puzzle piece ${piece.id}`}
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
  outline: none;
  cursor: pointer;
  position: relative;

  &:active {
    cursor: grab;
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  /* Safari-specific focus management */
  &[data-focused='true'] {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  /* Ensure proper stacking context for Safari */
  transform: translateZ(0);
`;

InitialPuzzlePiece.displayName = 'InitialPuzzlePiece';

export default InitialPuzzlePiece;

// @ts-nocheck
import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Rectangle from '../Rectangle';
import ActionsToolbarPopover from '../ActionsToolbar/ActionsToolbarPopover';
import { motion, useAnimate } from 'motion/react';
import { useSelectedPiece } from '../../context/SelectedPiece';
import { usePiecesInPlay } from '../../context/PiecesInPlay';
import { Piece } from '../../types/piece';
import styled from 'styled-components';
import { mergeRefs } from '@chakra-ui/react';
import Hotjar from '@hotjar/browser';

const SamplePiece = ({
  piece,
  isRotating,
  setIsRotating,
  isActive = false,
  setActivePiece,
}: {
  piece: Piece;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  isActive?: boolean;
  setActivePiece: (piece: Piece) => void;
}) => {
  const { selectedPiece, setSelectedPiece } = useSelectedPiece();
  const [scope, animate] = useAnimate();
  const { updateDimensions } = usePiecesInPlay();

  function handlePieceSelected() {
    setSelectedPiece(piece);
    setActivePiece(piece);
    Hotjar.event(
      `sample piece selected width:${piece.width} height:${piece.height}`
    );
  }

  async function runRotationAnimation(selectedPiece) {
    setIsRotating(true);
    try {
      await animate(
        scope.current,
        { rotate: 90 },
        { type: 'spring', stiffness: 150, damping: 11 }
      );
      // Use the current piece dimensions from the piece prop instead of selectedPiece
      updateDimensions('sample-0', piece.height, piece.width);
      await animate(scope.current, { rotate: 0 }, { duration: 0 });
    } finally {
      setIsRotating(false);
    }
    Hotjar.event('rotation');
  }

  const isSelected = selectedPiece?.id === piece.id;

  return (
    <ActionsToolbarPopover
      data-testid={`actions-toolbar-trigger`}
      runRotationAnimation={runRotationAnimation}
    >
      <SamplePieceWrapper
        ref={scope}
        data-testid={piece.id}
        onClick={handlePieceSelected}
        {...(!(isRotating && isSelected) ? { layoutId: piece.id } : {})}
      >
        <Rectangle
          width={piece.width}
          height={piece.height}
          color={'hsla(0, 61%, 66%, 1)'}
          isMotion={true}
          isSelected={isSelected}
          isExample={true}
          layout={!isRotating}
        />
      </SamplePieceWrapper>
    </ActionsToolbarPopover>
  );
};

export const SamplePieceWrapper = styled(motion.button)`
  border: none;
  z-index: 2;
  border: 2px solid black;
  margin-bottom: 30px;
  margin-left: 20px;
  margin-top: 10px;
  place-self: center;
  &:active {
    cursor: grab;
  }
`;

SamplePiece.displayName = 'SamplePiece';

export default SamplePiece;

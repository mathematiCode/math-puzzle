// @ts-nocheck
import { useContext, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Rectangle from '../Rectangle';
import ActionsToolbarPopover from '../ActionsToolbar/ActionsToolbarPopover.js';
import { motion, useAnimate } from 'motion/react';
import { useSelectedPiece } from '../../context/SelectedPiece.js';
import { PiecesInPlayContext } from '../../context/PiecesInPlay.js';
import { Piece } from '../../types/piece.js';
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
  const { updateDimensions } = useContext(PiecesInPlayContext);

  function handlePieceSelected() {
    setSelectedPiece(piece);
    setActivePiece(piece);
    Hotjar.event(
      `sample piece selected width:${piece.width} height:${piece.height}`
    );
  }

  async function runRotationAnimation(selectedPiece) {
    const pieceIndex = 0; // sample piece is always 0
    setIsRotating(true);
    try {
      await animate(
        scope.current,
        { rotate: 90 },
        { type: 'spring', stiffness: 150, damping: 11 }
      );
      updateDimensions(pieceIndex, selectedPiece.height, selectedPiece.width);
      await animate(scope.current, { rotate: 0 }, { duration: 0 });
    } finally {
      setIsRotating(false);
    }
    Hotjar.event('rotation');
  }

  const isSelected = selectedPiece?.id === piece.id;

  return (
    <ActionsToolbarPopover runRotationAnimation={runRotationAnimation}>
      <SamplePieceWrapper
        ref={scope}
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
  margin: 0;
  margin-bottom: 30px;
  margin-top: 10px;
  &:active {
    cursor: grab;
  }
`;

SamplePiece.displayName = 'SamplePiece';

export default SamplePiece;

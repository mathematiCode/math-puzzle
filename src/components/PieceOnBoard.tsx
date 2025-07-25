// @ts-nocheck
import { useDraggable } from '@dnd-kit/core';
import { mergeRefs } from '@chakra-ui/react';
import Rectangle from './Rectangle.tsx';
import ActionsToolbarPopover from './ActionsToolbarPopover.tsx';
import { useState, memo, useContext } from 'react';
import { motion, useAnimate } from 'motion/react';
import styled from 'styled-components';
import { convertLocationToXAndY } from '../utilities.ts';
import { Piece } from '../types/piece.ts';
import {
  SelectedPieceContext,
  SelectedPieceContextType,
} from '../context/SelectedPiece.tsx';
import {
  PiecesInPlayContext,
  PiecesInPlayContextType,
} from '../context/PiecesInPlay.tsx';
import {
  CurrentLevelContext,
  CurrentLevelContextType,
} from '../context/CurrentLevel.tsx';
import Hotjar from '@hotjar/browser';

export const PieceWrapper = styled.button.attrs(props => ({
  onClick: props.onClick,
  ref: props.ref,
  $isDragging: props.isDragging,
  animate: props.animate,
  transition: props.transition,
}))`
  position: absolute;
  left: ${({ x }) => `calc(${x} * var(--sizeOfEachUnit))`};
  top: ${({ y }) => `calc(${y} * var(--sizeOfEachUnit))`};
  cursor: ${({ isDragging }) => (isDragging ? 'grab' : 'pointer')};
  visibility: ${({ isDragging }) => (isDragging ? 'hidden' : 'visible')};
  z-index: 2;
  &:active {
    cursor: grab;
  }
`;

function PieceOnBoard({
  piece,
  id,
  isRotating,
  setIsRotating,
}: {
  piece: Piece;
  id: string;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
}) {
  const { selectedPiece, setSelectedPiece } =
    useContext<SelectedPieceContextType>(SelectedPieceContext);
  const { piecesInPlay, updateDimensions, movePiece } =
    useContext<PiecesInPlayContextType>(PiecesInPlayContext);
  const { sizeOfEachUnit } =
    useContext<CurrentLevelContextType>(CurrentLevelContext);
  const [scope, animate] = useAnimate();

  const { x, y } = convertLocationToXAndY(piece.location);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: id,
    });
  const refs = mergeRefs(scope, setNodeRef);
  const isSelected = selectedPiece?.id === id;

  async function runRotationAnimation(selectedPiece) {
    let xOffset = Math.round(selectedPiece.height / 2) * sizeOfEachUnit;
    let yOffset = Math.round(selectedPiece.width / 2) * sizeOfEachUnit;
    const id = selectedPiece?.id;
    const pieceIndex = parseInt(id?.slice(id?.indexOf('-') + 1) ?? '0', 10);
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
      const { x, y } = convertLocationToXAndY(selectedPiece.location);
      let newX = x + Math.floor(selectedPiece.height / 2) - 1;
      let newY = y + Math.floor(selectedPiece.width / 2) - 1;
      movePiece(pieceIndex, `(${newX},${newY})`);
    }
    Hotjar.event('rotation');
  }

  function handlePieceSelected() {
    const chosenPiece = piecesInPlay.find((piece: Piece) => id === piece.id);
    setSelectedPiece(chosenPiece);
    Hotjar.event(
      `board piece selected width:${piece.width} height:${piece.height}`
    );
  }

  return (
    <ActionsToolbarPopover runRotationAnimation={runRotationAnimation}>
      <PieceWrapper
        ref={refs}
        {...listeners}
        {...attributes}
        onClick={handlePieceSelected}
        x={x}
        y={y}
        layout={!isRotating && !isDragging}
        isDragging={isDragging}
      >
        <Rectangle
          width={piece.width}
          height={piece.height}
          unitSize={1}
          color={piece.color}
          layout={!isRotating}
          isMotion={true}
          isSelected={isSelected}
        />
      </PieceWrapper>
    </ActionsToolbarPopover>
  );
}

export default memo(PieceOnBoard);

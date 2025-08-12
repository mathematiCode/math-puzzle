// @ts-nocheck
import { useDraggable } from '@dnd-kit/core';
import { mergeRefs } from '@chakra-ui/react';
import Rectangle from '../Rectangle';
import ActionsToolbarPopover from '../ActionsToolbar/ActionsToolbarPopover';
import { useState, memo, useContext } from 'react';
import { motion, useAnimate } from 'motion/react';
import styled from 'styled-components';
import { convertLocationToXAndY } from '../utils/utilities';
import { Piece } from '../../types/piece';
import {
  SelectedPieceContext,
  SelectedPieceContextType,
} from '../../context/SelectedPiece';
import {
  PiecesInPlayContext,
  PiecesInPlayContextType,
} from '../../context/PiecesInPlay';
import {
  CurrentLevelContext,
  CurrentLevelContextType,
} from '../../context/CurrentLevel';
import Hotjar from '@hotjar/browser';
import {
  BoardSquaresContext,
  BoardSquaresContextType,
} from '../../context/BoardSquares';
import { getNewValidLocation } from '../utils/getNewValidLocation';

export const PieceWrapper = styled(motion.button)
  .withConfig({
    shouldForwardProp: prop => prop !== 'isDragging' && prop !== 'isSelected',
  })
  .attrs(props => ({
    onClick: props.onClick,
    ref: props.ref,
    animate: props.animate,
    transition: props.transition,
  }))`
  position: absolute;
  left: ${({ x }) => `calc(${x} * var(--sizeOfEachUnit) - 2px)`};
  top: ${({ y }) => `calc(${y} * var(--sizeOfEachUnit) - 2px)`};
  cursor: ${({ isDragging }) => (isDragging ? 'grab' : 'pointer')};
  visibility: ${({ isDragging, isSelected }) =>
    isDragging && isSelected ? 'hidden' : 'visible'}; 
  z-index: 6;
  &:active {
    cursor: grab;
  }
  border: 2px solid black;
`;

function PieceOnBoard({
  piece,
  isRotating,
  setIsRotating,
  isStable = true,
}: {
  piece: Piece;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  isStable: boolean;
}) {
  const { selectedPiece, setSelectedPiece } =
    useContext<SelectedPieceContextType>(SelectedPieceContext);
  const { piecesInPlay, updateDimensions, movePiece } =
    useContext<PiecesInPlayContextType>(PiecesInPlayContext);
  const { sizeOfEachUnit, boardDimensions } =
    useContext<CurrentLevelContextType>(CurrentLevelContext);
  const { addPieceToBoard, removePieceFromBoard } =
    useContext<BoardSquaresContextType>(BoardSquaresContext);
  const [scope, animate] = useAnimate();

  const { x, y } = convertLocationToXAndY(piece.location);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: piece.id,
    });
  const refs = mergeRefs(scope, setNodeRef);
  const isSelected = selectedPiece?.id === piece.id;

  /* This function lives here instead of ActionsToolbar for three reasons
  1. It needs to be access to the scope ref that's attached to the PieceWrapper and that would require ref forwarding to put it in the ActionsToolbarPopover
  2. It needs access to setIsRotating 
  3. There is additional logic for PieceOnBoard rotations to adjust the piece location after the rotation to make it appear to rotate around the center. 
  */
  async function runRotationAnimation(selectedPiece) {
    const id = selectedPiece?.id;
    const pieceIndex = parseInt(id?.slice(id?.indexOf('-') + 1) ?? '0', 10);
    const { x, y } = convertLocationToXAndY(selectedPiece.location);
    const oldWidth = selectedPiece.width;
    const oldHeight = selectedPiece.height;
    const newWidth = oldHeight;
    const newHeight = oldWidth;
    const { boardWidth, boardHeight } = boardDimensions;
    removePieceFromBoard(x, y, oldWidth, oldHeight, selectedPiece.id);

    setIsRotating(true);
    try {
      await animate(
        scope.current,
        { rotate: 90 },
        { type: 'spring', stiffness: 150, damping: 11 }
      );
      updateDimensions(piece.id, newWidth, newHeight);
      await animate(scope.current, { rotate: 0 }, { duration: 0 });
    } finally {
      setIsRotating(false);

      let newX = x + Math.floor((oldWidth - newWidth) / 2);
      let newY = y + Math.floor((oldHeight - newHeight) / 2);

      const { correctedX, correctedY } = getNewValidLocation(
        newX,
        newY,
        newWidth,
        newHeight,
        boardWidth,
        boardHeight
      );

      movePiece(piece.id, `(${correctedX},${correctedY})`);
      addPieceToBoard(
        correctedX,
        correctedY,
        newWidth,
        newHeight,
        selectedPiece.id
      );
    }
    Hotjar.event('rotation');
  }

  function handlePieceSelected() {
    const chosenPiece = piecesInPlay.find(
      (pieceInList: Piece) => piece.id === pieceInList.id
    );
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
        data-testid={piece.id}
        x={x}
        y={y}
        layout={!isRotating && !isDragging && !isStable}
        isDragging={isDragging}
        isSelected={isSelected}
        isStable={isStable}
        animate={
          isStable
            ? { x: 0, y: 0 }
            : { x: [0, -1, 1, -1, 1, 0], y: [0, 1, -1, 1, -1, 0] }
        }
        transition={
          isStable
            ? { duration: 0.1 } // or 0 for instant snap
            : { duration: 0.2, repeat: Infinity, ease: 'linear' }
        }
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

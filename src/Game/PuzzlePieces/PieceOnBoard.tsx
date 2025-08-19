import { useDraggable } from '@dnd-kit/core';
import { mergeRefs } from '@chakra-ui/react';
import Rectangle from '../Rectangle';
import ActionsToolbarPopover from '../ActionsToolbar/ActionsToolbarPopover';
import { memo, useContext } from 'react';
import { motion, useAnimate, HTMLMotionProps } from 'motion/react';
import styled from 'styled-components';
import { convertLocationToXAndY } from '../utils/utilities';
import { Piece } from '../../types/piece';
import {
  SelectedPieceContext,
  SelectedPieceContextType,
} from '../../context/SelectedPiece';
import { usePiecesInPlay } from '../../context/PiecesInPlay';
import { useCurrentLevel } from '../../context/CurrentLevel';
import Hotjar from '@hotjar/browser';
import { BoardSquaresContext } from '../../context/BoardSquares';
import { getNewValidLocation } from '../utils/getNewValidLocation';
import { getRandomVibrationAnimation } from '../utils/getRandomVibrationAnimation';

interface PieceWrapperProps extends HTMLMotionProps<'button'> {
  x: number;
  y: number;
  isDragging?: boolean;
  isSelected?: boolean;
}

export const PieceWrapper = styled(motion.button)
  .withConfig({
    shouldForwardProp: prop => prop !== 'isDragging' && prop !== 'isSelected',
  })
  .attrs(props => ({
    onClick: props.onClick,
    ref: props.ref,
    animate: props.animate,
    transition: props.transition,
  }))<PieceWrapperProps>`
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
}: {
  piece: Piece;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
}) {
  const isStable = piece.isStable;
  const selectedPieceContext = useContext(SelectedPieceContext);
  const { piecesInPlay, updateDimensions, movePiece } = usePiecesInPlay();
  const currentLevelContext = useCurrentLevel();
  const boardSquaresContext = useContext(BoardSquaresContext);

  if (!selectedPieceContext || !boardSquaresContext) {
    throw new Error('PieceOnBoard must be used within all required providers');
  }

  const { selectedPiece, setSelectedPiece } = selectedPieceContext;
  const { boardDimensions } = currentLevelContext;
  const { addPieceToBoard, removePieceFromBoard } = boardSquaresContext;
  const [scope, animate] = useAnimate();

  const { x, y } = convertLocationToXAndY(piece.location);

  const { attributes, isDragging, listeners, setNodeRef } = useDraggable({
    id: piece.id,
  });
  const refs = mergeRefs(scope, setNodeRef);
  const isSelected = selectedPiece?.id === piece.id;

  /* This rotation animation function lives here instead of ActionsToolbar for two reasons
  1. It needs to be access to the scope ref that's attached to the PieceWrapper and that would be very complicated to pass to ActionsToolbarPopover. I would need to pass the ref upward to it's parent and I can't create the ref in ActionsToolbar and then pass it down through {children}. And since I'm using mergeRefs to attach two different refs to the PieceWrapper, I can't use a callback Ref. 
  3. There is additional logic for PieceOnBoard rotations to adjust the piece location after the rotation to make it appear to rotate around the center. 
  */
  async function runRotationAnimation(selectedPiece: Piece) {
    // Get the current piece from PiecesInPlay to ensure we have up-to-date dimensions
    const currentPiece = piecesInPlay.find(p => p.id === selectedPiece.id);
    if (!currentPiece) {
      console.error('Current piece not found in PiecesInPlay');
      return;
    }

    const { x, y } = convertLocationToXAndY(currentPiece.location);
    const oldWidth = currentPiece.width;
    const oldHeight = currentPiece.height;
    const newWidth = oldHeight;
    const newHeight = oldWidth;
    const { boardWidth, boardHeight } = boardDimensions;
    removePieceFromBoard(x, y, oldWidth, oldHeight, currentPiece.id);

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
        currentPiece.id
      );
    }
    Hotjar.event('rotation');
  }

  function handlePieceSelected() {
    const chosenPiece = piecesInPlay.find(
      (pieceInList: Piece) => piece.id === pieceInList.id
    );
    setSelectedPiece(chosenPiece ?? null);
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
        x={x as number}
        y={y as number}
        layout={!isRotating && !isDragging && !isStable}
        isDragging={isDragging}
        isSelected={isSelected}
        animate={isStable ? { x: 0, y: 0 } : getRandomVibrationAnimation()}
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

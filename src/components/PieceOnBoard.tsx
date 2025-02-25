import { useDraggable } from '@dnd-kit/core';
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
import { mergeRefs } from '@chakra-ui/react';
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
  const { piecesInPlay, updateDimensions } =
    useContext<PiecesInPlayContextType>(PiecesInPlayContext);
  const { sizeOfEachUnit } =
    useContext<CurrentLevelContextType>(CurrentLevelContext);
  const [isRotating, setIsRotating] = useState(false);
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
    // await animate(
    //   scope.current,
    //   {
    //     transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(90deg)`,
    //   },
    //   { duration: 1 }
    // );
    await animate(scope.current, { rotate: 90 }, { duration: 1 });
    updateDimensions(pieceIndex, selectedPiece?.height, selectedPiece.width);
    await animate(scope.current, { rotate: 0 }, { duration: 0 });
    setIsRotating(false);
  }

  function handlePieceSelected() {
    const chosenPiece = piecesInPlay.find((piece: Piece) => id === piece.id);
    setSelectedPiece(chosenPiece);
  }

  return (
    <ActionsToolbarPopover runRotationAnimation={runRotationAnimation}>
      <PieceWrapper
        ref={refs}
        {...listeners}
        {...attributes}
        onClick={handlePieceSelected}
        // animate={{
        //   rotate: piece.isRotated ? 90 : 0,
        // }}
        // transition={{ duration: 0.5 }}
        x={x}
        y={y}
        layout={!isRotating}
        isDragging={isDragging}
        isSelected={isSelected}
      >
        <Rectangle
          width={piece.width}
          height={piece.height}
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

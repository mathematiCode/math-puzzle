import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle.tsx';
import ActionsToolbarPopover from './ActionsToolbarPopover.tsx';
import { motion } from 'motion/react';
import { useSelectedPiece } from '../context/SelectedPiece.tsx';
import Piece from '../types/piece.ts';
import styled, { css } from 'styled-components';

const InitialPuzzlePiece = ({ piece }: { piece: Piece }) => {
  //console.log('re-rendering this piece:', piece.id);
  const { selectedPiece, setSelectedPiece } = useSelectedPiece();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: piece.id,
  });

  function handlePieceSelected() {
    setSelectedPiece(piece);
  }

  const isSelected = selectedPiece?.id === piece.id;

  // const animateMe = e => {
  //   // e.preventDefault();
  //   console.log('animateMe');
  //   piece.isRotated
  //     ? {
  //         rotate: 90,
  //       }
  //     : null;
  // };
  return (
    <InitialPieceWrapper $isSelected={isSelected}>
      <ActionsToolbarPopover delegated={{}}>
        <motion.button
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          onClick={handlePieceSelected}
          animate={piece.isRotated ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Rectangle
            width={piece.width}
            height={piece.height}
            color={piece.color}
            isMotion={true}
          />
        </motion.button>
      </ActionsToolbarPopover>
    </InitialPieceWrapper>
  );
};

export const InitialPieceWrapper = styled(motion.div)`
  touch-action: none;
  ${({ $isSelected }) =>
    $isSelected &&
    css`
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    `}
`;

InitialPuzzlePiece.displayName = 'InitialPuzzlePiece';

export default InitialPuzzlePiece;

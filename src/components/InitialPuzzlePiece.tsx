import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle.tsx';
import ActionsToolbarPopover from './ActionsToolbarPopover.tsx';
import { motion } from 'motion/react';
import { useSelectedPiece } from '../context/SelectedPiece.tsx';
import { Piece } from '../types/piece.ts';
import styled from 'styled-components';

const InitialPuzzlePiece = ({ piece }: { piece: Piece }) => {
  //console.log('re-rendering this piece:', piece.id);
  const { selectedPiece, setSelectedPiece } = useSelectedPiece();
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
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
    <InitialPieceWrapper isSelected={isSelected} isDragging={isDragging}>
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

// Fix cursor type so when isDragging is true, it's grab, otherwise it's pointer
// Change to button and fix extra space below.
export const InitialPieceWrapper = styled(motion.div)`
  cursor: ${({ isDragging }) => (isDragging ? 'grab' : 'pointer')};
  box-shadow: ${({ isSelected }) =>
    isSelected ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px' : ''};
`;

InitialPuzzlePiece.displayName = 'InitialPuzzlePiece';

export default InitialPuzzlePiece;

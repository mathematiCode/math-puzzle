import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle.tsx';
import ActionsToolbarPopover from './ActionsToolbarPopover.tsx';
import { useContext } from 'react';
import { motion } from 'motion/react';
import { SelectedPieceContext } from '../context/SelectedPiece.jsx';
import Piece from '../types/piece.ts';

const InitialPuzzlePiece = ({ piece }: { piece: Piece }) => {
  //console.log('re-rendering this piece:', piece.id);
  const { selectedPiece, setSelectedPiece } = useContext(SelectedPieceContext);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: piece.id,
  });

  const style = {
    touchAction: 'none',
    ...(selectedPiece?.id === piece.id && {
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    }),
  };

  function handlePieceSelected() {
    setSelectedPiece(piece);
  }

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
    <ActionsToolbarPopover>
      <motion.button
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        onClick={handlePieceSelected}
        popoverTarget="actions"
        animate={piece.isRotated ? { rotate: 90 } : { rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Rectangle
          width={piece.width}
          height={piece.height}
          color={piece.color}
          // isRotated={piece.isRotated}
          // isSelected={selectedPiece?.id === piece.id}
        />
      </motion.button>
    </ActionsToolbarPopover>
  );
};

InitialPuzzlePiece.displayName = 'InitialPuzzlePiece';

export default InitialPuzzlePiece;

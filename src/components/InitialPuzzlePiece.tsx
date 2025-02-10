import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle.tsx';
import ActionsToolbarPopover from './ActionsToolbarPopover.tsx';
import { useContext } from 'react';
import { motion } from 'motion/react';
import { SelectedPieceContext } from '../context/SelectedPiece.tsx';
import Piece from '../types/piece.ts';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';

const InitialPuzzlePiece = ({ piece }: { piece: Piece }) => {
  //console.log('re-rendering this piece:', piece.id);
  const context = useContext(SelectedPieceContext);
  if (!context) throw new Error('SelectedPieceContext is null');
  const { selectedPiece, setSelectedPiece } = context;
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: piece.id,
  });

  function convertlocationToXAndY(location: string | null) {
    if (!location) return { x: 0, y: 0 };
    const cleanedString = location.replace(/[()]/g, '');
    const [x, y] = cleanedString.split(',').map(Number);
    return { x, y };
  }

  // const { x, y } = convertlocationToXAndY(piece.location);

  const style = {
    touchAction: 'none',
    position: 'absolute',
    // left: `${sizeOfEachUnit - 1}px`,
    // top: `${sizeOfEachUnit - 1}px`,
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

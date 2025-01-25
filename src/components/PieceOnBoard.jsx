/* eslint-disable react/prop-types */
import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle';
import ActionsToolbarPopover from './ActionsToolbarPopover';
import { memo, useContext } from 'react';
import { motion } from 'motion/react';

import { SelectedPieceContext } from '../context/SelectedPiece';
import { PiecesInPlayContext } from '../context/PiecesInPlay';
import { CurrentLevelContext } from '../context/CurrentLevel';

function PieceOnBoard({ piece, id }) {
  const { selectedPiece, setSelectedPiece } = useContext(SelectedPieceContext);
  const { piecesInPlay } = useContext(PiecesInPlayContext);
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);

  function convertlocationToXAndY(location) {
    const cleanedString = location.replace(/[()]/g, '');
    const [x, y] = cleanedString.split(',').map(Number);
    return { x, y };
  }

  const { x, y } = convertlocationToXAndY(piece.location);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: id,
    });

  const style = {
    position: 'absolute',
    touchAction: 'none',
    left: `${x * sizeOfEachUnit - 1}px`,
    top: `${y * sizeOfEachUnit - 1}px`,
    // ...(transform && {
    //   transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    // }),
    ...(isDragging && { cursor: 'grab' }),
    ...(selectedPiece?.id === id && {
      boxShadow:
        'rgba(0, 0, 0, 0.5) 0px 19px 19px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
    }),
  };

  function handlePieceSelected() {
    const chosenPiece = piecesInPlay.find(piece => id === piece.id);
    setSelectedPiece(chosenPiece);
  }

  return (
    <ActionsToolbarPopover>
      <motion.button
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        onClick={handlePieceSelected}
        animate={{ rotate: piece.isRotated ? 90 : 0 }}
        transition={{ duration: 0, transformOrigin: 'bottom-left' }}
      >
        <Rectangle
          width={piece.width}
          height={piece.height}
          color={piece.color}
          {...listeners}
        />
      </motion.button>
    </ActionsToolbarPopover>
  );
}

export default memo(PieceOnBoard);

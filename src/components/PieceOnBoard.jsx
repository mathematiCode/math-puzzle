/* eslint-disable react/prop-types */
import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle';
import { memo, useContext } from 'react';
import { SelectedPieceContext } from '../context/SelectedPiece';
import { pieces, sizeOfEachUnit } from '../CONSTANTS';
import { motion } from 'motion/react';

const PieceOnBoard = ({ piece, id }) => {
  const { selectedPiece, setSelectedPiece } = useContext(SelectedPieceContext);

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
    const chosenPiece = pieces.find(piece => id === piece.id);
    setSelectedPiece(chosenPiece);
    console.log('new piece is selected');
  }

  return (
    <motion.button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={handlePieceSelected}
      animate={{ rotate: piece.isRotated ? 90 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Rectangle
        width={piece.width}
        height={piece.height}
        color={piece.color}
        {...listeners}
      />
    </motion.button>
  );
};

export default memo(PieceOnBoard);

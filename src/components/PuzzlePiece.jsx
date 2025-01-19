import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import Rectangle from './Rectangle';
import { useContext } from 'react';
import { SelectedPieceContext } from '../context/SelectedPiece';
import { pieces } from '../CONSTANTS';
import { motion } from 'motion/react';

const PuzzlePiece = ({ width, height, color, id, isRotated }) => {
  console.log('re-rendering this piece:', id);
  const { selectedPiece, setSelectedPiece } = useContext(SelectedPieceContext);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = {
    ...(transform && {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }),
    ...(selectedPiece?.id === id && {
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
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
      className="puzzle-piece"
      onClick={handlePieceSelected}
      animate={{ rotate: isRotated ? 90 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Rectangle width={width} height={height} color={color} />
    </motion.button>
  );
};

PuzzlePiece.displayName = 'PuzzlePiece';

PuzzlePiece.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  activePiece: PropTypes.object,
  isRotated: PropTypes.bool,
};

export default PuzzlePiece;

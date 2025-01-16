/* eslint-disable react/prop-types */
import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import Rectangle from './Rectangle';
import { useContext } from 'react';
import { SelectedPieceContext } from '../context/SelectedPiece';
import { pieces } from '../CONSTANTS';

const PuzzlePiece = ({ width, height, color, id, className }) => {
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
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={className}
      onClick={handlePieceSelected}
    >
      <Rectangle width={width} height={height} color={color} />
    </button>
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
};

export default PuzzlePiece;

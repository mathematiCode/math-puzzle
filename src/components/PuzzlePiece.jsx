import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import Rectangle from './Rectangle';

const PuzzlePiece = ({ width, height, color, id, className }) => {
  console.log('Puzzle piece is re-rendering now');
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={className}
      onClick={() => console.log('Hey you clicked me')}
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
};

export default PuzzlePiece;

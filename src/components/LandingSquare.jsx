import { useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

function LandingSquare({ id, color }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  color = isOver ? 'white' : 'hsl(100, 65%, 92%)';
  return (
    <div
      className="unit"
      key={id}
      style={{
        backgroundColor: color,
      }}
      ref={setNodeRef}
    />
  );
}

LandingSquare.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
export default LandingSquare;

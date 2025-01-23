import { useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { CurrentLevelContext } from '../context/CurrentLevel';

function LandingSquare({ id, color }) {
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  color = isOver ? 'white' : 'hsl(100, 65%, 92%)';
  return (
    <div
      className="unit"
      key={id}
      id={id}
      style={{
        backgroundColor: color,
        width: `${sizeOfEachUnit - 2}px`,
        height: `${sizeOfEachUnit - 2}px`,
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

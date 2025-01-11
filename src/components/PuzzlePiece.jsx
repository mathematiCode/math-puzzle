/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

import { range } from 'lodash';

function PuzzlePiece({ width, height, color, id, className }) {
  let total = width * height;

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
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
    >
      <motion.div
        className="unit-container"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
        }}
      >
        {range(total).map(unit => (
          <motion.div
            className="unit"
            key={unit}
            layout={true}
            style={{ backgroundColor: color }}
          />
        ))}
      </motion.div>
    </button>
  );
}

PuzzlePiece.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default PuzzlePiece;

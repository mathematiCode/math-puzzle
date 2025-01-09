/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import { DragOverlay, useDraggable } from '@dnd-kit/core';

import { range } from 'lodash';

function PuzzlePiece({ width, height, color, id }) {
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

  //   function handleDragStart() {
  //     console.log('Dragging has started.');
  //   }

  //   function handleDragEnd() {
  //     console.log('Dragging has ended');
  //   }

  return (
    <button ref={setNodeRef} {...listeners} {...attributes} style={style}>
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

export default PuzzlePiece;

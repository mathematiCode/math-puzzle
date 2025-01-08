/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import { DragOverlay } from '@dnd-kit/core';
import { Draggable } from './Draggable';
import { range } from 'lodash';

function Rectangle({ width, height, color, key }) {
  let total = width * height;
  return (
    <Draggable key={key}>
      <motion.div
        className="unit-container"
        style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
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
    </Draggable>
  );
}

export default Rectangle;

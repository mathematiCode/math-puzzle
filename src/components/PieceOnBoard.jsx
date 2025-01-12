/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import { useDraggable } from '@dnd-kit/core';
import { range } from 'lodash';
import { sizeOfEachUnit } from '../App';

const PieceOnBoardV2 = ({ piece, id }) => {
  let total = piece.width * piece.height;

  function convertlocationToXAndY(location) {
    const cleanedString = location.replace(/[()]/g, '');
    const [x, y] = cleanedString.split(',').map(Number);
    return { x, y };
  }

  const { x, y } = convertlocationToXAndY(piece.location);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {
        position: 'absolute',
        left: x * sizeOfEachUnit - 1 + 'px',
        top: y * sizeOfEachUnit - 1 + 'px',
      };

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={() => console.log('Hey you clicked me')}
    >
      <motion.div
        className="unit-container"
        style={{
          gridTemplateColumns: `repeat(${piece.width}, 1fr)`,
        }}
      >
        {range(total).map(unit => (
          <motion.div
            className="unit"
            key={unit}
            layout={true}
            style={{
              backgroundColor: piece.color,
            }}
          />
        ))}
      </motion.div>
    </button>
  );
};

export default PieceOnBoardV2;

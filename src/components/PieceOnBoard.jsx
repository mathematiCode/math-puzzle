/* eslint-disable react/prop-types */
import { useDraggable } from '@dnd-kit/core';
import { sizeOfEachUnit } from '../App';
import Rectangle from './Rectangle';
import { memo } from 'react';

const PieceOnBoard = ({ piece, id }) => {
  function convertlocationToXAndY(location) {
    const cleanedString = location.replace(/[()]/g, '');
    const [x, y] = cleanedString.split(',').map(Number);
    return { x, y };
  }

  const { x, y } = convertlocationToXAndY(piece.location);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    position: 'absolute',
    left: `${x * sizeOfEachUnit - 1}px`,
    top: `${y * sizeOfEachUnit - 1}px`,
    backgroundColor: 'yellow',
    ...(transform && {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }),
  };

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={() => console.log('Hey you clicked me')}
    >
      <Rectangle
        width={piece.width}
        height={piece.height}
        color={piece.color}
        {...listeners}
      />
    </button>
  );
};

export default memo(PieceOnBoard);

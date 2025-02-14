import { useDroppable } from '@dnd-kit/core';
import { useContext } from 'react';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';
import Unit from './Rectangle.tsx';

function LandingSquare({ id, color }: { id: string; color: string }) {
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

export default LandingSquare;

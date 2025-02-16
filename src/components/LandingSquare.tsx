import { useDroppable } from '@dnd-kit/core';
import { useContext } from 'react';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';
import { Unit } from './Unit.tsx';

function LandingSquare({ id, color }: { id: string; color: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  color = isOver ? 'white' : 'hsl(100, 65%, 92%)';
  return (
    <Unit key={id} color={color} ref={setNodeRef} id={id} />
    // <div
    //   className="unit"
    //   key={id}
    //   id={id}
    //   style={{
    //     backgroundColor: color,
    //     width: `${sizeOfEachUnit}px`,
    //     height: `${sizeOfEachUnit}px`,
    //   }}
    //
    // />
  );
}

export default LandingSquare;

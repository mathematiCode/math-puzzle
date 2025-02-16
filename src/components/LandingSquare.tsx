import { useDroppable } from '@dnd-kit/core';
import { Unit } from './Unit.tsx';

function LandingSquare({ id, color }: { id: string; color: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  color = isOver ? 'white' : 'hsl(100, 65%, 92%)';
  return <Unit key={id} color={color} ref={setNodeRef} id={id} />;
}

export default LandingSquare;

import { useDroppable } from '@dnd-kit/core';
import { Unit } from './Unit';

function LandingSquare({ id, color }: { id: string; color: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  // color = isOver ? 'white' : 'hsl(100, 65%, 92%)';
  return (
    <Unit
      key={id}
      color={'transparent'}
      ref={setNodeRef}
      id={id}
      unitSize={1}
    />
  );
}

export default LandingSquare;

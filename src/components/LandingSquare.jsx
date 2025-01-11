import { useDroppable } from '@dnd-kit/core';

function LandingSquare({ id, color }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  color = isOver ? 'white' : 'hsl(209, 26%, 89%)';
  return (
    <div
      className="unit"
      key={id}
      style={{ backgroundColor: color }}
      ref={setNodeRef}
    />
  );
}

export default LandingSquare;

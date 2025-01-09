import { useDroppable } from '@dnd-kit/core';
import { range } from 'lodash';

function Board({ coordinates }) {
  const width = 22; // eventually will calculate from coordinates
  const height = 18;
  const total = width * height;
  let color = 'hsl(209, 26%, 89%)';
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  color = isOver ? 'white' : 'hsl(209, 26%, 89%)';

  return (
    <div
      className="unit-container"
      style={{
        gridTemplateColumns: `repeat(${width}, 1fr)`,
      }}
      ref={setNodeRef}
    >
      {range(total).map(unit => (
        <div className="unit" key={unit} style={{ backgroundColor: color }} />
      ))}
    </div>

    //     <Rectangle
    //       width={22}
    //       height={18}
    //       color="white"
    //       style={style}
    //       setNodeRef={setNodeRef}
    //     />
  );
}

export default Board;

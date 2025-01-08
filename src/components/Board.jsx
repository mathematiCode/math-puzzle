import Rectangle from './Rectangle.jsx';
import { Droppable } from './Droppable.jsx';

function Board({ coordinates }) {
  return (
    <Droppable>
      <Rectangle width={22} height={18} color="white" />
    </Droppable>
  );
}

export default Board;

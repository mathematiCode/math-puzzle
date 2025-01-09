import { useState, useMemo } from 'react';
import levels from './levels.json';
import PuzzlePiece from './components/PuzzlePiece';
import Board from './components/Board';
import { motion } from 'motion/react';
import { DndContext } from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import './App.css';

function App() {
  const pieces = levels[0].pieces;
  const [piecesOnBoard, setPiecesOnBoard] = useState([]);

  const colors = [
    'hsla(4, 35%, 56%, 1)',
    'hsla(205, 36%, 45%, 1)',
    'hsla(74, 100%, 85%, 1)',
    'hsla(236, 19%, 41%, 1)',
    '	hsla(194, 78%, 80%, 1)',
  ];

  const snapToGrid = useMemo(() => createSnapModifier(26), [26]);

  function handleDragStart() {
    console.log('Dragging has started.');
  }

  function handleDragEnd() {
    console.log('Dragging has ended');
    /**  check if puzzle piece was already placed on the board 
         - if it was update it's new location in the array of pieces placed on the board
              - if it's still on the board, update new location
              - if it's removed from the board, delete from array

        - if it wasn't on the board yet add it to the array of pieces placed on the board. 

        Then convert that object into pixel coordinates to display on the board in re-render. 
    */
    setPiecesOnBoard([{ id: 1, x: 2, y: 5, width: 5, height: 8 }]);
  }

  return (
    <DndContext
      modifiers={[snapToGrid]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main>
        <motion.div className="pieces-container" layout={true}>
          {pieces.map((piece, pieceIndex) => (
            <PuzzlePiece
              width={piece.width}
              height={piece.height}
              key={pieceIndex}
              id={pieceIndex}
              color={colors[pieceIndex % colors.length]}
            />
          ))}
        </motion.div>
        <Board coordinates={levels[0].board} />
      </main>
    </DndContext>
  );
}
export default App;

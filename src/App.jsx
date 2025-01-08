import { useState } from 'react';
import levels from './levels.json';
import Rectangle from './components/Rectangle';
import Board from './components/Board';
import { motion } from 'motion/react';
import { DndContext } from '@dnd-kit/core';
import './App.css';

function App() {
  const pieces = levels[0].pieces;
  console.log(pieces);

  const colors = [
    'hsla(4, 35%, 56%, 1)',
    'hsla(205, 36%, 45%, 1)',
    'hsla(74, 100%, 85%, 1)',
    'hsla(236, 19%, 41%, 1)',
    '	hsla(194, 78%, 80%, 1)',
  ];

  return (
    <DndContext>
      <main>
        <motion.div className="pieces-container" layout={true}>
          {pieces.map((piece, pieceIndex) => (
            <Rectangle
              width={piece.width}
              height={piece.height}
              key={pieceIndex}
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

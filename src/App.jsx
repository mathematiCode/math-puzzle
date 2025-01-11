import { useContext, useMemo } from 'react';
import levels from './levels.json';
import PuzzlePiece from './components/PuzzlePiece';
import Board from './components/Board';
import PlacedPieces from './components/PlacedPieces';
import { motion } from 'motion/react';
import { DndContext } from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { PiecesInPlayContext } from './context/PiecesInPlay';

import './App.css';

function App() {
  const pieces = levels[0].pieces;

  const { piecesInPlay, movePiece, resetPieces } =
    useContext(PiecesInPlayContext);

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

  function handleDragEnd(event) {
    console.log('Dragging has ended');
    console.log(event);
    const pieceIndex = event.active.id;
    const newLocation = event.over.id;
    console.log(pieceIndex, newLocation);
    movePiece(pieceIndex, newLocation);
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
        <div className="game-board">
          <Board coordinates={levels[0].board} />
          <PlacedPieces piecesInPlay={piecesInPlay} />
        </div>
      </main>
    </DndContext>
  );
}
export default App;

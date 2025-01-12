import { useContext, useMemo, useState } from 'react';
import levels from './levels.json';
import PuzzlePiece from './components/PuzzlePiece';
import Rectangle from './components/Rectangle';
import Board from './components/Board';
import PlacedPieces from './components/PlacedPieces';
import { motion } from 'motion/react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { PiecesInPlayContext } from './context/PiecesInPlay';

import './App.css';

export const sizeOfEachUnit = 26;

function App() {
  const pieces = levels[0].pieces;
  const [activePiece, setActivePiece] = useState(null);

  const { piecesInPlay, movePiece, resetPieces } =
    useContext(PiecesInPlayContext);

  const snapToGrid = useMemo(() => createSnapModifier(sizeOfEachUnit), []);

  function handleDragStart(event) {
    console.log('Dragging has started.');
    setActivePiece(pieces[event.active.id]);
  }

  function handleDragEnd(event) {
    console.log('Dragging has ended');
    const id = event.active.id;
    console.log('ID IS:', id);
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    const newLocation = event.over.id;
    console.log('pieceIndex', pieceIndex, 'location', newLocation);
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
          {pieces.map((piece, pieceIndex) => {
            if (piece.location != null) return null;
            return (
              <PuzzlePiece
                width={piece.width}
                height={piece.height}
                key={pieceIndex}
                id={`initial-${pieceIndex}`}
                color={piece.color}
              />
            );
          })}
        </motion.div>
        <div className="game-board">
          <Board coordinates={levels[0].board} />
          <PlacedPieces piecesInPlay={piecesInPlay} />
        </div>
        <DragOverlay>
          {activePiece ? (
            <Rectangle
              width={activePiece.width}
              height={activePiece.height}
              color={activePiece.color}
              style={{ zIndex: 100 }}
            />
          ) : null}
        </DragOverlay>
      </main>
      <button onClick={resetPieces} className="reset">
        Reset Game
      </button>
    </DndContext>
  );
}
export default App;

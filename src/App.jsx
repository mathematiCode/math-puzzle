import { useContext, useMemo, useState } from 'react';
import levels from './levels.json';
import PuzzlePiece from './components/PuzzlePiece';
import Rectangle from './components/Rectangle';
import Board from './components/Board';
import PlacedPieces from './components/PlacedPieces';
import { motion } from 'motion/react';
import { throttle } from 'lodash';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { createSnapModifier, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { PiecesInPlayContext } from './context/PiecesInPlay';

import './App.css';

export const sizeOfEachUnit = 26;

function App() {
  const pieces = levels[0].pieces;
  const [activePiece, setActivePiece] = useState(null);

  const { piecesInPlay, movePiece, resetPieces } =
    useContext(PiecesInPlayContext);

  const snapToGrid = useMemo(() => createSnapModifier(sizeOfEachUnit), []);

  const handleDragStart = throttle(event => {
    console.log('Dragging has started.');
    setActivePiece(pieces[event.active.id]);
  }, 200);

  const handleDragEnd = throttle(event => {
    console.log('Dragging has ended');
    const id = event.active.id;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    if (event?.over?.id) {
      console.log('ID IS:', id);
      const newLocation = event.over.id;
      console.log('pieceIndex', pieceIndex, 'location', newLocation);
      movePiece(pieceIndex, newLocation);
    } else movePiece(pieceIndex, null);
  }, 200);

  function handleHorizontalStretch() {}

  function handleVerticalStretch() {}

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
              style={{ zIndex: 100, opacity: 0.5 }}
            />
          ) : null}
        </DragOverlay>
      </main>
      <div className="button-container">
        <button
          className="button icon-button"
          onClick={handleHorizontalStretch}
        >
          <img
            src="./assets/horizontalStretch.svg"
            style={{ width: '35px', height: '35px' }}
          />
        </button>
        <button className="button icon-button" onClick={handleVerticalStretch}>
          <img
            src="./assets/verticalStretch.svg"
            style={{ width: '35px', height: '35px' }}
          />
        </button>
        <button onClick={resetPieces} className="button">
          Reset Game
        </button>
      </div>
    </DndContext>
  );
}
export default App;

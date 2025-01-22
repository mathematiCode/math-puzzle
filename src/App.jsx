import { useContext, useMemo, useState } from 'react';
import levels from './levels.json';
import PuzzlePiece from './components/PuzzlePiece';
import Rectangle from './components/Rectangle';
import Board from './components/Board';
import PlacedPieces from './components/PlacedPieces';
import { motion } from 'motion/react';
import { initialPieces, sizeOfEachUnit } from './CONSTANTS';
import { useClickAway } from '@uidotdev/usehooks';
import {
  DndContext,
  DragOverlay,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
} from '@dnd-kit/core';
import { createSnapModifier, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { PiecesInPlayContext } from './context/PiecesInPlay';
import { SelectedPieceContext } from './context/SelectedPiece';

import './App.css';

function App() {
  const [activePiece, setActivePiece] = useState(null);
  const { setSelectedPiece } = useContext(SelectedPieceContext);

  const { piecesInPlay, movePiece, resetPieces } =
    useContext(PiecesInPlayContext);
  console.log('activePiece is', activePiece);
  // useClickAway('Escape', console.log('Something was clicked'));
  const ref = useClickAway(() => {
    setSelectedPiece(null);
  });

  const snapToGrid = useMemo(() => createSnapModifier(sizeOfEachUnit), []);

  const activationConstraint = {
    distance: 20,
  };
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleDragStart = event => {
    console.log('Dragging has started.');
    console.log('intialPieces', initialPieces);
    const id = event.active.id;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    setActivePiece(piecesInPlay[pieceIndex]);
    setSelectedPiece(piecesInPlay[pieceIndex]);
  };

  const handleDragEnd = event => {
    console.log('Dragging has ended');
    const id = event.active.id;
    console.log(
      'width',
      activePiece.width,
      'height',
      activePiece.height,
      'color',
      activePiece.color
    );
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    if (event?.over?.id) {
      console.log('ID IS:', id);
      const newLocation = event.over.id;
      console.log('pieceIndex', pieceIndex, 'location', newLocation);
      movePiece(pieceIndex, newLocation);
    } else movePiece(pieceIndex, null);
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[snapToGrid]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main>
        <motion.div className="pieces-container" layout={true}>
          {piecesInPlay.map((piece, pieceIndex) => {
            if (piece.location != null) return null;
            return (
              <PuzzlePiece piece={piece} key={pieceIndex} forwardedRef={ref} />
            );
          })}
        </motion.div>
        <div className="game-board">
          <Board
            dimensions={levels[0].dimensions}
            boardSections={levels[0].boardSections}
          />
          <PlacedPieces piecesInPlay={piecesInPlay} />
        </div>
        {activePiece ? (
          <DragOverlay style={{ rotate: activePiece.isRotated ? 90 : 0 }}>
            <Rectangle
              width={activePiece.width}
              height={activePiece.height}
              color={activePiece.color}
            />
          </DragOverlay>
        ) : null}
      </main>
      <div className="button-container">
        <button className="button" disabled>
          Next Level
        </button>
        <button onClick={resetPieces} className="button">
          Reset Game
        </button>
      </div>
    </DndContext>
  );
}
export default App;

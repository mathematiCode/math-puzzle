import { useContext, useMemo, useState } from 'react';
import levels from './levels.json';
import PuzzlePiece from './components/PuzzlePiece';
import PieceOverlay from './components/PieceOverlay';
import Board from './components/Board';
import PlacedPieces from './components/PlacedPieces';
import { motion } from 'motion/react';
// import { initialPieces, sizeOfEachUnit, currentLevel } from './CONSTANTS';
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
import { CurrentLevelContext } from './context/CurrentLevel';

import './App.css';

function App() {
  const [activePiece, setActivePiece] = useState(null);
  const { setSelectedPiece } = useContext(SelectedPieceContext);
  const { currentLevel, initialPieces, sizeOfEachUnit } =
    useContext(CurrentLevelContext);

  const { piecesInPlay, movePiece, resetPieces } =
    useContext(PiecesInPlayContext);
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
    const id = event.active.id;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    setActivePiece(piecesInPlay[pieceIndex]);
    setSelectedPiece(piecesInPlay[pieceIndex]);
  };

  const handleDragEnd = event => {
    const id = event.active.id;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    if (event?.over?.id) {
      const newLocation = event.over.id;
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
            dimensions={levels[currentLevel].dimensions}
            boardSections={levels[currentLevel].boardSections}
          />
          <PlacedPieces piecesInPlay={piecesInPlay} />
        </div>
        {activePiece ? (
          <DragOverlay>
            <PieceOverlay activePiece={activePiece} />
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

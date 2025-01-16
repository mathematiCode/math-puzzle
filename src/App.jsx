import { useContext, useMemo, useState } from 'react';
import levels from './levels.json';
import PuzzlePiece from './components/PuzzlePiece';
import Rectangle from './components/Rectangle';
import Board from './components/Board';
import PlacedPieces from './components/PlacedPieces';
import { motion } from 'motion/react';
import { throttle } from 'lodash';
import { pieces, sizeOfEachUnit } from './CONSTANTS';
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
  const { selectedPiece, setSelectedPiece } = useContext(SelectedPieceContext);

  const { piecesInPlay, movePiece, updateDimensions, resetPieces } =
    useContext(PiecesInPlayContext);

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
    const id = event.active.id;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    setActivePiece(pieces[pieceIndex]);
    setSelectedPiece(pieces[pieceIndex]);
  };

  const handleDragEnd = event => {
    console.log('Dragging has ended');
    const id = event.active.id;
    console.log('width', activePiece.width, 'height', activePiece.height);
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    if (event?.over?.id) {
      console.log('ID IS:', id);
      const newLocation = event.over.id;
      console.log('pieceIndex', pieceIndex, 'location', newLocation);
      movePiece(pieceIndex, newLocation);
    } else movePiece(pieceIndex, null);
  };

  function handleHorizontalStretch() {
    console.log('I am the chosen one', selectedPiece);
    if (Number.isInteger(selectedPiece.height / 2)) {
      const newHeight = selectedPiece.height / 2;
      const newWidth = selectedPiece.width * 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
      console.log(pieceIndex);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  function handleVerticalStretch() {
    console.log('I am the chosen one', selectedPiece);
    if (Number.isInteger(selectedPiece.width / 2)) {
      const newHeight = selectedPiece.height * 2;
      const newWidth = selectedPiece.width / 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
      console.log(pieceIndex);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  return (
    <DndContext
      sensors={sensors}
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
                pieces={pieces}
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

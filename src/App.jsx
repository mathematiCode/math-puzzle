import { useContext, useState } from 'react';
import levels from './levels.json';
import InitialPuzzlePiece from './components/InitialPuzzlePiece';
import PieceOverlay from './components/PieceOverlay';
import Board from './components/Board';
import PlacedPieces from './components/PlacedPieces';
import DragAndDropArea from './components/DragAndDropArea';
import { motion } from 'motion/react';
import { useClickAway } from '@uidotdev/usehooks';
import { DragOverlay } from '@dnd-kit/core';
import { PiecesInPlayContext } from './context/PiecesInPlay';
import { CurrentLevelContext } from './context/CurrentLevel';

import './App.css';

function App() {
  const { currentLevel, levelPosition, previousLevel, nextLevel } =
    useContext(CurrentLevelContext);
  const [activePiece, setActivePiece] = useState(null);
  const { piecesInPlay, resetPieces, setPiecesForNewLevel } =
    useContext(PiecesInPlayContext);
  setPiecesForNewLevel();
  return (
    <main>
      <DragAndDropArea setActivePiece={setActivePiece} key={currentLevel}>
        <motion.div
          className="pieces-container"
          layout={true}
          key={currentLevel}
        >
          {piecesInPlay.map((piece, pieceIndex) => {
            if (piece.location != null) return null;
            return <InitialPuzzlePiece piece={piece} key={pieceIndex} />;
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
            <PieceOverlay piece={activePiece} />
          </DragOverlay>
        ) : null}
      </DragAndDropArea>
      <div className="button-container">
        <button
          className="button"
          disabled={levelPosition == 'first'}
          onClick={previousLevel}
        >
          Previous Level
        </button>
        <button
          className="button"
          disabled={levelPosition == 'last'}
          onClick={nextLevel}
        >
          Next Level
        </button>
        <button className="button" onClick={resetPieces}>
          Reset Game
        </button>
      </div>
    </main>
  );
}
export default App;

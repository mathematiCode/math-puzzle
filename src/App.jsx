import { useContext, useState } from 'react';
import levels from './levels.json';
import PuzzlePiece from './components/PuzzlePiece';
import PieceOverlay from './components/PieceOverlay';
import Board from './components/Board';
import PlacedPieces from './components/PlacedPieces';
import DragAndDropArea from './components/DragAndDropArea';
import { motion } from 'motion/react';
// import { initialPieces, sizeOfEachUnit, currentLevel } from './CONSTANTS';
import { useClickAway } from '@uidotdev/usehooks';
import { DragOverlay } from '@dnd-kit/core';
import { PiecesInPlayContext } from './context/PiecesInPlay';
import { CurrentLevelContext } from './context/CurrentLevel';

import './App.css';

function App() {
  const { currentLevel, previousLevel, nextLevel } =
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
            return <PuzzlePiece piece={piece} key={pieceIndex} />;
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
      </DragAndDropArea>
      <div className="button-container">
        <button className="button" onClick={previousLevel}>
          Previous Level
        </button>
        <button className="button" onClick={nextLevel}>
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

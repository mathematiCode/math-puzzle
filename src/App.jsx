import { useContext, useState, useRef } from 'react';
import levels from './levels.json';
import InitialPuzzlePiece from './components/InitialPuzzlePiece.tsx';
import PieceOverlay from './components/PieceOverlay.tsx';
import Board from './components/Board.tsx';
import PlacedPieces from './components/PlacedPieces.tsx';
import DragAndDropArea from './components/DragAndDropArea.tsx';
import { motion } from 'motion/react';
// import { useClickAway } from '@uidotdev/usehooks';
import { DragOverlay } from '@dnd-kit/core';
import { PiecesInPlayContext } from './context/PiecesInPlay';
import { CurrentLevelContext } from './context/CurrentLevel.tsx';

import './App.css';

function App() {
  const { currentLevel, levelPosition, previousLevel, nextLevel } =
    useContext(CurrentLevelContext);
  const [activePiece, setActivePiece] = useState(null);
  const { piecesInPlay, resetPieces, setPiecesForNewLevel } =
    useContext(PiecesInPlayContext);
  const boardRef = useRef(null);
  setPiecesForNewLevel();
  return (
    <main>
      <DragAndDropArea
        setActivePiece={setActivePiece}
        boardRef={boardRef}
        key={currentLevel}
      >
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
            ref={boardRef}
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

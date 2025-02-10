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
import { PiecesInPlayContext } from './context/PiecesInPlay.jsx';
import { CurrentLevelContext } from './context/CurrentLevel.tsx';
import { range } from 'lodash';
import InvalidSquare from './components/InvalidSquare.tsx';

import './App.css';

function App() {
  const { currentLevel, levelPosition, previousLevel, nextLevel } =
    useContext(CurrentLevelContext);
  const [activePiece, setActivePiece] = useState(null);
  const { piecesInPlay, resetPieces, setPiecesForNewLevel } =
    useContext(PiecesInPlayContext);
  const boardRef = useRef(null);
  setPiecesForNewLevel();
  let { width, height } = levels[currentLevel].dimensions;
  width = Math.ceil(width * 1.3);
  height = Math.ceil(height * 1.3);
  return (
    <main>
      <DragAndDropArea
        setActivePiece={setActivePiece}
        boardRef={boardRef}
        key={currentLevel}
      >
        <div
          className="intial-container"
          key={currentLevel}
          style={{ border: '2px solid red' }}
        >
          <div
            className="inivisble-grid unit-container"
            style={{
              gridTemplateColumns: `repeat(${width}, 1fr)`,
              border: '2px solid red',
            }}
          >
            {range(width).map((row: number, rowIndex: number) => {
              return range(width).map((square: number, colIndex: number) => {
                return (
                  <InvalidSquare
                    key={`(${colIndex},${rowIndex})_initial`}
                    id={`(${colIndex},${rowIndex})_initial`}
                  />
                );
              });
            })}
          </div>
          <div className="pieces">
            {piecesInPlay.map((piece, pieceIndex) => {
              if (piece.location != null) return null;
              return <InitialPuzzlePiece piece={piece} key={pieceIndex} />;
            })}
          </div>
        </div>
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

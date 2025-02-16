import { useContext, useState, useRef } from 'react';
import levels from './levels.json';
import InitialPuzzlePiece from './components/InitialPuzzlePiece.tsx';
import PieceOverlay from './components/PieceOverlay.tsx';
import Board from './components/Board.tsx';
import PlacedPieces from './components/PlacedPieces.tsx';
import DragAndDropArea from './components/DragAndDropArea.tsx';
import { motion } from 'motion/react';
import styled from 'styled-components';
// import { useClickAway } from '@uidotdev/usehooks';
import { DragOverlay } from '@dnd-kit/core';
import { PiecesInPlayContext } from './context/PiecesInPlay.jsx';
import { CurrentLevelContext } from './context/CurrentLevel.tsx';

import './App.css';
import Piece from './types/piece.ts';

function App() {
  const { currentLevel, levelPosition, previousLevel, nextLevel } =
    useContext(CurrentLevelContext);
  const [activePiece, setActivePiece] = useState(null);
  const { piecesInPlay, resetPieces, setPiecesForNewLevel } =
    useContext(PiecesInPlayContext);
  const boardRef = useRef(null);
  setPiecesForNewLevel();
  return (
    <Main>
      <DragAndDropArea
        setActivePiece={setActivePiece}
        boardRef={boardRef}
        key={currentLevel}
      >
        <PiecesContainer $currentLevel={currentLevel}>
          {piecesInPlay.map((piece: Piece, pieceIndex: number) => {
            if (piece.location != null) return null;
            return <InitialPuzzlePiece piece={piece} key={pieceIndex} />;
          })}
        </PiecesContainer>
        <BoardWrapper>
          <Board
            ref={boardRef}
            dimensions={levels[currentLevel].dimensions}
            boardSections={levels[currentLevel].boardSections}
          />
          <PlacedPieces piecesInPlay={piecesInPlay} />
        </BoardWrapper>
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
    </Main>
  );
}

export const Main = styled.main`
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: 1fr 50px;
  align-items: start;
  gap: 48px;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 50px;
  }
`;

export const BoardWrapper = styled.div`
  display: grid;
  grid-area: 1fr;
  width: min-content;
`;

export const PiecesContainer = styled.div.attrs({
  layout: true,
  key: props => props.$currentLevel,
  as: motion.div,
})<{ $currentLevel: number }>`
  display: flex;
  flex-direction: row;
  /* width: 700px; */
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

export default App;

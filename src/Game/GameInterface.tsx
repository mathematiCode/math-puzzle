import { useContext, useState} from 'react';
import levels from './levels.json' with { type: 'json' };
import InitialPuzzlePiece from './PuzzlePieces/InitialPuzzlePiece';
import PieceOverlay from './PuzzlePieces/PieceOverlay';
import Board from './Board/Board';
import PlacedPieces from './PlacedPieces';
import DragAndDropArea from './DragAndDropArea';
import LevelControls from '../components/LevelControls';
import LevelCompleteModal from './LevelComplete';
import { motion } from 'motion/react';
import styled from 'styled-components';
import { DragOverlay } from '@dnd-kit/core';
// import { usePiecesInPlay } from '../context/PiecesInPlay';
// import { useCurrentLevel } from '../context/CurrentLevel';
// import { useGameProgress } from '../context/GameProgress';
// import { useBoardSquares } from '../context/BoardSquares';
import { useCurrentLevel } from '../context/CurrentLevel';
import { useGameProgress } from '../context/GameProgress';
import { BoardSquaresContext } from '../context/BoardSquares';
import { usePiecesInPlay } from '../context/PiecesInPlay';
import { Piece } from '../types/piece';
import Hotjar from '@hotjar/browser';

function Game() {
  const {
    currentLevel,
    levelId,
    levelPosition,
    } = useCurrentLevel();
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const { isLevelCompleted } = useGameProgress();
  const boardSquaresContext = useContext(BoardSquaresContext);
  if (!boardSquaresContext) {
    throw new Error('BoardSquaresContext must be used within a BoardSquaresProvider');
  }
  const { checkIfPassedLevel } = boardSquaresContext;
  const { piecesInPlay } = usePiecesInPlay();
  const [isRotating, setIsRotating] = useState(false);
  const [levelCompletedShown, setLevelCompletedShown] = useState(false);

  const handleCloseModal = () => {
    setLevelCompletedShown(true); // Prevent modal from showing again for this level
  };

  return (
    <>
      <Main id='main'>
      <DragAndDropArea data-testid='drag-and-drop-area'
        setActivePiece={setActivePiece}
        key={currentLevel}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
          >
        <PiecesContainer data-testid='pieces-container' $currentLevel={currentLevel} key={currentLevel}>  
          {piecesInPlay.map((piece: Piece) => {
            if (piece.location != null) return null;
            return (
              <InitialPuzzlePiece
                piece={piece}
                isActive={activePiece?.id === piece.id}
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                key={piece.id}
                setActivePiece={setActivePiece}
              />
            );
          })}
              </PiecesContainer>
        <BoardWrapper data-testid='board-wrapper'>
          <Board
            dimensions={levels[currentLevel].dimensions}
            boardSections={levels[currentLevel].boardSections}
          />
          <PlacedPieces
            piecesInPlay={piecesInPlay}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
          />
              </BoardWrapper>
        {activePiece && !isRotating ? (
          <DragOverlay>
            <PieceOverlay piece={activePiece} />
          </DragOverlay>
              ) : null}
          </DragAndDropArea>
       </Main>
      <LevelControls
        levelPosition={levelPosition}
        setLevelCompletedShown={setLevelCompletedShown}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        setActivePiece={setActivePiece}
      />
      <LevelCompleteModal 
        level={levelId} 
        completed={checkIfPassedLevel()} 
        levelCompletedShown={levelCompletedShown}
        onClose={handleCloseModal}
      />
        </>
  );
}

export const Main = styled.main`
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: 1fr 90px;
  align-items: start;
  gap: 70px;
  margin-inline: 40px;
  margin-bottom: 60px;
  height: 100%;
  width: 100cqw;
  max-width: 1600px;
  overflow-y: clip;
  position: fixed;
  padding-bottom: 60px;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    grid-template-rows: 30% 60% 10%;
    margin-inline: 10px;
    justify-items: center;
    align-items: center;
    gap: 20px;
  }

  @media (min-width: 1400px) {
    max-width: 1200px;
}
`;

export const BoardWrapper = styled.div`
  display: grid;
  grid-area: 1fr;
  width: min-content;
  padding-top: 15px;
  position: relative;
  isolation: isolate;
`;

export const PiecesContainer = styled(motion.div).attrs({
  layout: true,
})<{ $currentLevel: number }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: start;
  gap: calc(var(--sizeOfEachUnit) / 2);
  overflow-y: auto;
  max-height:  65vh;
  height: fit-content;
  padding-top: 10px;
  line-height: 0;
  margin-inline: 10px;
  padding: 18px;
  background-color: transparent;

  @media (max-width: 750px) {
    max-height: 40vh;
    height: fit-content;
    align-items: center;
    justify-content: space-around;
    margin-inline: 0px;
  }
`;

export default Game;

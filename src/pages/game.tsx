// @ts-nocheck
import { useContext, useState, useRef } from 'react';
import levels from '../levels.json' with { type: 'json' };
import InitialPuzzlePiece from '../components/InitialPuzzlePiece.tsx';
import PieceOverlay from '../components/PieceOverlay.tsx';
import Board from '../components/Board.tsx';
import PlacedPieces from '../components/PlacedPieces.tsx';
import DragAndDropArea from '../components/DragAndDropArea.tsx';
import Button from '../components/Button.tsx';
import InstructionsModal from '../components/InstructionsModal.tsx';
import LevelCompleteModal from '../components/LevelComplete.tsx';
import { motion } from 'motion/react';
import styled from 'styled-components';
import { DragOverlay } from '@dnd-kit/core';
import { PiecesInPlayContext } from '../context/PiecesInPlay';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';
import { getInitialPieces } from '../utils/getInitialPieces';
import { LevelProgressContext } from '../context/LevelProgress.tsx';
import { Piece } from '../types/piece.ts';
import { BoardSquaresContext } from '../context/BoardSquares';
import Hotjar from '@hotjar/browser';
import { ChevronLeft, ChevronRight, RotateCcw, HelpCircle } from 'lucide-react';
//import { BoardSquaresContext } from '../context/BoardSquares.tsx';

function Game() {
  const {
    currentLevel,
    levelId,
    levelPosition,
    previousLevel,
    nextLevel,
    setSizeOfEachUnit,
  } = useContext(CurrentLevelContext);
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const { piecesInPlay, resetPieces, setPiecesForNewLevel } =
    useContext(PiecesInPlayContext);
  const { boardSquares, resetBoardSquares, checkIfPassedLevel } = useContext(BoardSquaresContext);
  const [isRotating, setIsRotating] = useState(false);
  const [levelCompletedShown, setLevelCompletedShown] = useState(false);
  const { isLevelCompleted } = useContext(LevelProgressContext);
  const boardRef = useRef(null);

  const handleCloseModal = () => {
    setLevelCompletedShown(true); // Prevent modal from showing again for this level
  };

  async function setToPrevious() {
    await previousLevel();
    const newPieces = getInitialPieces(currentLevel - 1);
    await setPiecesForNewLevel(newPieces);
    await setSizeOfEachUnit(currentLevel - 1);
    await resetBoardSquares(currentLevel - 1);
    setLevelCompletedShown(false); // Reset modal state for new level
  }

  async function setToNext() {
    await nextLevel();
    const newPieces = getInitialPieces(currentLevel + 1);
    await setPiecesForNewLevel(newPieces);
    await setSizeOfEachUnit(currentLevel + 1);
    await resetBoardSquares(currentLevel + 1);
    setLevelCompletedShown(false); // Reset modal state for new level
  }

    function resetLevel() {
    resetPieces();
    resetBoardSquares(currentLevel);
    setLevelCompletedShown(false); // Reset modal state when resetting level
   // console.log(boardSquares);
  }

  return (
    <Main>
      <DragAndDropArea
        setActivePiece={setActivePiece}
        boardRef={boardRef}
        key={currentLevel}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
      >
        <PiecesContainer $currentLevel={currentLevel}>
          {piecesInPlay.map((piece: Piece, pieceIndex: number) => {
            if (piece.location != null) return null;
            return (
              <InitialPuzzlePiece
                piece={piece}
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                key={pieceIndex}
              />
            );
          })}
        </PiecesContainer>
        <BoardWrapper>
          <Board
            ref={boardRef}
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
      <ButtonContainer>
        <Button color='hsl(178, 30.00%, 56.10%)' textColor='black' disabled={levelPosition == 'first'} onClick={setToPrevious}>
        <ChevronLeft />Previous Level 
        </Button>
        <Button color='hsl(178, 100%, 23%)' textColor='white' disabled={levelPosition == 'last'} onClick={setToNext}>
        Next Level <ChevronRight />
        </Button>
        <Button color='hsla(0, 76.10%, 78.60%, 0.88)' textColor='black' onClick={resetLevel}>
         <RotateCcw/> Reset Game 
        </Button>
        <InstructionsModal
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          piecesInPlay={piecesInPlay}
        />
      </ButtonContainer>
      <LevelCompleteModal 
        level={levelId} 
        completed={checkIfPassedLevel()} 
        levelCompletedShown={levelCompletedShown}
        onClose={handleCloseModal}
      />
    </Main>
  );
}

export const Main = styled.main`
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: 1fr 50px;
  align-items: start;
  gap: 70px;
  margin-inline: 30px;
  height: 100%;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    grid-template-rows: 55% 40% 5%;
    margin-inline: 10px;
    justify-items: center;
    gap: 20px;
  }
`;

export const BoardWrapper = styled.div`
  display: grid;
  grid-area: 1fr;
  width: min-content;
  position: fixed;
  top: 50%;
  left: 80%;
  transform: translate(-50%, -50%);

  @media (max-width: 750px) {
    left: 50%;
  }
`;

export const PiecesContainer = styled(motion.div).attrs({
  layout: true,
  key: props => props.$currentLevel,
})<{ $currentLevel: number }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: start;
  justify-content: right;
  gap: var(--sizeOfEachUnit);
`;
// Not sure why subtracting 2 from the sizeOfEachUnit works here. May be a box-sizing issue although it should all be set to border-box...

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-self: center;
  justify-content: center;
  position: fixed;
  bottom: 20px;
  grid-column: 1/3;
  z-index: 3;
  background-color: hsl(107, 100.00%, 93.70%);
  border-radius: 10px;
  border: 3px solid hsl(180, 89.10%, 21.60%);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);

  @media (max-width: 750px) {
    bottom: 0px;

    button {
      font-size: 0.9rem;
      margin: 5px;
      padding-inline: 4px;
      padding: 4px;
    }
  }
`;

export default Game;

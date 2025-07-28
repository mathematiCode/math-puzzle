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
  const { isLevelCompleted } = useContext(LevelProgressContext);
  const { boardSquares, resetBoardSquares, checkIfPassedLevel } = useContext(BoardSquaresContext);
    const { piecesInPlay, resetPieces, setPiecesForNewLevel } =
    useContext(PiecesInPlayContext);
  const [isRotating, setIsRotating] = useState(false);
  const [levelCompletedShown, setLevelCompletedShown] = useState(false);
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
    <Main id='main'>
      <DragAndDropArea id='drag-and-drop-area'
        setActivePiece={setActivePiece}
        boardRef={boardRef}
        key={currentLevel}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
      >
        <PiecesContainer id='pieces-container' $currentLevel={currentLevel}>
          {piecesInPlay.map((piece: Piece, pieceIndex: number) => {
            if (piece.location != null) return null;
            return (
              <InitialPuzzlePiece
                piece={piece}
                isActive={activePiece?.id === piece.id}
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                key={pieceIndex}
                setActivePiece={setActivePiece}
              />
            );
          })}
        </PiecesContainer>
        <BoardWrapper id='board-wrapper'>
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
      <ButtonContainer id='button-container'>
        <Button color='hsl(178, 30.00%, 56.10%)' textColor='black' disabled={levelPosition == 'first'} onClick={setToPrevious}>
        <ChevronLeft />Previous Level 
        </Button>
        <Button color='hsl(178, 100%, 23%)' textColor='white' disabled={levelPosition == 'last'} onClick={setToNext}>
        Next Level <ChevronRight />
        </Button>
        <Button color='hsla(0, 58.70%, 70.60%, 0.88)' textColor='black' onClick={resetLevel}>
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
  grid-template-columns: 50% 50%;
  grid-template-rows: 1fr 90px;
  align-items: start;
  gap: 70px;
  margin-inline: 30px;
  margin-bottom: 60px;
  height: 100%;
  max-width: 100%;
  overflow-y: clip;
  position: fixed;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    grid-template-rows: 35% 60% 5%;
    margin-inline: 10px;
    justify-items: center;
    align-items: center;
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
    top: 65%;
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
  gap: calc(var(--sizeOfEachUnit) / 2);
  overflow-y: auto;
  max-height:  70vh;
  height: fit-content;
  padding-top: 10px;
  z-index: 1;
  line-height: 0;

  @media (max-width: 750px) {
    max-height: 40vh;
    height: fit-content;
    align-items: center;
    justify-content: space-around;
    margin-inline: 0px;
  }
`;
// Not sure why subtracting 2 from the sizeOfEachUnit works here. May be a box-sizing issue although it should all be set to border-box...

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-self: center;
  justify-content: center;
  position: fixed;
  bottom: 20px;
  z-index: 3;
  background-color: hsl(107, 100.00%, 93.70%);
  border-radius: 10px;
  border: 3px solid hsl(180, 89.10%, 21.60%);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  left: auto;
  right: auto;

  @media (max-width: 750px) {
    bottom: 0px;
    margin-inline: 0px;
    width: 100%;
  }

  @media (max-width: 450px) {
    left: 0;
    right: 0;
  }
`;

export default Game;

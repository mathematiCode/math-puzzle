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
import { motion } from 'motion/react';
import styled from 'styled-components';
import { DragOverlay } from '@dnd-kit/core';
import { PiecesInPlayContext } from '../context/PiecesInPlay.tsx';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';
import { getInitialPieces } from '../hooks/getInitialPieces.ts';
import { Piece } from '../types/piece.ts';
import Hotjar from '@hotjar/browser';
import { ChevronLeft, ChevronRight, RotateCcw, HelpCircle } from 'lucide-react';
//import { BoardSquaresContext } from '../context/BoardSquares.tsx';

function Game() {
  const {
    currentLevel,
    levelPosition,
    previousLevel,
    nextLevel,
    setSizeOfEachUnit,
  } = useContext(CurrentLevelContext);
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const { piecesInPlay, resetPieces, setPiecesForNewLevel } =
    useContext(PiecesInPlayContext);

  // const { boardSquares, resetBoardSquares } = useContext(BoardSquaresContext);
  const [isRotating, setIsRotating] = useState(false);

  const boardRef = useRef(null);

  async function setToPrevious() {
    await previousLevel();

    const newPieces = getInitialPieces(currentLevel - 1);
    await setPiecesForNewLevel(newPieces);
    //await setSizeOfEachUnit(currentLevel - 1);
    //  resetBoardSquares(currentLevel - 1);
  }

  async function setToNext() {
    await nextLevel();
    const newPieces = getInitialPieces(currentLevel + 1);
    await setPiecesForNewLevel(newPieces);
    // await setSizeOfEachUnit(currentLevel + 1);
    // resetBoardSquares(currentLevel + 1);
    const passedLevel = false;
    if (passedLevel) {
      Hotjar.event('Completed Level');
      Hotjar.event(`Completed level ${currentLevel}`);
      Hotjar.event('Skip a level without completing it');
      Hotjar.event(`Skip level ${currentLevel} without completing it`);
      Hotjar.event('A');
      Hotjar.event('B');
      Hotjar.event('C');
      Hotjar.event('piece collision on board');
      Hotjar.event('used all actions');
      Hotjar.event('used all rotations');
      Hotjar.event('used all double widths');
      Hotjar.event('used all double heights');
      Hotjar.event('used all combine pieces');
      Hotjar.event('used all separate pieces');
      Hotjar.event('started onboarding');
      Hotjar.event('completed onboarding');
      Hotjar.event('turned on grid mode');
      Hotjar.event('turned off grid mode');
      Hotjar.event('made 10 moves');
      Hotjar.event('made 20 moves');
      Hotjar.event('made 30 moves');
      Hotjar.event('made 40 moves');
      Hotjar.event('made 50 moves');
      Hotjar.event(
        'performed 2 non-inverse actions consecutively on one piece'
      );
      Hotjar.event("performed an action immediately followed by it's inverse");
      Hotjar.event('performed 5 actions');
      Hotjar.event('performed 10 actions');
      Hotjar.event('turned off action limits');
      Hotjar.event('turned on action limits');
    }
  }

  function resetLevel() {
    resetPieces();
    Hotjar.event('reset level');
    // resetBoardSquares(currentLevel);
    const newPieces = useInitialPieces(currentLevel + 1);
    setPiecesForNewLevel(newPieces);
    //setSizeOfEachUnit(currentLevel + 1);
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
        <Button color='hsla(0, 78.00%, 75.10%, 0.88)' textColor='black' onClick={resetLevel}>
         <RotateCcw/> Reset Game 
        </Button>
        <InstructionsModal
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          piecesInPlay={piecesInPlay}
        />
      </ButtonContainer>
    </Main>
  );
}

export const Main = styled.main`
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: 1fr 90px;
  align-items: start;
  gap: 70px;
  margin-inline: 30px;
  height: 100%;
  overflow-y: auto;

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
  overflow-y: scroll;
  max-height:  70vh;
  height: 65vh;

  @media (max-width: 750px) {
    max-height: 50vh;
    height: 45vh;
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

// @ts-nocheck
import { useContext, useState, useRef } from 'react';
import levels from '../levels.json';
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
  }

  function resetLevel() {
    resetPieces();
    // resetBoardSquares(currentLevel);
    console.log(boardSquares);
    const newPieces = useInitialPieces(currentLevel + 1);
    setPiecesForNewLevel(newPieces);
    setSizeOfEachUnit(currentLevel + 1);
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
        <Button disabled={levelPosition == 'first'} onClick={setToPrevious}>
          Previous Level
        </Button>
        <Button disabled={levelPosition == 'last'} onClick={setToNext}>
          Next Level
        </Button>
        <Button onClick={resetLevel}>Reset Game</Button>
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
  grid-template-rows: 1fr 50px;
  align-items: start;
  gap: calc(var(--sizeOfEachUnit));
  margin-inline: 30px;
  height: 100%;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    grid-template-rows: 55% 40% 5%;
    margin-inline: 10px;
    justify-items: center;
  }
`;

export const BoardWrapper = styled.div`
  display: grid;
  grid-area: 1fr;
  width: min-content;
`;

export const PiecesContainer = styled(motion.div).attrs({
  layout: true,
  key: props => props.$currentLevel,
})<{ $currentLevel: number }>`
  display: flex;
  flex-direction: row;
  /* width: 700px; */
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

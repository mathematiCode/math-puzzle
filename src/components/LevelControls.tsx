import styled from 'styled-components';
import Button from './Button';
import InstructionsModal from '../Game/Instructions/InstructionsModal';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Piece } from '../types/piece';
import { CurrentLevelContext } from '../context/CurrentLevel';
import { useContext } from 'react';
import { getInitialPieces } from '../Game/utils/getInitialPieces';
import { PiecesInPlayContext } from '../context/PiecesInPlay';
import { BoardSquaresContext } from '../context/BoardSquares';
import { LevelProgressContext } from '../context/LevelProgress';

interface LevelControlsProps {
  levelPosition: string;
  setLevelCompletedShown: (completed: boolean) => void;
  isRotating: boolean;
  setIsRotating: (rotating: boolean) => void;
  setActivePiece: (piece: Piece | null) => void;
}

const LevelControls = ({
  levelPosition,
  setLevelCompletedShown,
  isRotating,
  setIsRotating,
  setActivePiece,
}: LevelControlsProps) => {
  const { currentLevel, previousLevel, nextLevel } =
    useContext(CurrentLevelContext);
  const piecesInPlayContext = useContext(PiecesInPlayContext);
  if (!piecesInPlayContext) {
    throw new Error(
      'PiecesInPlayContext must be used within a PiecesInPlayProvider'
    );
  }
  const { piecesInPlay, resetPieces, setPiecesForNewLevel } =
    piecesInPlayContext;
  const boardSquaresContext = useContext(BoardSquaresContext);
  if (!boardSquaresContext) {
    throw new Error(
      'BoardSquaresContext must be used within a BoardSquaresProvider'
    );
  }
  const { resetBoardSquares } = boardSquaresContext;
  const levelProgressContext = useContext(LevelProgressContext);
  if (!levelProgressContext) {
    throw new Error(
      'LevelProgressContext must be used within a LevelProgressProvider'
    );
  }
  async function setToPrevious() {
    await previousLevel();
    const newPieces = getInitialPieces(currentLevel - 1);
    await setPiecesForNewLevel(newPieces);
    //await setSizeOfEachUnit(currentLevel - 1);
    await resetBoardSquares(currentLevel - 1);
    setLevelCompletedShown(false);
  }

  async function setToNext() {
    await nextLevel();
    const newPieces = getInitialPieces(currentLevel + 1);
    await setPiecesForNewLevel(newPieces);
    //await setSizeOfEachUnit(currentLevel + 1);
    await resetBoardSquares(currentLevel + 1);
    setLevelCompletedShown(false);
  }

  function resetLevel() {
    resetPieces();
    resetBoardSquares(currentLevel);
    setLevelCompletedShown(false);
  }

  return (
    <ButtonContainer data-testid="button-container">
      <Button
        color="hsl(178, 30.00%, 56.10%)"
        textColor="black"
        disabled={levelPosition == 'first'}
        onClick={setToPrevious}
      >
        <ChevronLeft />
        Previous Level
      </Button>
      <Button
        color="hsl(178, 100%, 23%)"
        textColor="white"
        disabled={levelPosition == 'last'}
        onClick={setToNext}
      >
        Next Level <ChevronRight />
      </Button>
      <Button
        color="hsla(0, 58.70%, 70.60%, 0.88)"
        textColor="black"
        onClick={resetLevel}
      >
        <RotateCcw /> Reset Game
      </Button>
      <InstructionsModal
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        piecesInPlay={piecesInPlay}
        setActivePiece={setActivePiece}
      />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 20px;
  z-index: 3;
  background-color: hsl(107, 100%, 93.7%);
  border-radius: 10px;
  border: 3px solid hsl(180, 89.1%, 21.6%);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);

  @media (max-width: 750px) {
    bottom: 0px;
  }

  @media (max-width: 450px) {
    left: 0;
    right: 0;
    width: 100%;
  }
`;

export default LevelControls;

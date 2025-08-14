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
import { useMediaQuery } from '@chakra-ui/react';

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

  const [isMobile] = useMediaQuery(['(max-width: 768px)']);
  console.log(isMobile);

  return (
    <ButtonContainer data-testid="button-container">
      <InstructionsModal
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        piecesInPlay={piecesInPlay}
        setActivePiece={setActivePiece}
      />
      <LevelNavigationControl>
        <NavigationButton
          onClick={setToPrevious}
          disabled={levelPosition === 'first'}
          $isLeft={true}
        >
          <ChevronLeft size={isMobile ? 20 : 30} />
        </NavigationButton>
        <LevelDisplay>Level {currentLevel + 1}</LevelDisplay>
        <NavigationButton
          onClick={setToNext}
          disabled={levelPosition === 'last'}
          $isLeft={false}
        >
          <ChevronRight size={isMobile ? 20 : 30} />
        </NavigationButton>
      </LevelNavigationControl>
      <Button
        color="hsla(0, 58.70%, 70.60%, 0.88)"
        textColor="black"
        onClick={resetLevel}
      >
        <RotateCcw /> Reset Game
      </Button>
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
  gap: 10px;
  background-color: hsl(107, 100%, 93.7%);
  border-radius: 10px;
  border: 3px solid hsl(180, 89.1%, 21.6%);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    bottom: 0px;
  }

  @media (max-width: 450px) {
    left: 0;
    right: 0;
    width: 100%;
    border: none;
    box-shadow: none;
    background-color: transparent;
  }
`;

const LevelNavigationControl = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  height: 100%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  background-color: hsl(180, 89.1%, 26.6%);
  border: 1px solid black;
  overflow: hidden;
  margin-right: 10px;
  margin-left: 10px;
  color: white;

  @media (max-width: 768px) {
    margin-right: 0px;
    margin-left: 0px;
    height: 24px;
    border-radius: 4px;
  }
`;

const NavigationButton = styled.button<{ $isLeft: boolean }>`
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 12px 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 2px 4px;
    font-size: 0.8rem;
  }

  svg {
    color: white;
  }
`;

const LevelDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  font-weight: bold;
  color: white;
  font-size: 1.3rem;
  min-width: 80px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0px 2px;
    min-width: 40px;
  }
`;

export default LevelControls;

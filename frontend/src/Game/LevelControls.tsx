import styled from 'styled-components';
import Button from '../components/Button';
import InstructionsModal from './Instructions/InstructionsModal';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Piece } from '../types/piece';
import { getInitialPieces } from './utils/getInitialPieces';
import { usePiecesInPlay } from '../context/PiecesInPlay';
import { useBoardSquares } from '../context/BoardSquares';
import { useGameProgress } from '../context/GameProgress';
import { useMediaQuery } from '@chakra-ui/react';
import { useCurrentLevel } from '../context/CurrentLevel';

interface LevelControlsProps {
  levelPosition: string;
  isRotating: boolean;
  setIsRotating: (rotating: boolean) => void;
  setActivePiece: (piece: Piece | null) => void;
}

const LevelControls = ({
  levelPosition,
  isRotating,
  setIsRotating,
  setActivePiece,
}: LevelControlsProps) => {
  const { currentLevel, previousLevel, nextLevel } = useCurrentLevel();
  const { piecesInPlay, resetPieces, setPiecesForNewLevel } = usePiecesInPlay();
  const { resetBoardSquares } = useBoardSquares();
  const { resetLevel, gameProgress, setPiecesForLevel } = useGameProgress();
  async function setToPrevious() {
    setPiecesForLevel(currentLevel, piecesInPlay);
    previousLevel();
    const newLevel = currentLevel - 1;
    const savedPieces = gameProgress[newLevel]?.pieces;

    if (savedPieces && savedPieces.length > 0) {
      setPiecesForNewLevel(savedPieces);
    } else {
      const newPieces = getInitialPieces(newLevel);
      setPiecesForNewLevel(newPieces);
    }

    resetBoardSquares(newLevel);
  }

  async function setToNext() {
    setPiecesForLevel(currentLevel, piecesInPlay);
    nextLevel();
    const newLevel = currentLevel + 1;
    const savedPieces = gameProgress[newLevel]?.pieces;

    if (savedPieces && savedPieces.length > 0) {
      setPiecesForNewLevel(savedPieces);
    } else {
      const newPieces = getInitialPieces(newLevel);
      setPiecesForNewLevel(newPieces);
    }

    resetBoardSquares(newLevel);
  }

  function handleResetLevel() {
    resetPieces();
    resetBoardSquares(currentLevel);
    resetLevel(currentLevel);
  }

  const [isMobile] = useMediaQuery(['(max-width: 768px)']);

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
          <ChevronLeft size={isMobile ? 24 : 30} />
        </NavigationButton>
        <LevelDisplay>Level {currentLevel + 1}</LevelDisplay>
        <NavigationButton
          onClick={setToNext}
          disabled={levelPosition === 'last'}
          $isLeft={false}
        >
          <ChevronRight size={isMobile ? 24 : 30} />
        </NavigationButton>
      </LevelNavigationControl>
      <Button
        color="hsla(0, 58.70%, 70.60%, 0.88)"
        textColor="black"
        onClick={handleResetLevel}
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
    border-radius: 5px;
    height: 36px;
  }
`;

const NavigationButton = styled.button<{ $isLeft: boolean }>`
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  padding: 0px 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0px 4px;
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
  font-weight: 600;
  color: white;
  font-size: 1.3rem;
  min-width: 80px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.1;
    padding: 4px 4px;
    min-width: 40px;
  }
`;

export default LevelControls;

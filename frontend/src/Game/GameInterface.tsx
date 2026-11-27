import { useState} from 'react';
import levels from './levels.json' with { type: 'json' };
import InitialPuzzlePiece from './PuzzlePieces/InitialPuzzlePiece';
import PieceOverlay from './PuzzlePieces/PieceOverlay';
import PiecePreview from './PuzzlePieces/PiecePreview';
import Board from './Board/Board';
import PlacedPieces from './PlacedPieces';
import DragAndDropArea from './DragAndDropArea';
import LevelControls from './LevelControls';
import LevelCompleteModal from './LevelComplete';
import { motion } from 'motion/react';
import styled from 'styled-components';
import { DragOverlay } from '@dnd-kit/core';
import { Lock, RotateCcw } from 'lucide-react';
import { useCurrentLevel } from '../context/CurrentLevel';
import { useGameProgress } from '../context/GameProgress';
import { usePiecesInPlay } from '../context/PiecesInPlay';
import { useResetLevel } from '../hooks/useResetLevel';
import { Piece } from '../types/piece';
import { RETURN_TO_CONTAINER_DURATION } from './utils/utilities';

function Game() {
  const {
    currentLevel,
    levelId,
    levelPosition,
    } = useCurrentLevel();
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const [previewLocation, setPreviewLocation] = useState<string | null>(null);
  // Id of a piece currently animating back into the initial pieces container
  // after being dropped there. While a piece is "returning" we keep its real
  // node hidden so only the animated DragOverlay copy is visible (issue #84).
  const [returningPieceId, setReturningPieceId] = useState<string | null>(null);
  const { gameProgress, isLevelCompleted, setModalShown } = useGameProgress();
 // const { handleLevelCheck } = useLevelCompletion();
  const { piecesInPlay } = usePiecesInPlay();
  const { resetCurrentLevel } = useResetLevel();
  const [isRotating, setIsRotating] = useState(false);
 // const [levelCompletedShown, setLevelCompletedShown] = useState(false);
  const levelCompletedShown = gameProgress[currentLevel].modalShown;
  const passedLevel = isLevelCompleted(currentLevel);

  const handleCloseModal = () => {
    setModalShown(currentLevel);
  };


  return (
    <>
      <Main id='main' $isRotating={isRotating}>
      <DragAndDropArea data-testid='drag-and-drop-area'
        setActivePiece={setActivePiece}
        key={currentLevel}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        setPreviewLocation={setPreviewLocation}
        setReturningPieceId={setReturningPieceId}
          >
        <PiecesContainer data-testid='pieces-container' $currentLevel={currentLevel} $isRotating={isRotating} key={currentLevel}>
          {piecesInPlay.map((piece: Piece) => {
            if (piece.location != null) return null;
            return (
              <InitialPuzzlePiece
                piece={piece}
                isActive={activePiece?.id === piece.id}
                isReturning={returningPieceId === piece.id}
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
          {activePiece && previewLocation && !isRotating ? (
            <PiecePreview piece={activePiece} location={previewLocation} />
          ) : null}
          {passedLevel ? (
            <LockBadge
              type="button"
              onClick={resetCurrentLevel}
              aria-label="Level complete and locked. Reset this level to move the pieces again."
              title="Reset this level to move the pieces again"
            >
              <Lock aria-hidden="true" />
              <span>Level complete — locked</span>
              <Divider aria-hidden="true" />
              <RotateCcw aria-hidden="true" />
              <span>Reset to move pieces</span>
            </LockBadge>
          ) : null}
              </BoardWrapper>
        {activePiece && !isRotating ? (
          <DragOverlay
            dropAnimation={{
              duration: RETURN_TO_CONTAINER_DURATION,
              easing: 'ease',
            }}
          >
            <PieceOverlay piece={activePiece} />
          </DragOverlay>
              ) : null}
          </DragAndDropArea>
       </Main>
      <LevelControls
        levelPosition={levelPosition}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        setActivePiece={setActivePiece}
      />
        <LevelCompleteModal
          level={levelId}
          completed={passedLevel}
          levelCompletedShown={levelCompletedShown}
          onClose={handleCloseModal}
        />
        </>
  );
}

export const Main = styled.main<{ $isRotating?: boolean }>`
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
  overflow-y: ${({ $isRotating }) => ($isRotating ? 'visible' : 'clip')};
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

// Clickable "level locked" indicator shown once a level is completed. It floats
// over the top of the solved board; clicking it resets the level so the pieces
// can be moved again. Pieces are already drag-locked, so this is the in-context
// way to unlock, mirroring the Reset Game button.
export const LockBadge = styled.button`
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 7;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid black;
  border-radius: 999px;
  background-color: hsl(180, 89.1%, 26.6%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  animation: lockBadgeIn 0.25s ease-out;

  @keyframes lockBadgeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -6px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  &:hover {
    background-color: hsl(180, 89.1%, 21.6%);
  }
  &:active {
    transform: translateX(-50%) scale(0.97);
  }
  &:focus-visible {
    outline: 3px solid hsl(107, 100%, 70%);
    outline-offset: 2px;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  @media (max-width: 750px) {
    font-size: 0.78rem;
    padding: 6px 12px;
    gap: 6px;
    max-width: 92vw;
    white-space: normal;
    text-align: left;

    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

const Divider = styled.span`
  width: 1px;
  align-self: stretch;
  background-color: rgba(255, 255, 255, 0.5);
  margin-inline: 2px;

  @media (max-width: 750px) {
    display: none;
  }
`;

export const PiecesContainer = styled(motion.div).attrs({
  layout: true,
})<{ $currentLevel: number; $isRotating?: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: start;
  gap: calc(var(--sizeOfEachUnit) / 2);
  overflow: ${({ $isRotating }) => ($isRotating ? 'visible' : 'hidden auto')};
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

import { useState, useEffect } from 'react';
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
  // The lock banner only appears once the player tries to move a piece on an
  // already-completed level; it stays hidden otherwise. Reset whenever the
  // level changes so it doesn't carry over to another (possibly completed) level.
  const [showLockBanner, setShowLockBanner] = useState(false);
  useEffect(() => {
    setShowLockBanner(false);
  }, [currentLevel]);

  const handleCloseModal = () => {
    setModalShown(currentLevel);
  };

  const handleResetLevel = () => {
    resetCurrentLevel();
    setShowLockBanner(false);
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
        <BoardWrapper data-testid='board-wrapper' $showBanner={passedLevel && showLockBanner}>
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
            <LockInteractionLayer
              data-testid="level-locked-overlay"
              aria-hidden="true"
              onPointerDown={() => setShowLockBanner(true)}
            />
          ) : null}
          {passedLevel && showLockBanner ? (
            <LockBadge
              type="button"
              onClick={handleResetLevel}
              aria-label="Level complete and locked. Reset this level to play again."
              title="Reset this level to play again"
            >
              <LockBadgeTitle>
                <Lock aria-hidden="true" />
                <span>Level Complete</span>
              </LockBadgeTitle>
              <Divider aria-hidden="true" />
              <LockBadgeAction>
                <RotateCcw aria-hidden="true" />
                <span>Reset to play again</span>
              </LockBadgeAction>
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

export const BoardWrapper = styled.div<{ $showBanner?: boolean }>`
  display: grid;
  grid-area: 1fr;
  width: min-content;
  /* While the lock banner is showing, reserve space above the board so it sits
     entirely above the board without covering any pieces. */
  padding-top: ${({ $showBanner }) => ($showBanner ? '68px' : '15px')};
  position: relative;
  isolation: isolate;

  @media (max-width: 750px) {
    padding-top: ${({ $showBanner }) => ($showBanner ? '58px' : '15px')};
  }
`;

// Transparent layer over a completed board. It swallows the first interaction
// with the locked pieces and reveals the lock banner, so the player learns why
// the pieces won't move. It sits above the pieces but below the banner.
const LockInteractionLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 8;
  cursor: not-allowed;
`;

// Clickable "level locked" indicator shown once a level is completed. It sits
// in reserved space entirely above the board (never covering any pieces),
// horizontally centered; clicking it resets the level so the pieces can be
// moved again. Pieces are already drag-locked, so this is the in-context way to
// unlock, mirroring the Reset Game button.
export const LockBadge = styled.button`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background-color: hsl(38, 87%, 70%);
  color: black;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  animation: lockBadgeIn 0.2s ease-out;

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
    background-color: hsl(38, 87%, 76%);
  }
  &:active {
    transform: translateX(-50%) scale(0.98);
  }
  &:focus-visible {
    outline: 3px solid hsl(200, 80%, 50%);
    outline-offset: 3px;
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 750px) {
    gap: 10px;
    padding: 8px 14px;
  }
`;

const LockBadgeTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05rem;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 750px) {
    font-size: 0.85rem;
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const LockBadgeAction = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.7);

  svg {
    width: 17px;
    height: 17px;
  }

  @media (max-width: 750px) {
    font-size: 0.78rem;
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const Divider = styled.span`
  width: 1px;
  align-self: stretch;
  background-color: rgba(0, 0, 0, 0.3);
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

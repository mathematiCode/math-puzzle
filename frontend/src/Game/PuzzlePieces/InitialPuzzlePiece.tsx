// @ts-nocheck
import { useState, useLayoutEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Rectangle from '../Rectangle';
import ActionsToolbarPopover from '../ActionsToolbar/ActionsToolbarPopover';
import CutOverlay from './CutOverlay';
import { motion, useAnimate } from 'motion/react';
import { useSelectedPiece } from '../../context/SelectedPiece';
import { useCuttingPiece } from '../../context/CuttingPiece';
import { usePiecesInPlay } from '../../context/PiecesInPlay';
import { Piece } from '../../types/piece';
import { pieceTestId } from '../utils/piece';
import { consumeSplitOrigin, hasSplitOrigin } from '../utils/splitAnimation';
import styled from 'styled-components';
import { mergeRefs } from '@chakra-ui/react';
import Hotjar from '@hotjar/browser';

const InitialPuzzlePiece = ({
  piece,
  isRotating,
  setIsRotating,
  isExample = false,
  isActive = false,
  isReturning = false,
  setActivePiece,
}: {
  piece: Piece;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  isExample?: boolean;
  isActive?: boolean;
  isReturning?: boolean;
  setActivePiece: (piece: Piece) => void;
}) => {
  const { selectedPiece, setSelectedPiece } = useSelectedPiece();
  const { cuttingPieceId } = useCuttingPiece();
  const [scope, animate] = useAnimate();
  const { updateDimensions } = usePiecesInPlay();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: piece.id,
  });
  const refs = mergeRefs(scope, setNodeRef);

  // If this piece was just produced by a cut (the right/bottom half), glide it
  // from where that half sat inside the original piece into its new tray slot
  // instead of letting it pop into place. While gliding we turn off framer's
  // layout/layoutId for this element so it doesn't fight the FLIP transform.
  const [isGliding, setIsGliding] = useState(() => hasSplitOrigin(piece.id));
  useLayoutEffect(() => {
    const origin = consumeSplitOrigin(piece.id);
    const el = scope.current;
    if (!origin || !el) {
      setIsGliding(false);
      return;
    }
    const rect = el.getBoundingClientRect();
    const dx = origin.left - rect.left;
    const dy = origin.top - rect.top;
    if (!dx && !dy) {
      setIsGliding(false);
      return;
    }
    // FLIP: jump to the origin with no transition, then ease back to natural
    // position (translate 0). Slower than the sibling reflow so it reads clearly.
    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    void el.offsetWidth; // force the starting transform to take effect
    el.style.transition = 'transform 0.6s ease-in-out';
    el.style.transform = 'translate(0px, 0px)';
    const handleEnd = () => {
      el.removeEventListener('transitionend', handleEnd);
      el.style.transition = '';
      el.style.transform = '';
      setIsGliding(false);
    };
    el.addEventListener('transitionend', handleEnd);
    return () => el.removeEventListener('transitionend', handleEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePieceSelected() {
    setSelectedPiece(piece);
    setActivePiece(piece);
    Hotjar.event(
      `initial piece selected width:${piece.width} height:${piece.height}`
    );
  }

  async function runRotationAnimation(selectedPiece) {
    setIsRotating(true);
    try {
      await animate(
        scope.current,
        { rotate: 90 },
        { type: 'spring', stiffness: 150, damping: 11 }
      );
      // Use the current piece dimensions from the piece prop instead of selectedPiece
      updateDimensions(piece.id, piece.height, piece.width);
      await animate(scope.current, { rotate: 0 }, { duration: 0 });
    } finally {
      setIsRotating(false);
    }
    Hotjar.event('rotation');
  }

  const isSelected = selectedPiece?.id === piece.id;

  return (
    <>
    <ActionsToolbarPopover runRotationAnimation={runRotationAnimation}>
      <InitialPieceWrapper
        ref={refs}
        {...listeners}
        {...attributes}
        onClick={handlePieceSelected}
        data-testid={pieceTestId(piece)}
        isDragging={(isDragging && isSelected) || isReturning}
        layout={!isGliding && !isRotating && !isDragging}
        {...(!isGliding && !(isRotating && isSelected)
          ? { layoutId: piece.id }
          : {})}
      >
        <Rectangle
          width={piece.width}
          height={piece.height}
          unitSize={
            window.innerWidth >= 750 || isActive || isDragging ? 1 : 0.7
          }
          color={piece.color}
          isMotion={true}
          layout={!isRotating}
          isSelected={isSelected}
          isExample={isExample}
        />
      </InitialPieceWrapper>
    </ActionsToolbarPopover>
    {cuttingPieceId === piece.id ? (
      <CutOverlay piece={piece} targetRef={scope} />
    ) : null}
    </>
  );
};

export const InitialPieceWrapper = styled(motion.button)`
  visibility: ${({ isDragging }) => (isDragging ? 'hidden' : 'visible')};
  border: none;
  z-index: 2;
  border: 2px solid black;
  margin: 0;
  &:active {
    cursor: grab;
  }
`;

InitialPuzzlePiece.displayName = 'InitialPuzzlePiece';

export default InitialPuzzlePiece;

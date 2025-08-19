import { useContext, cloneElement } from 'react';
import { Tooltip } from 'antd';
import { motion } from 'motion/react';
import * as Popover from '@radix-ui/react-popover';
import styled from 'styled-components';
import { useSelectedPiece } from '../../context/SelectedPiece';
import { usePiecesInPlay } from '../../context/PiecesInPlay';
import { useCurrentPiece } from '../../hooks/useCurrentPiece';
import AnimatedLottieIcon from '../../components/AnimatedLottieIcon';
import rotateToolAnimation from '../../assets/icons-animation/rotate-tool.json';
import horizontalStretchAnimation from '../../assets/icons-animation/horizontal-stretch-tool.json';
import verticalStretchAnimation from '../../assets/icons-animation/vertical-stretch-tool.json';
import cutAnimation from '../../assets/icons-animation/cut-tool.json';
import combineAnimation from '../../assets/icons-animation/combine-tool.json';
import Hotjar from '@hotjar/browser';
import { convertLocationToXAndY } from '../utils/utilities';
import { BoardSquaresContext } from '../../context/BoardSquares';
import { getNewValidLocation } from '../utils/getNewValidLocation';
import { usePieceLocationHandler } from './usePieceLocationHandler';

function ActionsToolbarPopover({
  children,
  runRotationAnimation, // lives in PuzzlePiece components
  ...delegated
}: {
  children: React.ReactElement;
  runRotationAnimation: any;
  delegated?: any;
}) {
  /* Cloning the children is necessary for the popover to position correctly when pieces are positioned absolutely on the board. */
  const childrenWithDelegatedProps = cloneElement(children, delegated);
  const { updateDimensions, movePiece } = usePiecesInPlay();
  const { selectedPiece } = useSelectedPiece();
  const currentPiece = useCurrentPiece();
  const showTooltips = false;
  const { updateLocationAndBoardSquares } = usePieceLocationHandler();

  function handleHorizontalStretch() {
    Hotjar.event('double width attempt');
    if (!currentPiece) {
      return;
    }
    const id = currentPiece.id;
    const isOnBoard =
      currentPiece.location &&
      currentPiece.location.match(/^\(\d+,\d+\)$/) &&
      currentPiece.id.startsWith('b-');
    const stretchIsPossible = Number.isInteger(currentPiece.height / 2);
    console.log(`horizontal stretch is possible: ${stretchIsPossible}`);
    console.log('currentPiece', currentPiece);
    if (stretchIsPossible) {
      console.log(
        `piece ${id} with width:${currentPiece.width} and height:${currentPiece.height} is being stretched horizontally`
      );
      const newHeight = currentPiece.height / 2;
      const newWidth = currentPiece.width * 2;
      updateDimensions(id, newWidth, newHeight);
      if (isOnBoard) {
        updateLocationAndBoardSquares(
          currentPiece,
          newWidth,
          newHeight,
          movePiece
        );
      }
      Hotjar.event('double width successfully');
    }
  }

  function handleVerticalStretch() {
    if (!currentPiece) {
      return;
    }
    Hotjar.event('double height attempt');
    const stretchIsPossible = Number.isInteger(currentPiece.width / 2);
    console.log(`vertical stretch is possible: ${stretchIsPossible}`);
    if (stretchIsPossible) {
      const newHeight = currentPiece.height * 2;
      const newWidth = currentPiece.width / 2;
      const id = currentPiece.id;
      const isOnBoard =
        currentPiece.location &&
        currentPiece.location.match(/^\(\d+,\d+\)$/) &&
        currentPiece.id.startsWith('b-');
      console.log(
        `piece ${id} with width:${currentPiece.width} and height:${currentPiece.height} is being stretched vertically`
      );
      if (isOnBoard) {
        updateLocationAndBoardSquares(
          currentPiece,
          newWidth,
          newHeight,
          movePiece
        );
      }
      updateDimensions(id ?? 'invalidId', newWidth, newHeight);
      Hotjar.event('double height successfully');
    }
  }

  function handleCombinePieces() {
    Hotjar.event('combine pieces successfully');
    Hotjar.event('combine pieces unsuccessfully');
  }

  function handleSeparatePieces() {
    Hotjar.event('separate pieces successfully');
    Hotjar.event('separate pieces unsuccessfully');
  }

  const horizontalStretchDisabled =
    currentPiece?.height == null || currentPiece.height % 2 !== 0;
  const verticalStretchDisabled =
    currentPiece?.width == null || currentPiece.width % 2 !== 0;
  const rotateDisabled = currentPiece == null;
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{childrenWithDelegatedProps}</Popover.Trigger>
      <Popover.Portal container={document.body}>
        <PopoverContent sideOffset={5} align="center" side="bottom">
          <ActionsToolbar>
            <Tooltip placement="bottom" title={showTooltips && 'Rotate'}>
              <IconButton
                onClick={() => runRotationAnimation(currentPiece)}
                aria-label="Rotate"
                isDisabled={rotateDisabled}
                disabled={rotateDisabled}
              >
                <AnimatedLottieIcon
                  animationData={rotateToolAnimation}
                  isDisabled={rotateDisabled}
                />
              </IconButton>
            </Tooltip>
            <Tooltip
              placement="bottom"
              title={
                !showTooltips
                  ? ''
                  : horizontalStretchDisabled
                  ? 'Disabled because fractional side lengths are not allowed'
                  : 'Double Width & Halve Height'
              }
            >
              <IconButton
                onClick={handleHorizontalStretch}
                aria-label="Double Width & Halve Height"
                isDisabled={horizontalStretchDisabled}
                disabled={horizontalStretchDisabled}
              >
                <AnimatedLottieIcon
                  animationData={horizontalStretchAnimation}
                  isDisabled={horizontalStretchDisabled}
                />
              </IconButton>
            </Tooltip>
            <Tooltip
              placement="bottom"
              title={
                !showTooltips
                  ? ''
                  : verticalStretchDisabled
                  ? 'Disabled because fractional side lengths are not allowed'
                  : 'Double Height & Halve Width'
              }
            >
              <IconButton
                onClick={handleVerticalStretch}
                aria-label="Double Height & Halve Width"
                isDisabled={verticalStretchDisabled}
                disabled={verticalStretchDisabled}
              >
                <AnimatedLottieIcon
                  animationData={verticalStretchAnimation}
                  isDisabled={verticalStretchDisabled}
                />
              </IconButton>
            </Tooltip>
            {/* <Tooltip placement="bottom" title="Cut into two rectangles">
              <IconButton aria-label="Cut into two rectangles">
                <AnimatedLottieIcon animationData={cutAnimation} />
              </IconButton>
            </Tooltip>
            <Tooltip placement="bottom" title="Combine two rectangles">
              <IconButton aria-label="Combine two rectangles">
                <AnimatedLottieIcon animationData={combineAnimation} />
              </IconButton>
            </Tooltip> */}
          </ActionsToolbar>
          <PopoverArrow />
        </PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  );
}

const IconButton = styled.button.withConfig({
  shouldForwardProp: prop => prop !== 'isDisabled',
})<{
  isDisabled?: boolean;
}>`
  padding: 0px;
  margin: 0px;
  border: none;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};

  svg {
    width: 32px;
    height: 32px;

    @media (max-width: 750px) {
      width: 28px;
      height: 28px;
    }
  }
`;

const PopoverContent = styled(Popover.Content)`
  background-color: white;
  border-radius: 5px;
  padding: 0;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;

  &[data-state='open'][data-side='top'] {
    animation-name: slideDownAndFade;
  }
  &[data-state='open'][data-side='right'] {
    animation-name: slideLeftAndFade;
  }
  &[data-state='open'][data-side='bottom'] {
    animation-name: slideUpAndFade;
  }
  &[data-state='open'][data-side='left'] {
    animation-name: slideRightAndFade;
  }

  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideRightAndFade {
    from {
      opacity: 0;
      transform: translateX(-2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideDownAndFade {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideLeftAndFade {
    from {
      opacity: 0;
      transform: translateX(2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const PopoverArrow = styled(Popover.Arrow)`
  fill: white;
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 1px;
`;

const ActionsToolbar = styled(motion.div).withConfig({
  shouldForwardProp: prop => prop !== 'layout',
})`
  background-color: white;
  color: hsl(178, 100%, 23%);
  border-radius: 5px;
  margin-top: 0px;
  top: 0px;
  padding: 8px;
  gap: 20px;
  display: flex;
  align-items: center;

  @media (max-width: 750px) {
    padding: 4px;
    padding-block: 2px;
    gap: 16px;
  }
`;

export default ActionsToolbarPopover;

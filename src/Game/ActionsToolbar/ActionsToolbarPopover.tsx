//@ts-no-check
import { useContext } from 'react';
import { Tooltip } from 'antd';
import { motion } from 'motion/react';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import styled from 'styled-components';
import { useSelectedPiece } from '../../context/SelectedPiece';
import { PiecesInPlayContext } from '../../context/PiecesInPlay';
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
import { useUpdateLocation } from './useUpdateLocation';

function ActionsToolbarPopover({
  children,
  runRotationAnimation, // lives in PuzzlePiece components
  ...delegated
}: {
  children: React.ReactElement;
  runRotationAnimation: any;
  delegated: any;
}) {
  const context = useContext(PiecesInPlayContext);
  if (!context) {
    throw new Error(
      'ActionsToolbarPopover must be used within a PiecesInPlayProvider'
    );
  }
  const { updateDimensions, movePiece } = context;
  const { selectedPiece } = useSelectedPiece();
  const showTooltips = false;
  const { updateLocationAndBoardSquares } = useUpdateLocation();

  function handleHorizontalStretch() {
    Hotjar.event('double width attempt');
    const id = selectedPiece?.id;
    const pieceIndex = parseInt(id?.slice(id?.indexOf('-') + 1) ?? '0', 10);
    const stretchIsPossible =
      selectedPiece != null && Number.isInteger(selectedPiece.height / 2);
    if (stretchIsPossible) {
      const newHeight = selectedPiece.height / 2;
      const newWidth = selectedPiece.width * 2;
      updateDimensions(pieceIndex, newWidth, newHeight);
      if (
        selectedPiece.location != null &&
        selectedPiece.location != 'instructions' &&
        selectedPiece.id != null
      ) {
        updateLocationAndBoardSquares(
          selectedPiece,
          newWidth,
          newHeight,
          movePiece,
          pieceIndex
        );
      }
      Hotjar.event('double width successfully');
    }
  }

  function handleVerticalStretch() {
    Hotjar.event('double height attempt');
    if (selectedPiece && Number.isInteger(selectedPiece.width / 2)) {
      const newHeight = selectedPiece.height * 2;
      const newWidth = selectedPiece.width / 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id?.slice(id?.indexOf('-') + 1) ?? '0', 10);
      const isOnBoard =
        selectedPiece.location &&
        selectedPiece.location.match(/^\(\d+,\d+\)$/) &&
        selectedPiece.id?.startsWith('b-');
      if (isOnBoard) {
        updateLocationAndBoardSquares(
          selectedPiece,
          newWidth,
          newHeight,
          movePiece,
          pieceIndex
        );
      }
      updateDimensions(pieceIndex, newWidth, newHeight);
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
    selectedPiece?.height == null || selectedPiece.height % 2 !== 0;
  const verticalStretchDisabled =
    selectedPiece?.width == null || selectedPiece.width % 2 !== 0;
  const rotateDisabled = selectedPiece == null;
  return (
    <Popover withArrow trapFocus size="small" positioning="below">
      <PopoverTrigger {...delegated}>{children}</PopoverTrigger>
      <PopoverSurface id="actions">
        <ActionsToolbar>
          <Tooltip placement="bottom" title={showTooltips && 'Rotate'}>
            <IconButton
              onClick={() => runRotationAnimation(selectedPiece)}
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
      </PopoverSurface>
    </Popover>
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
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  @media (max-width: 750px) {
    padding: 4px;
    padding-block: 2px;
    gap: 16px;
  }
`;

export default ActionsToolbarPopover;

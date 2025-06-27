import { useContext } from 'react';
import { Tooltip } from 'antd';
import { RotateRightOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import styled from 'styled-components';
import { useSelectedPiece } from '../context/SelectedPiece';
import { PiecesInPlayContext } from '../context/PiecesInPlay';
import { HorizontalStretchIcon, VerticalStretchIcon } from './SvgIcons';

function ActionsToolbarPopover({
  children,
  runRotationAnimation, // lives in InitialPuzzlePiece
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
  const { updateDimensions } = context;
  const { selectedPiece } = useSelectedPiece();

  function handleHorizontalStretch() {
    if (selectedPiece && Number.isInteger(selectedPiece.height / 2)) {
      const newHeight = selectedPiece.height / 2;
      const newWidth = selectedPiece.width * 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id?.slice(id?.indexOf('-') + 1) ?? '0', 10);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  function handleVerticalStretch() {
    if (selectedPiece && Number.isInteger(selectedPiece.width / 2)) {
      const newHeight = selectedPiece.height * 2;
      const newWidth = selectedPiece.width / 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id?.slice(id?.indexOf('-') + 1) ?? '0', 10);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  return (
    <Popover withArrow trapFocus size="small" positioning="below">
      <PopoverTrigger {...delegated}>{children}</PopoverTrigger>
      <PopoverSurface id="actions">
        <ActionsToolbar>
          <Tooltip placement="bottom" title="Rotate">
            <IconButton
              onClick={() => runRotationAnimation(selectedPiece)}
              aria-label="Rotate"
            >
              <StyledRotateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip placement="bottom" title="Double Width & Halve Height">
            <IconButton
              onClick={handleHorizontalStretch}
              aria-label="Double Width & Halve Height"
            >
              <HorizontalStretchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip placement="bottom" title="Halve Width & Double Height">
            <IconButton
              onClick={handleVerticalStretch}
              aria-label="Halve Width & Double Height"
            >
              <VerticalStretchIcon />
            </IconButton>
          </Tooltip>
        </ActionsToolbar>
      </PopoverSurface>
    </Popover>
  );
}

const StyledRotateIcon = styled(RotateRightOutlined)`
  font-size: 32px;
  color: hsl(178, 100%, 23%);

  @media (max-width: 750px) {
    font-size: 28px;
  }
`;

const IconButton = styled.button`
  padding: 0px;
  margin: 0px;
  border: none;

  svg {
    width: 32px;
    height: 32px;

    @media (max-width: 750px) {
      width: 28px;
      height: 28px;
    }
  }
`;

const ActionsToolbar = styled(motion.div)`
  background-color: white;
  color: hsl(178, 100%, 23%);
  border-radius: 5px;
  margin-top: 0px;
  top: 0px;
  padding: 8px;
  gap: 12px;
  display: flex;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  @media (max-width: 750px) {
    padding: 4px;
    padding-block: 2px;
    gap: 6px;
  }
`;

export default ActionsToolbarPopover;

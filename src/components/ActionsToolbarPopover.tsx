/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Tooltip } from 'antd';
import { RotateRightOutlined } from '@ant-design/icons';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import styled from 'styled-components';
import { useSelectedPiece } from '../context/SelectedPiece.tsx';
import { PiecesInPlayContext } from '../context/PiecesInPlay';

const StyledRotateIcon = styled(RotateRightOutlined)`
  font-size: 32px;
  color: hsl(178, 100%, 23%);
`;

const IconButton = styled.button`
  padding: 0px;
  margin: 0px;
  border: none;
`;

const Icon = styled.img`
  width: 32px;
`;

const ActionsToolbar = styled.div`
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
`;

function ActionsToolbarPopover({
  children,
  ...delegated
}: {
  children: React.ReactNode;
  delegated: any;
}) {
  const { updateDimensions, rotatePiece } = useContext(PiecesInPlayContext);
  const { selectedPiece } = useSelectedPiece();

  function handleRotation() {
    const id = selectedPiece?.id;
    const pieceIndex = parseInt(id?.slice(id?.indexOf('-') + 1) ?? '0', 10);
    rotatePiece(pieceIndex);
  }

  function handleHorizontalStretch() {
    if (selectedPiece && Number.isInteger(selectedPiece.height / 2)) {
      const newHeight = selectedPiece.height / 2;
      const newWidth = selectedPiece.width * 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
      console.log(pieceIndex);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  function handleVerticalStretch() {
    if (selectedPiece && Number.isInteger(selectedPiece.width / 2)) {
      const newHeight = selectedPiece.height * 2;
      const newWidth = selectedPiece.width / 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  return (
    <Popover withArrow trapFocus size="small" positioning="below">
      <PopoverTrigger {...delegated}>{children}</PopoverTrigger>
      <PopoverSurface id="actions">
        <ActionsToolbar>
          <Tooltip placement="bottom" title="Rotate">
            <IconButton onClick={handleRotation}>
              <StyledRotateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip placement="bottom" title="Double Width & Halve Height">
            <IconButton onClick={handleHorizontalStretch}>
              <Icon src="./assets/horizontalStretch.svg" />
            </IconButton>
          </Tooltip>
          <Tooltip placement="bottom" title="Halve Width & Double Height">
            <IconButton onClick={handleVerticalStretch}>
              <Icon src="./assets/verticalStretch.svg" />
            </IconButton>
          </Tooltip>
        </ActionsToolbar>
      </PopoverSurface>
    </Popover>
  );
}

export default ActionsToolbarPopover;

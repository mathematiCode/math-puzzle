/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Tooltip } from 'antd';
import { RotateRightOutlined } from '@ant-design/icons';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import { SelectedPieceContext } from '../context/SelectedPiece';
import { PiecesInPlayContext } from '../context/PiecesInPlay';

function ActionsToolbarPopover({
  children,
  ...delegated
}: {
  children: React.ReactNode;
  delegated: any;
}) {
  const { updateDimensions, rotatePiece } = useContext(PiecesInPlayContext);
  const { selectedPiece } = useContext(SelectedPieceContext);

  function handleRotation() {
    const id = selectedPiece.id;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    rotatePiece(pieceIndex);
  }

  function handleHorizontalStretch() {
    if (Number.isInteger(selectedPiece.height / 2)) {
      const newHeight = selectedPiece.height / 2;
      const newWidth = selectedPiece.width * 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
      console.log(pieceIndex);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  function handleVerticalStretch() {
    if (Number.isInteger(selectedPiece.width / 2)) {
      const newHeight = selectedPiece.height * 2;
      const newWidth = selectedPiece.width / 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  return (
    <Popover
      withArrow
      trapFocus
      size="small"
      positioning="below"
      style={{ gap: '0px' }}
    >
      <PopoverTrigger delegated={delegated}>{children}</PopoverTrigger>
      <PopoverSurface id="actions">
        <div className="actions-toolbar">
          <Tooltip placement="bottom" title="Rotate">
            <button className="icon-button" onClick={handleRotation}>
              <RotateRightOutlined
                style={{ fontSize: '32px', color: 'hsl(178, 100%, 23%)' }}
              />
            </button>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title="Double Width & Halve Height"
            style={{ width: '36px' }}
          >
            <button className="icon-button" onClick={handleHorizontalStretch}>
              <img
                src="./assets/horizontalStretch.svg"
                style={{ width: '32px' }}
              />
            </button>
          </Tooltip>
          <Tooltip placement="bottom" title="Halve Width & Double Height">
            <button className="icon-button" onClick={handleVerticalStretch}>
              <img
                src="./assets/verticalStretch.svg"
                style={{ width: '32px' }}
              />
            </button>
          </Tooltip>
        </div>
      </PopoverSurface>
    </Popover>
  );
}

export default ActionsToolbarPopover;

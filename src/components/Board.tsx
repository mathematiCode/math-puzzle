/* eslint-disable react/prop-types */
import { ForwardedRef } from 'react';
import BoardSection from './BoardSection';
import PropTypes from 'prop-types';

interface Dimensions {
  width: number;
  height: number;
}

interface BoardSection {
  x: number;
  y: number;
  width: number;
  height: number;
  valid: boolean;
}

interface BoardProps {
  dimensions: Dimensions;
  boardSections: BoardSection[];
}

const Board = forwardRef(
  (props: BoardProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { dimensions, boardSections } = props;
    const boardWidth = dimensions.width;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateRows: '1fr',
        }}
      >
        {boardSections.map((row: BoardSection[], index: number) => {
          if (row.length === 1) {
            return <BoardSection key={index} section={row[0]} />;
          } else {
            return (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateRows: '1fr',
                  gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
                  width: 'min-content',
                }}
              >
                {row.map(section: BoardSection => {
                  return (
                    <BoardSection
                      key={`${section.x},${section.y}`}
                      section={section}
                    />
                  );
                })}
              </div>
            );
          }
        })}
      </div>
    );
  }
);

export default Board;

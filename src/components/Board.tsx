import { ForwardedRef, forwardRef } from 'react';
import BoardSection from './BoardSection.tsx';
import styled from 'styled-components';

interface Dimensions {
  width: number;
  height: number;
}

interface BoardSectionData {
  x: number;
  y: number;
  width: number;
  height: number;
  valid: boolean;
}

interface BoardProps {
  dimensions: Dimensions;
  boardSections: BoardSectionData[][];
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
          gridColumn: 1 / 2,
          gridRow: 1 / 2,
        }}
      >
        {boardSections.map((row: BoardSectionData[], index: number) => {
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
                {row.map((section: BoardSectionData) => {
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

import LandingSquare from './LandingSquare';
import InvalidSquare from './InvalidSquare';
import { range } from 'lodash';
import styled from 'styled-components';
// import { useContext } from 'react';
// import { CurrentLevelContext } from '../context/CurrentLevel';

interface Section {
  x: number;
  y: number;
  width: number;
  height: number;
  valid: boolean;
}

export const ValidSection = styled.div<{ $width: number; $color: string }>`
  position: relative;
  display: grid;
  width: fit-content;
  height: min-content;
  gap: 0px;
  padding: 0px;
  touch-action: none;
  grid-template-columns: repeat(${props => props.$width}, 1fr);
  background-color: ${props => props.$color};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    box-shadow: hsl(178, 100%, 23%) 0px 0px 0px 8px,
      hsl(178, 100%, 23%) 0px 0px 0px 8px;
  }
`;

export const InvalidSection = styled.div<{ $width: number }>`
  display: grid;
  width: fit-content;
  height: min-content;
  gap: 0px;
  padding: 0px;
  touch-action: none;
  grid-template-columns: repeat(${props => props.$width}, 1fr);
`;

function BoardSection({ section }: { section: Section }) {
  const color = 'hsl(107, 100.00%, 93.70%)';
  const { width, height, x, y, valid } = section;
  if (valid) {
    return (
      <ValidSection $width={width} $color={color}>
        {range(height).map((row: number, rowIndex: number) => {
          return range(width).map((square: number, colIndex: number) => {
            return (
              <LandingSquare
                key={`(${colIndex + x},${rowIndex + y})`}
                id={`(${colIndex + x},${rowIndex + y})`}
                color={color}
              />
            );
          });
        })}
      </ValidSection>
    );
  } else {
    return (
      <InvalidSection $width={width}>
        {range(height).map((row: number, rowIndex: number) => {
          return range(width).map((square: number, colIndex: number) => {
            return (
              <InvalidSquare
                key={`(${colIndex + x},${rowIndex + y})`}
                id={`(${colIndex + x},${rowIndex + y})`}
              />
            );
          });
        })}
      </InvalidSection>
    );
  }
}

export default BoardSection;

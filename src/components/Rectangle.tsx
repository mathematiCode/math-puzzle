/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import { range } from 'lodash';
import PropTypes from 'prop-types';
import { memo, forwardRef, useContext } from 'react';
import styled from 'styled-components';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';

interface RectangleProps {
  width: number;
  height: number;
  color: string;
  isRotated?: boolean;
  isSelected?: boolean;
  style?: React.CSSProperties;
}

const Container = styled(motion.div)<{ $width: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$width}, 1fr);
  background-color: transparent;
  width: fit-content;
  height: min-content;
  gap: 0px;
  padding: 0px;
  touch-action: none;
`;

export const Unit = styled.div<{ $size?: number; $color: string }>`
  background-color: ${props => props.$color};
  width: ${props => (props.$size ? `${props.$size - 2}px` : '100%')};
  height: ${props => (props.$size ? `${props.$size - 2}px` : '100%')};
  border: 1px solid black;
  border-radius: 0px;
`;

export const MotionUnit = styled(Unit).attrs({ as: motion.div })``;

function Rectangle(
  { width, height, color, ...delegated }: RectangleProps,
  ref: React.Ref<HTMLDivElement>
) {
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  const total = width * height;

  return (
    <Container ref={ref} $width={width} {...delegated}>
      {range(total).map(unit => (
        <MotionUnit
          key={unit}
          layout={true}
          $size={sizeOfEachUnit}
          $color={color}
        />
      ))}
    </Container>
  );
}

const MemoizedForwardedRectangle = memo(forwardRef(Rectangle));
export default MemoizedForwardedRectangle;

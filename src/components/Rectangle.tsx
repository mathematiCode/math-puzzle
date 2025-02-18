/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import { range } from 'lodash';
import { memo, forwardRef } from 'react';
import styled from 'styled-components';
import { Unit, MotionUnit } from './Unit.tsx';

interface RectangleProps {
  width: number;
  height: number;
  color: string;
  isRotated?: boolean;
  isSelected?: boolean;
  isMotion?: boolean;
  style?: React.CSSProperties;
}

const Container = styled(motion.div)<{ $width: number; color: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$width}, 1fr);
  background-color: transparent;
  width: fit-content;
  height: min-content;
  gap: 0px;
  padding: 0px;
  touch-action: none;
  background-color: ${props => props.color};
`;

function Rectangle(
  { width, height, color, isMotion, ...delegated }: RectangleProps,
  ref: React.Ref<HTMLDivElement>
) {
  const total = width * height;

  return (
    <Container ref={ref} $width={width} color={color} {...delegated}>
      {range(total).map(unit =>
        isMotion ? <MotionUnit key={unit} color={color} /> : <Unit key={unit} />
      )}
    </Container>
  );
}

const MemoizedForwardedRectangle = memo(forwardRef(Rectangle));
export default MemoizedForwardedRectangle;

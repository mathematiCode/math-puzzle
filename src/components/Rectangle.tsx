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
  layout?: boolean;
  style?: React.CSSProperties;
}

// Transform3d was appearing in my styles mysteriously and messing up the layout so setting it to 0px always fixes it for now.
const Container = styled(motion.div)<{
  $width: number;
  color: string;
  isSelected?: boolean;
}>`
  transform: translate3d(0px, 0px, 0px) !important;
  display: grid;
  grid-template-columns: repeat(${props => props.$width}, 1fr);
  background-color: transparent;
  width: fit-content;
  height: min-content;
  gap: 0px;
  padding: 0px;
  touch-action: none;
  background-color: ${props => props.color};
  box-shadow: ${props =>
    props.isSelected ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px' : 'none'};
`;

function Rectangle(
  {
    width,
    height,
    color,
    isMotion,
    isSelected,
    layout,
    ...delegated
  }: RectangleProps,
  ref: React.Ref<HTMLDivElement>
) {
  const total = width * height;

  return (
    <Container
      ref={ref}
      $width={width}
      color={color}
      layout={layout}
      isSelected={isSelected}
      {...delegated}
    >
      {range(total).map(unit =>
        isMotion ? (
          <MotionUnit key={unit} color={color} layout={layout} />
        ) : (
          <Unit key={unit} />
        )
      )}
    </Container>
  );
}

const MemoizedForwardedRectangle = memo(forwardRef(Rectangle));
export default MemoizedForwardedRectangle;

/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import { range } from 'lodash';
import { memo, forwardRef } from 'react';
import styled from 'styled-components';
import { Unit, MotionUnit } from './Unit';

interface RectangleProps {
  width: number;
  height: number;
  unitSize: number;
  color: string;
  isRotated?: boolean;
  isSelected?: boolean;
  isMotion?: boolean;
  layout?: boolean;
  isExample?: boolean;
  style?: React.CSSProperties;
}

// Transform3d was appearing in my styles mysteriously and messing up the layout so setting it to 0px always fixes it for now.
const Container = styled(motion.div)<{
  $width: number;
  unitSize: number;
  color: string;
  isSelected?: boolean;
  isExample?: boolean;
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
  /* border: 3px solid rgba(0, 0, 0, 1); */
  box-shadow: rgba(0, 0, 0, 0.83) 0px 5px 10px;
`;

function Rectangle(
  {
    width,
    height,
    unitSize,
    color,
    isMotion,
    isSelected,
    layout,
    isExample,
    ...delegated
  }: RectangleProps,
  ref: React.Ref<HTMLDivElement>
) {
  const total = width * height;
  return (
    <Container
      $width={width}
      unitSize={unitSize}
      color={color}
      layout={layout}
      isSelected={isSelected}
      {...delegated}
    >
      {range(total).map(unit =>
        isMotion ? (
          <MotionUnit
            key={unit}
            color={color}
            unitSize={unitSize}
            layout={layout}
            isExample={isExample}
          />
        ) : (
          <Unit key={unit} unitSize={unitSize} isExample={isExample} />
        )
      )}
    </Container>
  );
}

const MemoizedForwardedRectangle = memo(forwardRef(Rectangle));
export default MemoizedForwardedRectangle;

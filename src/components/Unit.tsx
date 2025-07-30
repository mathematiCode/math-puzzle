// @ts-nocheck
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ComponentProps, forwardRef, useContext } from 'react';
//import { PiecesInPlayContext } from '../context/PiecesInPlay';
import { CurrentLevelContext } from '../context/CurrentLevel';

interface UnitProps extends ComponentProps<'div'> {
  color?: string;
  ref?: any;
  id?: string;
  key?: number | string;
  isExample?: boolean;
  layout?: boolean;
  unitSize?: number;
}

export const BasicUnit = styled.div<{
  $color?: string;
  $isExample?: boolean;
  $sizeOfEachUnit: number;
  layout?: boolean;
  unitSize?: number;
}>`
  width: ${props =>
    props.$isExample
      ? '30px'
      : `calc(${props.$unitSize} * var(--sizeOfEachUnit))`};
  height: ${props =>
    props.$isExample
      ? '30px'
      : `calc(${props.$unitSize} * var(--sizeOfEachUnit))`};
  border: 1px solid black;
  border-radius: 0px;
  background-color: ${props => props.$color || 'transparent'};
  @media screen and (max-width: 768px) {
    width: ${props =>
      props.$isExample
        ? '20px'
        : `calc(${props.$unitSize} * var(--sizeOfEachUnit))`};
    height: ${props =>
      props.$isExample
        ? '20px'
        : `calc(${props.$unitSize} * var(--sizeOfEachUnit))`};
  }
`;

export const Unit = forwardRef<HTMLDivElement, UnitProps>(
  ({ color, isExample, unitSize, ...delegated }, ref) => {
    const { sizeOfEachUnit } = useContext(CurrentLevelContext);
    return (
      <BasicUnit
        {...delegated}
        ref={ref}
        $color={color}
        $isExample={isExample}
        $sizeOfEachUnit={sizeOfEachUnit}
        $unitSize={unitSize}
      />
    );
  }
);

export const StyledMotionUnit = styled(BasicUnit).attrs({ as: motion.div })``;
export const MotionUnit = ({
  color,
  layout = true,
  unitSize,
  isExample,
  ref,
}: {
  color?: string;
  layout?: boolean;
  unitSize?: number;
  isExample?: boolean;
  ref?: HTMLElement;
}) => {
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  return (
    <StyledMotionUnit
      layout={layout}
      $color={color || 'transparent'}
      $isExample={isExample}
      $sizeOfEachUnit={sizeOfEachUnit}
      $unitSize={unitSize}
    />
  );
};

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
}

export const BasicUnit = styled.div<{
  $color?: string;
  $isExample?: boolean;
  $sizeOfEachUnit: number;
  layout?: boolean;
}>`
  width: ${props => (props.$isExample ? '30px' : 'var(--sizeOfEachUnit)')};
  height: ${props => (props.$isExample ? '30px' : 'var(--sizeOfEachUnit)')};
  border: 1px solid black;
  border-radius: 0px;
  background-color: ${props => props.$color || 'transparent'};

  @media screen and (max-width: 768px) {
    width: ${props => (props.$isExample ? '20px' : 'var(--sizeOfEachUnit)')};
    height: ${props => (props.$isExample ? '20px' : 'var(--sizeOfEachUnit)')};
  }
`;

export const Unit = forwardRef<HTMLDivElement, UnitProps>(
  ({ color, isExample, ...delegated }, ref) => {
    const { sizeOfEachUnit } = useContext(CurrentLevelContext);
    return (
      <BasicUnit
        {...delegated}
        ref={ref}
        $isExample={isExample}
        $sizeOfEachUnit={sizeOfEachUnit}
      />
    );
  }
);

export const StyledMotionUnit = styled(BasicUnit).attrs({ as: motion.div })``;
export const MotionUnit = ({
  color,
  layout = true,
  isExample,
  ref,
}: {
  color?: string;
  layout?: boolean;
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
    />
  );
};

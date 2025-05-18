import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ComponentProps, forwardRef } from 'react';

interface UnitProps extends ComponentProps<'div'> {
  color?: string;
  ref?: any;
  id?: string;
  key?: number | string;
  isExample?: boolean;
}

export const BasicUnit = styled.div<{ $color?: string; $isExample?: boolean }>`
  width: ${props => (props.$isExample ? '30px' : 'var(--sizeOfEachUnit)')};
  height: ${props => (props.$isExample ? '30px' : 'var(--sizeOfEachUnit)')};
  border: 1px solid black;
  border-radius: 0px;
  background-color: ${props => props.$color || 'transparent'};
`;

export const Unit = forwardRef<HTMLDivElement, UnitProps>(
  ({ color, isExample, ...delegated }, ref) => {
    return <BasicUnit {...delegated} ref={ref} $isExample={isExample} />;
  }
);

export const StyledMotionUnit = styled(BasicUnit).attrs({ as: motion.div })``;

export const MotionUnit = ({
  color,
  layout = true,
  isExample,
}: {
  color?: string;
  layout?: boolean;
  isExample?: boolean;
}) => {
  return (
    <StyledMotionUnit
      layout={layout}
      $color={color || 'transparent'}
      $isExample={isExample}
    />
  );
};

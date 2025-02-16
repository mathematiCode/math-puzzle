import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ComponentProps, forwardRef } from 'react';

interface UnitProps extends ComponentProps<'div'> {
  color?: string;
  ref?: any;
  id?: string;
  key?: string;
}

export const BasicUnit = styled.div<{ $color?: string }>`
  width: var(--sizeOfEachUnit);
  height: var(--sizeOfEachUnit);
  border: 1px solid black;
  border-radius: 0px;
  background-color: ${props => props.$color || 'transparent'};
`;

export const Unit = forwardRef<HTMLDivElement, UnitProps>(
  ({ color, ...delegated }, ref) => {
    return <BasicUnit {...delegated} ref={ref} />;
  }
);

export const StyledMotionUnit = styled(BasicUnit).attrs({ as: motion.div })``;

export const MotionUnit = ({ color }: { color?: string }) => {
  return <StyledMotionUnit layout={true} $color={color || 'transparent'} />;
};

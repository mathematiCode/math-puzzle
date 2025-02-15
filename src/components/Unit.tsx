import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ComponentProps, forwardRef, useContext } from 'react';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';

interface UnitProps extends ComponentProps<'div'> {
  color?: string;
  ref?: any;
  id?: string;
}

const Unit = forwardRef<HTMLDivElement, UnitProps>(
  ({ color, ...delegated }, ref) => {
    const { sizeOfEachUnit } = useContext(CurrentLevelContext);
    const size = sizeOfEachUnit;
    return <BasicUnit {...delegated} $size={size} ref={ref} />;
  }
);

export default Unit;

export const BasicUnit = styled.div<{ $size: number; $color?: string }>`
  width: ${props => `${props.$size}px`};
  height: ${props => `${props.$size}px`};
  border: 1px solid black;
  border-radius: 0px;
  background-color: ${props => props.$color || 'transparent'};
`;

export const StyledMotionUnit = styled(BasicUnit).attrs({ as: motion.div })``;

export function MotionUnit({ color }: { size: number; color?: string }) {
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  const size = sizeOfEachUnit;
  return <StyledMotionUnit $size={size} $color={color || 'transparent'} />;
}

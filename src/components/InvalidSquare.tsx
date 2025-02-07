import { useContext } from 'react';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';

function LandingSquare({ id }: { id: string }) {
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  return (
    <div
      className="unit"
      key={id}
      id={id}
      style={{
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        width: `${sizeOfEachUnit - 2}px`,
        height: `${sizeOfEachUnit - 2}px`,
      }}
    />
  );
}

export default LandingSquare;

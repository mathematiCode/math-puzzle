import { useContext } from 'react';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';
import { Unit } from './Unit.tsx';

function InvalidSquare({ id }: { id: string }) {
  return (
    <Unit
      key={id}
      id={id}
      color="transparent"
      style={{ border: '1px solid transparent' }}
    />
  );
}

export default InvalidSquare;

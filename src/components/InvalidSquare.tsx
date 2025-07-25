import { Unit } from './Unit';

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

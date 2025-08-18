import { Unit } from '../../Game/Unit';

function InvalidSquare({ id }: { id: string }) {
  return (
    <Unit
      key={id}
      id={id}
      color="transparent"
      style={{ border: '1px solid transparent' }}
      unitSize={1}
    />
  );
}

export default InvalidSquare;

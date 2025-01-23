import PropTypes from 'prop-types';
import { useContext } from 'react';
import { CurrentLevelContext } from '../context/CurrentLevel';

function LandingSquare({ id }) {
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  return (
    <div
      className="unit"
      key={id}
      id={id}
      style={{
        backgroundColor: '#d6f1c8',
        border: '1px solid #d6f1c8',
        width: `${sizeOfEachUnit - 2}px`,
        height: `${sizeOfEachUnit - 2}px`,
      }}
    />
  );
}

LandingSquare.propTypes = {
  id: PropTypes.string.isRequired,
};
export default LandingSquare;

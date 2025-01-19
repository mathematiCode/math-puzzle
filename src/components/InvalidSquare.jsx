import PropTypes from 'prop-types';

function LandingSquare({ id }) {
  return (
    <div
      className="unit"
      key={id}
      style={{
        backgroundColor: '#d6f1c8',
        border: '1px solid #d6f1c8',
      }}
    />
  );
}

LandingSquare.propTypes = {
  id: PropTypes.string.isRequired,
};
export default LandingSquare;

import AntModal from '../components/AntModal';
import styled from 'styled-components';

const LevelCompleteModal = ({
  level,
  completed,
  levelCompletedShown,
  onClose,
}: {
  level: number;
  completed: boolean;
  levelCompletedShown: boolean;
  onClose: () => void; // Deleting  this makes it impossible to close.
}) => {
  return (
    <AntModal
      open={completed && !levelCompletedShown}
      title={`Level ${level} Complete!`}
      onClose={onClose}
    >
      <StyledImage src={`/assets/foxes.svg`} alt={`Two foxes cheering`} />
    </AntModal>
  );
};

export default LevelCompleteModal;

const StyledImage = styled.img`
  margin-inline: auto;
  margin-block: auto;
`;

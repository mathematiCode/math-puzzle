import Modal from '../components/Modal';
import styled from 'styled-components';

const LevelCompleteModal = ({
  level,
  completed,
  onClose,
  levelCompletedShown,
}: {
  level: number;
  completed: boolean;
  onClose: () => void;
  levelCompletedShown: boolean;
}) => {
  return (
    <Modal
      open={completed && !levelCompletedShown}
      onClose={onClose}
      title={`Level ${level} Complete!`}
      centerContent={true}
    >
      <StyledImage src={`/assets/foxes.svg`} alt={`Two foxes cheering`} />
    </Modal>
  );
};

export default LevelCompleteModal;

const StyledImage = styled.img`
  margin-inline: auto;
  margin-block: auto;
`;

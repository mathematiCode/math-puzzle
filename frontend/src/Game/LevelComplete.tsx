import AntModal from '../components/AntModal';
import styled from 'styled-components';
// import { useLevelCompletion } from '../hooks/useLevelCompletion';

const LevelCompleteModal = ({
  level,
  completed,
  levelCompletedShown,
  onClose,
}: {
  level: number;
  completed: boolean;
  levelCompletedShown: boolean;
  onClose: () => void;
}) => {
  // const { handleLevelCheck } = useLevelCompletion();
  // const completed = handleLevelCheck();
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

import { useContext, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import styled from 'styled-components';
import Button from '../../components/Button';
import SamplePiece from './SamplePiece';
import { PiecesInPlayContext } from '../../context/PiecesInPlay';
import MathematicalToolsRow from './MathematicalToolsRow';
import ErrorBoundary from '../../components/ErrorBoundary';
import AntModal from '../../components/AntModal';
import { Piece } from '../../types/piece';

const StyledDiv = styled.div`
  padding: '20px';
  width: '90px';
  margin-bottom: '90px';
  margin-inline: '0px';

  @media screen and (max-width: 768px) {
    margin-bottom: '90px';
  }
`;

const StyledH2 = styled.h2`
  font-size: 1.1rem;
  margin-top: 15px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const StyledLi = styled.li`
  font-size: 1rem;

  @media screen and (max-width: 768px) {
    font-size: 0.9rem;
  }
`;
const StyledParagraph = styled.p`
  font-size: 1rem;

  @media screen and (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const InstructionsModal = ({
  isRotating,
  setIsRotating,
  piecesInPlay,
  setActivePiece,
}: {
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  piecesInPlay: Piece[];
  setActivePiece: (piece: Piece) => void;
}) => {
  const context = useContext(PiecesInPlayContext);
  if (!context) {
    throw new Error(
      'InstructionsModal must be used within a PiecesInPlayProvider'
    );
  }
  const { updateDimensions } = context;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    updateDimensions('sample-0', 3, 2); // Resetting the example piece to it's original dimensions
  };

  return (
    <>
      <Button
        color="hsl(38, 87%, 70%)"
        textColor="black"
        onClick={() => setIsModalOpen(true)}
      >
        <HelpCircle /> How to Play
      </Button>
      <AntModal
        open={isModalOpen}
        onClose={closeModal}
        title="How to Play"
        titleSize="small"
      >
        <div>
          <StyledH2>The Goal</StyledH2>
          <StyledParagraph>
            Fill the board with pieces so that it's completely covered with no
            overlapping pieces. All pieces will be used.
          </StyledParagraph>
          <StyledH2>The Rules</StyledH2>
          <ul>
            <StyledLi>Puzzle pieces cannot overlap.</StyledLi>
            <StyledLi>Puzzle pieces must be fully on the board.</StyledLi>
            <StyledLi>
              You can use any of the tools below to transform the pieces as
              needed.
            </StyledLi>
            <StyledLi>
              Fractional side lengths are not supported so sometimes the tools
              will be disabled if halving is not possible.
            </StyledLi>
          </ul>

          <StyledH2>The Tools</StyledH2>
          <MathematicalToolsRow />
          <StyledParagraph>
            Although some tools are not available yet, it is still possible to
            pass all levels. Most if not all of them have several different
            solutions.
          </StyledParagraph>
          <StyledH2>Try out the tools by clicking the piece below. </StyledH2>
          <StyledDiv>
            <ErrorBoundary>
              <SamplePiece
                piece={piecesInPlay[0]}
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                setActivePiece={setActivePiece}
              />
            </ErrorBoundary>
          </StyledDiv>
        </div>
      </AntModal>
    </>
  );
};

export default InstructionsModal;

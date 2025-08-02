// @ts-nocheck
import { useState, useContext } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  makeStyles,
} from '@fluentui/react-components';
import { X, HelpCircle } from 'lucide-react';
import { RemoveScroll } from 'react-remove-scroll';
import styled from 'styled-components';
import Button from './Button.tsx';
import InitialPuzzlePiece from './InitialPuzzlePiece.tsx';
import { PiecesInPlayContext } from '../context/PiecesInPlay.tsx';
import AnimatedLottieIcon from './AnimatedLottieIcon.js';
import rotateToolAnimation from '../assets/icons-animation/rotate-tool.json';
import horizontalStretchAnimation from '../assets/icons-animation/horizontal-stretch-tool.json';
import verticalStretchAnimation from '../assets/icons-animation/vertical-stretch-tool.json';
import cutAnimation from '../assets/icons-animation/cut-tool.json';
import combineAnimation from '../assets/icons-animation/combine-tool.json';
import MathematicalTools from './MathematicalTools.js';

// Instructions on how to use Griffel/ makeStyles here: https://learn.microsoft.com/en-us/shows/fluent-ui-insights/fluent-ui-trainings-styling-components-theming#time=20m55s
const useClasses = makeStyles({
  Surface: {
    backgroundColor: 'hsl(100, 65%, 89%)',
    color: 'black',
    width: '70%',
    paddingBottom: '3px',
    paddingInline: '20px',
    position: 'fixed',
    borderRadius: '10px',
    border: '1px solid hsl(0, 0.00%, 0.00%)',
    boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.7) !important',
    inline: 0,
    marginTop: '30px',
    zIndex: 1,
    fontSize: '1.2rem',
    fontWeight: 600,

    '@media screen and (max-width: 768px)': {
      width: '96%',
      marginTop: '5px',
      paddingInline: '10px',
      fontSize: '0.9rem',
      paddingBottom: '50px',
    },
  },
  Overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0, // Ensure it's behind the dialog
  },
  Title: {
    fontSize: '1.4rem',
    marginBottom: '-10px',
    alignContent: 'center',
    textAlign: 'center',

    '@media screen and (max-width: 768px)': {
      fontSize: '1.1rem',
    },
  },
  div: {
    padding: '20px',
    width: '90px',
  },
  X: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    color: 'black',
    cursor: 'pointer',
  },
});

// Styled-components for h2 and li
const StyledH2 = styled.h2`
  font-size: 1.1rem;
  margin-top: 15px;

  @media screen and (max-width: 768px) {
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
  const classes = useClasses();
  const context = useContext(PiecesInPlayContext);
  if (!context) {
    throw new Error(
      'InstructionsModal must be used within a PiecesInPlayProvider'
    );
  }
  const { updateDimensions } = context;

  const closeModal = () => {
    updateDimensions(0, 3, 2); // Resetting the example piece to it's original dimensions
  };

  return (
    <Dialog modalType="modal" onOpenChange={closeModal}>
      <DialogTrigger disableButtonEnhancement>
        <Button color="hsl(38, 87%, 70%)" textColor="black">
          <HelpCircle /> How to Play
        </Button>
      </DialogTrigger>
      <RemoveScroll enabled={true}>
        <DialogSurface className={classes.Surface}>
          <DialogBody>
            <DialogTitle className={classes.Title}>How to Play</DialogTitle>
            <DialogTrigger disableButtonEnhancement>
              <X className={classes.X} />
            </DialogTrigger>
            <DialogContent>
              <div>
                <StyledH2>The Goal</StyledH2>
                <StyledParagraph>
                  Fill the board with pieces so that it's completely covered
                  with no overlapping pieces. All pieces will be used.
                </StyledParagraph>
                <StyledH2>The Rules</StyledH2>
                <ul>
                  <StyledLi>Puzzle pieces cannot overlap.</StyledLi>
                  <StyledLi>Puzzle pieces must be fully on the board.</StyledLi>
                  <StyledLi>
                    You can use any of the tools below to transform the pieces
                    as needed.
                  </StyledLi>
                  <StyledLi>
                    Fractional side lengths are not supported so sometimes the
                    tools will be disabled if halving is not possible.
                  </StyledLi>
                </ul>

                <StyledH2>The Tools</StyledH2>
                <MathematicalTools variant="embedded" />
                <StyledParagraph>
                  Although some tools are not available yet, it is still
                  possible to pass all levels. Most if not all of them have
                  several different solutions.
                </StyledParagraph>
                <StyledH2>
                  Try out the tools by clicking the piece below.{' '}
                </StyledH2>
                <div className={classes.div}>
                  <InitialPuzzlePiece
                    piece={piecesInPlay[0]}
                    isRotating={isRotating}
                    setIsRotating={setIsRotating}
                    setActivePiece={setActivePiece}
                    isExample={true}
                  />
                </div>
              </div>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </RemoveScroll>
    </Dialog>
  );
};

export default InstructionsModal;

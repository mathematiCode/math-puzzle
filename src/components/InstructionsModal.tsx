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
import { X } from 'lucide-react';
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
    marginTop: '50px',
    zIndex: 1,
    fontSize: '1.2rem',
    fontWeight: 600,

    '@media screen and (max-width: 768px)': {
      width: '96%',
      marginTop: '20px',
      paddingInline: '10px',
      fontSize: '0.9rem',
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
    fontSize: '1.6rem',

    '@media screen and (max-width: 768px)': {
      fontSize: '1.3rem',
    },
  },
  h2: {
    fontSize: '1.4rem',
    marginTop: '15px',

    '@media screen and (max-width: 768px)': {
      fontSize: '1.1rem',
    },
  },
  div: {
    padding: '30px',
    width: '90px',
  },
  X: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    color: 'black',
    cursor: 'pointer',
  },
  li: {
    '@media screen and (max-width: 768px)': {
      marginLeft: '-20px',
    },
  },
});

const InstructionsModal = ({
  isRotating,
  setIsRotating,
  piecesInPlay,
}: {
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  piecesInPlay: Piece[];
}) => {
  const classes = useClasses();
  const [instructionsShown, setInstructionsShown] = useState(false);
  const context = useContext(PiecesInPlayContext);
  if (!context) {
    throw new Error(
      'InstructionsModal must be used within a PiecesInPlayProvider'
    );
  }
  const { updateDimensions } = context;

  const closeModal = () => {
    updateDimensions(0, 3, 2); // Resetting the example piece to it's original dimensions
    setInstructionsShown(false);
  };

  return (
    <Dialog modalType="modal" onOpenChange={closeModal}>
      <DialogTrigger disableButtonEnhancement>
        <Button>How to Play</Button>
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
                <h2 className={classes.h2}>The Goal</h2>
                <p>
                  Fill the board with pieces so that it's completely covered.
                </p>

                <h2 className={classes.h2}>The Rules</h2>
                <ul>
                  <li>Puzzle pieces cannot overlap.</li>
                  <li>Puzzle pieces must be fully on the board.</li>
                  <li>
                    You can use any of the tools below to transform the pieces
                    as needed.
                  </li>
                </ul>

                <h2 className={classes.h2}>The Tools</h2>
                {/* <ul>
                  <li>
                    Rotate{' '}
                    <AnimatedLottieIcon
                      animationData={rotateToolAnimation}
                      size={35}
                    />
                  </li>
                  <li>Double the width and halve the height</li>
                  <li>Double the height and halve the width</li>
                  <li>Break one piece into two (coming soon!)</li>
                  <li>Merge two pieces into one (coming soon!)</li>
                </ul> */}
                <MathematicalTools variant="embedded" />
                <h2 className={classes.h2}>Try clicking the piece below. </h2>
                <div className={classes.div}>
                  <InitialPuzzlePiece
                    piece={piecesInPlay[0]}
                    isRotating={isRotating}
                    setIsRotating={setIsRotating}
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

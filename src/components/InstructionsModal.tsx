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
import styled from 'styled-components';
import Button from './Button.tsx';
import InitialPuzzlePiece from './InitialPuzzlePiece.tsx';
import { PiecesInPlayContext } from '../context/PiecesInPlay.tsx';
import { X } from 'lucide-react';

// Instructions on how to use Griffel/ makeStyles here: https://learn.microsoft.com/en-us/shows/fluent-ui-insights/fluent-ui-trainings-styling-components-theming#time=20m55s
const useClasses = makeStyles({
  Surface: {
    backgroundColor: '#007571',
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
      width: '90%',
    },
  },
  Title: {
    fontSize: '1.7rem',
  },
  h2: {
    fontSize: '1.4rem',
    marginTop: '15px',
  },
  div: {
    padding: '30px',
    width: '90px',
  },
  X: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    color: 'white',
    cursor: 'pointer',
  },
});

const InstructionsModal = ({
  isRotating,
  setIsRotating,
  piecesInPlay,
}: {
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
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
      <DialogSurface className={classes.Surface}>
        <DialogBody>
          <DialogTitle className={classes.Title}>How to Play</DialogTitle>
          <X className={classes.X} onClick={closeModal} />
          <DialogContent>
            <div>
              <h2 className={classes.h2}>The Goal</h2>
              <p>Fill the board with pieces so that it's completely covered.</p>

              <h2 className={classes.h2}>The Rules</h2>
              <ul>
                <li>Puzzle pieces cannot overlap.</li>
                <li>Puzzle pieces must be fully on the board.</li>
              </ul>

              <h2 className={classes.h2}>The Tools</h2>
              <ul>
                <li>Rotate</li>
                <li>Double the width and halve the height</li>
                <li>Double the height and halve the width</li>
                <li>Break one piece into two (coming soon!)</li>
                <li>Merge two pieces into one (coming soon!)</li>
              </ul>
              <h2 className={classes.h2}>Try clicking the piece below. </h2>
              <div className={classes.div}>
                <InitialPuzzlePiece
                  piece={piecesInPlay[0]}
                  isRotating={isRotating}
                  setIsRotating={setIsRotating}
                />
              </div>
            </div>
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default InstructionsModal;

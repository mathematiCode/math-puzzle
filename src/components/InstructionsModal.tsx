// @ts-nocheck
import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  makeStyles
} from "@fluentui/react-components";
import styled from 'styled-components';
import Button from './Button.tsx';
import InitialPuzzlePiece from './InitialPuzzlePiece.tsx';

const useClasses = makeStyles({
  Surface: {
    backgroundColor: '#007571',
    width: '70%',
    paddingBottom: '100px',
    paddingInline: '20px',
    position: 'fixed',
    borderRadius: '10px',
    inline: 0,
    marginTop: '50px',
    zIndex: 1,
    fontSize: '1.2rem',
    fontWeight: 600,

    '@media screen and (max-width: 768px)': {
      width: '90%'
    }
  },
  Title: {
    fontSize: '1.8rem'
  },
  h2: {
    fontSize: '1.5rem',
    marginTop: '15px'
  },
  div: {
    padding: '30px',
    width: '90px'
 }
})


const InstructionsModal = ({ isRotating, setIsRotating }: { isRotating: boolean, setIsRotating: (isRotating: boolean) => void }) => {
  const classes = useClasses();
  const [instructionsShown, setInstructionsShown] = useState(false);
  const closeModal = () => {
    setInstructionsShown(false);
  }
  
  return (
    <Dialog modalType="non-modal">
      <DialogTrigger disableButtonEnhancement>
        <Button>How to Play</Button>
      </DialogTrigger>
      <DialogSurface className={classes.Surface}>
        <DialogBody>
          <DialogTitle className={classes.Title}>How to Play</DialogTitle>
          <DialogContent>
            <div>
              <h2 className={classes.h2}>The Goal</h2>
              <p>Fill the board with pieces so that it's completely covered.</p>
              
              <h2 className={classes.h2} >The Rules</h2>
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
                <div className={classes.div}>
                <InitialPuzzlePiece piece={{
                  width: 3,
                  height: 2,
                  id: 'samplePiece-1000',
                  location: null,
                  isRotated: false,
                  color: 'hsl(0, 61%, 66%)'
                }}
                isRotating={isRotating}
                setIsRotating={setIsRotating} />  
                </div>                     
            </div>
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default InstructionsModal;

// @ts-nocheck
import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
} from "@fluentui/react-components";
import Button from './Button.tsx';
import InitialPuzzlePiece from './InitialPuzzlePiece.tsx';
const InstructionsModal = () => {
  const [instructionsShown, setInstructionsShown] = useState(false);
  const closeModal = () => {
    setInstructionsShown(false);
  }
  
  return (
    <Dialog modalType="non-modal">
      <DialogTrigger disableButtonEnhancement style={{ zIndex: 2, fillColor: 'black' }}>
        <Button>How to Play</Button>
      </DialogTrigger>
      <DialogSurface style={{ 
        backgroundColor: 'hsl(178, 100%, 23%)', 
        width: '70%', 
        paddingBottom: '100px',
        paddingInline: '20px',
        position: 'fixed', 
        borderRadius: '10px', 
        inline: 0, 
        marginTop: '50px', 
        zIndex: 1, 
        fontSize: '1.2rem', 
        fontWeight: 600 
      }}>
        <DialogBody>
          <DialogTitle style={{ fontSize: '1.8rem' }}>How to Play</DialogTitle>
          <DialogContent style={{ zIndex: 2 }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginTop: '15px' }}>The Goal</h2>
              <p>Fill the board with pieces so that it's completely covered.</p>
              
              <h2 style={{ fontSize: '1.5rem',  marginTop: '15px' }}>The Rules</h2>
              <ul>
                <li>Puzzle pieces cannot overlap.</li>
                <li>Puzzle pieces must be fully on the board.</li>
              </ul>
              
              <h2 style={{ fontSize: '1.5rem',  marginTop: '15px' }}>The Tools</h2>
              <ul>
                <li>Rotate</li>
                <li>Double the width and halve the height</li>
                <li>Double the height and halve the width</li>
                <li>Break one piece into two (coming soon!)</li>
                <li>Merge two pieces into one (coming soon!)</li>
              </ul>
                <div style={{ padding: '30px', width: '90px'}}>
                <InitialPuzzlePiece piece={{
                  width: 3,
                  height: 2,
                  id: 'samplePiece',
                  location: null,
                  isRotated: false,
                  color: 'hsl(0, 61%, 66%)'
                                     }} />  
                </div>                     
            </div>
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default InstructionsModal;

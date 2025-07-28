// @ts-nocheck
import { useContext } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  DialogBody,
  makeStyles,
  Button,
} from '@fluentui/react-components';
import { X } from 'lucide-react';
import { RemoveScroll } from 'react-remove-scroll';

const useClasses = makeStyles({
  Surface: {
    backgroundColor: 'hsl(100, 65%, 89%)',
    color: 'black',
    width: '70%',
    height: 'fit-content',
    paddingBottom: '0px',
    paddingInline: '20px',
    position: 'fixed',
    borderRadius: '10px',
    border: '1px solid hsl(0, 0.00%, 0.00%)',
    boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.7) !important',
    marginInline: 'auto',
    marginBlock: 'auto',
    zIndex: 1,
    fontSize: '1.2rem',
    fontWeight: 600,

    '@media screen and (max-width: 768px)': {
      width: '96%',
      marginBlock: 'auto',
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
    fontSize: '2rem',
    marginBottom: '-10px',
    alignContent: 'center',
    textAlign: 'center',

    '@media screen and (max-width: 768px)': {
      fontSize: '1.2rem',
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
  Foxes: {
    marginInline: 'auto',
    marginBlock: 'auto',
  },
  DialogBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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
  const classes = useClasses();

  return (
    <Dialog
      modalType="modal"
      open={completed && !levelCompletedShown}
      onOpenChange={onClose}
    >
      <RemoveScroll enabled={true}>
        <DialogSurface className={classes.Surface}>
          <DialogBody className={classes.DialogBody}>
            <DialogTitle className={classes.Title}>
              Level {level} Complete!
            </DialogTitle>
            <img
              src={`/assets/foxes.png`}
              alt={`Two foxes cheering`}
              className={classes.Foxes}
            />
            <Button
              appearance="transparent"
              icon={<X />}
              onClick={onClose}
              className={classes.X}
              aria-label="Close dialog"
            />
          </DialogBody>
        </DialogSurface>
      </RemoveScroll>
    </Dialog>
  );
};

export default LevelCompleteModal;

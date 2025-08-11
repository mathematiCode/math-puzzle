import React, { ReactNode } from 'react';
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
    fontSize: '1.4rem',
    marginBottom: '-10px',
    alignContent: 'center',
    textAlign: 'center',

    '@media screen and (max-width: 768px)': {
      fontSize: '1.1rem',
    },
  },
  X: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    color: 'black',
    cursor: 'pointer',
  },
  DialogBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Image: {
    marginInline: 'auto',
    marginBlock: 'auto',
  },
});

const StyledTitle = styled(DialogTitle)`
  font-size: 2rem;
  margin-bottom: -10px;
  align-content: center;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

interface ModalProps {
  trigger?: React.ReactElement;
  open?: boolean;
  title?: string;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  modalType?: 'modal' | 'non-modal' | 'alert';
  showCloseButton?: boolean;
  centerContent?: boolean;
}

function Modal({
  trigger,
  open,
  title,
  children,
  onOpenChange,
  onClose,
  modalType = 'modal',
  showCloseButton = true,
  centerContent = false,
}: ModalProps) {
  const classes = useClasses();

  const handleOpenChange = (event: any, data: { open: boolean }) => {
    if (onOpenChange) {
      onOpenChange(data.open);
    }
    if (!data.open && onClose) {
      onClose();
    }
  };

  const dialogBodyStyle = centerContent ? classes.DialogBody : undefined;

  const dialogContent = (
    <RemoveScroll enabled={true}>
      <DialogSurface className={classes.Surface}>
        <DialogBody className={dialogBodyStyle}>
          {title && <StyledTitle>{title}</StyledTitle>}
          {showCloseButton && (
            <DialogTrigger disableButtonEnhancement>
              <X className={classes.X} />
            </DialogTrigger>
          )}
          <DialogContent>{children}</DialogContent>
        </DialogBody>
      </DialogSurface>
    </RemoveScroll>
  );

  return (
    <Dialog modalType={modalType} open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger disableButtonEnhancement>{trigger}</DialogTrigger>
      )}
      {dialogContent}
    </Dialog>
  );
}

export default Modal;

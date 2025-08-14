import { ReactNode } from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledModal = styled(Modal)<{ titleSize: 'large' | 'small' }>`
  .ant-modal-content {
    background-color: hsl(100, 65%, 89%);
    border-radius: 10px;
    border: 1px solid hsl(0, 0%, 0%);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.7);
    max-width: 700px;
    margin: 0 auto;

    @media screen and (max-width: 768px) {
      max-width: 96%;
    }
  }

  .ant-modal-header {
    background-color: hsl(100, 65%, 89%);
    border-radius: 10px 10px 0 0;
  }

  .ant-modal-title {
    font-size: ${props => (props.titleSize === 'large' ? '2rem' : '1.5rem')};
    font-weight: 600;
    text-align: center;
    color: black;
  }

  .ant-modal-body {
    font-size: 1.2rem;
    font-weight: 600;
    color: black;
    padding: 20px;
  }

  .ant-modal-footer {
    background-color: hsl(100, 65%, 89%);
    border-radius: 0 0 10px 10px;
  }

  .ant-btn {
    border: 1px solid hsl(0, 0%, 0%);
    border-radius: 5px;
    font-weight: 600;
  }

  .ant-btn-primary {
    background-color: hsl(178, 100%, 23%);
    border-color: hsl(178, 100%, 23%);
  }

  .ant-btn-primary:hover {
    background-color: hsl(178, 100%, 33%);
    border-color: hsl(178, 100%, 33%);
  }

  .ant-modal-close {
    color: black;
    font-size: 16px;
  }

  .ant-modal-close:hover {
    color: hsl(0, 0%, 30%);
  }

  @media screen and (max-width: 768px) {
    .ant-modal {
      width: 96% !important;
      margin: 0 auto;
    }

    .ant-modal-title {
      font-size: 1.1rem;
    }

    .ant-modal-body {
      font-size: 0.9rem;
      padding: 15px;
    }
  }
`;

interface AntModalProps {
  open?: boolean;
  title?: string;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  showFooter?: boolean;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  width?: number | string;
  centered?: boolean;
  closable?: boolean;
  destroyOnHidden?: boolean;
  titleSize?: 'large' | 'small';
}

function AntModal({
  open = false,
  title,
  children,
  onOpenChange,
  onClose,
  titleSize = 'large',
  showCloseButton = true,
  showFooter = false,
  okText = 'OK',
  cancelText = 'Cancel',
  onOk,
  onCancel,
  width = 'auto',
  centered = true,
  closable = true,
  destroyOnHidden = false,
}: AntModalProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    } else if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleOk = () => {
    if (onOk) {
      onOk();
    } else {
      handleCancel();
    }
  };

  const footer = showFooter ? (
    <div>
      <Button onClick={handleCancel}>{cancelText}</Button>
      <Button type="primary" onClick={handleOk}>
        {okText}
      </Button>
    </div>
  ) : null;

  return (
    <StyledModal
      open={open}
      title={title}
      titleSize={titleSize}
      onCancel={handleCancel}
      onOk={handleOk}
      footer={null}
      width={width}
      centered={centered}
      closable={closable && showCloseButton}
      maskClosable={true}
      keyboard={true}
      closeIcon={<CloseOutlined />}
      destroyOnHidden={destroyOnHidden}
    >
      {children}
    </StyledModal>
  );
}

export default AntModal;

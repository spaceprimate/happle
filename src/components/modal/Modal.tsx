import React from 'react';
import './Modal.css';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className='modal-overlay'>
      <div
        className='modal-content'
        
      >
        <button
          onClick={onClose}
          className='modal-close-button'
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
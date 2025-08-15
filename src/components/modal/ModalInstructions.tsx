import React from 'react';

function setPermanentCookie(name: string, value: string) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 10); // 10 years
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

interface ModalInstructionsProps {
  onConfirm?: () => void;
}

const ModalInstructions: React.FC<ModalInstructionsProps> = ({ onConfirm }) => {
  const confirmInstructions = () => {
    setPermanentCookie('confirmedInstructions', 'true');
    if (onConfirm) onConfirm();
  };

  return (
    <div >
      <p>Click 2 words (or drag and drop) to swap the last half of each word. <br />Find the hidden quote to win!</p>
      <button onClick={confirmInstructions}>Got it</button>
    </div>
  );
};

export default ModalInstructions;
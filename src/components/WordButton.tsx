import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'WORD_HALF';

interface WordHalfProps {
  word: { first: string; second: string; original: string };
  index: number;
  onWordDragged: (dragIndex: number, hoverIndex: number) => void;
  onButtonClick: (index: number) => void;
  isSelected: boolean;
}

// onWordDragged will accept the wordButton function, which handles the updates
const WordButton: React.FC<WordHalfProps> = ({ word, index, onWordDragged, onButtonClick, isSelected }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        onWordDragged(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent background click handler
    onButtonClick(index);
  };

  return (
    <button
      ref={(node) => drag(drop(node))}
      className={`word-button word-button-split ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-over' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className='left'>{word.first}</div>
      <div className='right'>
        {word.second !== '' ? word.second : '\u00A0'}
      </div>
    </button>
  );
};

export default WordButton;

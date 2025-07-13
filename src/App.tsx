import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Generate from './Generate';



const Happle: React.FC = () => {




  const sentence = 'placeholder for now'
  const [happleWords, setHappleWords] = useState<string[]>([]);

  const generateHappleWords = (inputSentence: string): string[] => {
    // Split sentence into words and filter out empty strings
    const words = inputSentence.trim().split(/\s+/).filter(word => word.length > 0);

    if (words.length < 2) {
      return words; // Return original if less than 2 words
    }

    // Split each word in half
    const wordHalves: { firstHalf: string; secondHalf: string }[] = words.map(word => {
      const midPoint = Math.floor(word.length / 2);
      return {
        firstHalf: word.slice(0, midPoint),
        secondHalf: word.slice(midPoint)
      };
    });

    // Create arrays of first and second halves
    const firstHalves = wordHalves.map(w => w.firstHalf);
    const secondHalves = wordHalves.map(w => w.secondHalf);

    // Shuffle the second halves
    const shuffledSecondHalves = [...secondHalves];
    for (let i = shuffledSecondHalves.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSecondHalves[i], shuffledSecondHalves[j]] = [shuffledSecondHalves[j], shuffledSecondHalves[i]];
    }

    // Combine first halves with shuffled second halves
    const newWords = firstHalves.map((firstHalf, index) => firstHalf + shuffledSecondHalves[index]);

    return newWords;
  };

  const handleGenerateWords = () => {
    const newWords = generateHappleWords(sentence);
    setHappleWords(newWords);
  };

  const handleWordClick = (word: string, index: number) => {
    console.log(`Clicked word ${index + 1}: ${word}`);
    // Add any additional functionality for word clicks here
  };

  return (
    <div className="happle-container">
      <h2>Happle Word Game</h2>
      <div className="sentence-display">
        <strong>Original Sentence:</strong> "{sentence}"
      </div>

      <button
        className="generate-button"
        onClick={handleGenerateWords}
        disabled={!sentence.trim()}
      >
        Generate Happle Words
      </button>

      {happleWords.length > 0 && (
        <div className="happle-words">
          <h3>Happle Words:</h3>
          <div className="word-buttons">
            {happleWords.map((word, index) => (
              <button
                key={index}
                className="word-button"
                onClick={() => handleWordClick(word, index)}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [words, setWords] = useState([
    { first: 'I', second: 'u', original: 'f' },
    { first: 'yo', second: 't', original: 'u' },
    { first: 'can', second: 'e', original: 't' },
    { first: 'b', second: 'f', original: 'e' },
    { first: 'kin', second: 'e', original: 'd,' },
    { first: 'a', second: 'ue', original: 't' },
    { first: 'lea', second: 't', original: 'st' },
    { first: 'b', second: 'st', original: 'e' },
    { first: 'vag', second: 'd,', original: 'ue' }
  ]);

  // Touch drag state
  const [touchDragIndex, setTouchDragIndex] = useState<number | null>(null);
  const [dragElement, setDragElement] = useState<HTMLElement | null>(null);

  // Helper function to safely remove drag element
  const removeDragElement = useCallback(() => {
    if (dragElement && dragElement.parentNode) {
      try {
        document.body.removeChild(dragElement);
      } catch (error) {
        // Element might already be removed, ignore the error
        console.warn('Drag element removal error:', error);
      }
    }
    setDragElement(null);
    document.body.classList.remove('touch-dragging');
  }, [dragElement]);

  // Cleanup effect for drag element
  useEffect(() => {
    return () => {
      // Cleanup drag element if component unmounts during drag
      if (dragElement) {
        removeDragElement();
      }
    };
  }, [dragElement, removeDragElement]);

  const wordDragged = (button1Index: number, button2Index: number) => {
    console.log(`Dragged from button ${button1Index + 1} to button ${button2Index + 1}`);
    
    // Swap the second halves of the two buttons
    const newWords = [...words];
    const temp = newWords[button1Index].second;
    newWords[button1Index].second = newWords[button2Index].second;
    newWords[button2Index].second = temp;
    setWords(newWords);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      wordDragged(dragIndex, dropIndex);
    }
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    // Prevent multiple drag operations
    if (touchDragIndex !== null || dragElement) {
      return;
    }
    
    setTouchDragIndex(index);
    
    // Prevent scrolling during drag by adding CSS class
    document.body.classList.add('touch-dragging');
    
    // Create floating drag element
    const originalElement = e.target as HTMLElement;
    const rect = originalElement.getBoundingClientRect();
    
    // Create a clone of the element for dragging
    const dragClone = originalElement.cloneNode(true) as HTMLElement;
    dragClone.className = 'touch-drag-element';
    dragClone.style.top = `${rect.top}px`;
    dragClone.style.left = `${rect.left}px`;
    dragClone.style.width = `${rect.width}px`;
    dragClone.style.height = `${rect.height}px`;
    // dragClone.style.border = '8px solid #5fa8d360';
    
    document.body.appendChild(dragClone);
    setDragElement(dragClone);
    
    // Add visual feedback to original element
    originalElement.setAttribute('data-dragging', 'true');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchDragIndex === null || !dragElement) return;
    
    const touch = e.touches[0];
    
    // Update drag element position
    const newX = touch.clientX - dragElement.offsetWidth / 2;
    const newY = touch.clientY - dragElement.offsetHeight / 2;
    
    dragElement.style.left = `${newX}px`;
    dragElement.style.top = `${newY}px`;

    console.log('Touch move at:', touch.clientX, touch.clientY);
    
    // Reset all button states
    document.querySelectorAll('.word-button-split').forEach(button => {
      button.removeAttribute('data-drag-over');
    });
    
    // Find the button element we're hovering over
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    let targetButton = elementBelow;
    while (targetButton && !targetButton.classList.contains('word-button-split')) {
      targetButton = targetButton.parentElement;
    }
    
    if (targetButton && targetButton !== e.currentTarget) {
      targetButton.setAttribute('data-drag-over', 'true');
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Only proceed if there's an active drag
    if (touchDragIndex === null) return;
    
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Find the button element (could be the button itself or a child element)
    let targetButton = elementBelow;
    while (targetButton && !targetButton.classList.contains('word-button-split')) {
      targetButton = targetButton.parentElement;
    }
    
    if (targetButton) {
      // Find the index of the target button
      const buttons = document.querySelectorAll('.word-button-split');
      const dropIndex = Array.from(buttons).indexOf(targetButton as Element);
      
      if (dropIndex !== -1 && dropIndex !== touchDragIndex) {
        wordDragged(touchDragIndex, dropIndex);
      }
    }
    
    // Clean up drag element
    removeDragElement();
    
    // Reset visual states
    const rightElement = e.target as HTMLElement;
    rightElement.removeAttribute('data-dragging');
    document.querySelectorAll('.word-button-split').forEach(button => {
      button.removeAttribute('data-drag-over');
    });
    
    setTouchDragIndex(null);

  };

  const wordContent = words.map((word, index) => (
    <button
      key={index}
      className="word-button word-button-split"
      onClick={() => console.log(`Clicked word ${index + 1}: ${word.first}${word.second}`)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, index)}
    >
      <div className='left'>{word.first}</div>
      <div 
        className='right'
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onTouchStart={(e) => handleTouchStart(e, index)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: touchDragIndex === index ? 'relative' : 'static',
          zIndex: touchDragIndex === index ? 1000 : 'auto',
          // transform: touchDragIndex === index ? 'scale(1.1)' : 'none',
          // transition: touchDragIndex === index ? 'none' : 'transform 0.2s ease'
        }}
      >
        {word.second}
      </div>
    </button>
  ));

  const [inputSentence, setInputSentence] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSentence.trim()) {
      setCurrentSentence(inputSentence.trim());
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Happle - Word Mixing Game</h1>
        <p>Enter a sentence and watch the words get mixed up!</p>
      </header>

      <main className="app-main">
        <div className='sentence-form'>
          <div className='word-buttons'>
            {wordContent}

          </div>
        </div>
        <hr />
        <form onSubmit={handleSubmit} className="sentence-form">
          <div className="input-group">
            <label htmlFor="sentence-input">Enter a sentence:</label>
            <input
              id="sentence-input"
              type="text"
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="Type your sentence here..."
              className="sentence-input"
            />
          </div>
          <button type="submit" className="submit-button">
            Set Sentence
          </button>
        </form>

        {currentSentence && <Happle />}
      </main>
      {window.location.hash === '#admin' && <Generate />}
    </div>
  );
}

export default App;

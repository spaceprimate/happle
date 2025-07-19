import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Generate from './Generate';
import Confetti from './Confetti';
import { daysSince, quotesData } from './quotes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './fontawesome';





function App() {
  const [words, setWords] = useState(quotesData[daysSince() % quotesData.length].words);
  const author = quotesData[daysSince() % quotesData.length].author;

  const [wordPath, setWordPath] = useState<string[]>([]);
  const [scorePath, setScorePath] = useState<string[]>([]);
  const [showCopiedOverlay, setShowCopiedOverlay] = useState(false);

  const updateWordPath = (p: string, b: boolean) => {
    const path = wordPath.concat(p);
    setWordPath(path);

    const score = scorePath.concat(b ? '🟩' : '🟥' );
    setScorePath(score);
    console.log('Word path updated:', path);
  }

  const copyScore = () => {
    // const scoreData = {
    //   attempts: attempts + 1,
    //   numberCorrect,
    //   wordPath,
    // };
    const text = `H🍏 - Solved in ${attempts + 1}!\n` + scorePath.join(' ');
    // console.log(scorePath)
    // const text = JSON.stringify(scoreData, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          // console.log('Score copied to clipboard');
          setShowCopiedOverlay(true);
          setTimeout(() => setShowCopiedOverlay(false), 2000);
        })
        .catch(err => console.error('Failed to copy score:', err));
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        console.log('Score copied to clipboard');
        setShowCopiedOverlay(true);
        setTimeout(() => setShowCopiedOverlay(false), 2000);
      } catch (err) {
        console.error('Failed to copy score:', err);
      }
      document.body.removeChild(textarea);


    }
  };

  // const [dateOffset, setDateOffset] = useState(quotesData[daysSince() % quotesData.length].words);
  // console.log('days since:', daysSince() % quotesData.length);

  // console.log('words:', quotesData);

  // const [words, setWords] = useState([
  //   { first: 'I', second: 'u', original: 'f' },
  //   { first: 'yo', second: 't', original: 'u' },
  //   { first: 'can', second: 'e', original: 't' },
  //   { first: 'b', second: 'f', original: 'e' },
  //   { first: 'kin', second: 'e', original: 'd,' },
  //   { first: 'a', second: 'ue', original: 't' },
  //   { first: 'lea', second: 't', original: 'st' },
  //   { first: 'b', second: 'st', original: 'e' },
  //   { first: 'vag', second: 'd,', original: 'ue' }
  // ]);

  // const handlePreviousQuote = () => {
  //   setDateOffset(dateOffset - 1);
  //   setWords(quotesData[dateOffset].words);
  //   console.log('Previous quote words:', index);
  // }

  // const handleNextQuote = () => {
  //   const index = (daysSince() + 1) % quotesData.length;
  //   setWords(quotesData[index].words);
  //   console.log('Next quote words:', quotesData[index].words);
  // }

  const [attempts, setAttempts] = useState(-2);
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const index = daysSince() % quotesData.length;
    setWords(quotesData[index].words);
    // console.log('New words set:', quotesData[index].words);
  }, []);

  useEffect(() => {
    // Initialize words or perform any setup logic
    const solvedWords = words.filter(word => word.second === word.original);
    // console.log('Solved words:', solvedWords);
    setAttempts(attempts + 1);
    setNumberCorrect(solvedWords.length);
    setIsSolved(solvedWords.length === words.length);
  }, [words]);

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
    updateWordPath(
      (newWords[button2Index].first + newWords[button2Index].second),
      newWords[button2Index].original === newWords[button2Index].second
  );
    // console.log('-------------------------------------')
    // console.log((newWords[button2Index].first + newWords[button2Index].second));
    // console.log(words)
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

    // console.log('Touch move at:', touch.clientX, touch.clientY);

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

    // console.log('Touch end:', touchDragIndex);
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

    // deselect any text that might have been selected during the drag.
    // make sure no buttons are selected or active
    document.querySelectorAll('.right').forEach(el => {
      (el as HTMLElement).blur();
      el.removeAttribute('data-dragging');
      // el.classList.remove('focus-visible');
      // el.classList.remove('active');
      // el.classList.remove('hover');
    });

    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
    } else if ((document as any).selection) {
      (document as any).selection.empty();
    }



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
        {word.second !== '' ? word.second : '\u00A0'}
      </div>
    </button>
  ));





  return (
    <div className={`app ${isSolved ? 'solved' : ''}`}>
      <header className="app-header">
        <h1>
          {isSolved ? 'Congrats!' : 'HAPPLE'}
        </h1>
        {!isSolved && <p>Drag to rearrange the last half of each word to find the sentence</p>}
        {isSolved && <p>You have found the sentence!</p>}
      </header>

      <main className="app-main">
        <div className='sentence-form'>
          <div className='word-buttons'>
            {wordContent}
            {isSolved && <span className='author'>― {author}</span>}
          </div>
        </div>


      </main>
      <footer className="app-footer">

        <div className='stats'>
          <div><span>Attempt: </span><span className='badge'>{attempts + 1}</span></div>
          <div><span>Correct: </span><span className='badge'>{numberCorrect}</span></div>



        </div>

        {isSolved && <div className='share-button'>
          <span className='badge' onClick={copyScore}>
            <FontAwesomeIcon icon="share" /> SHARE
          </span>
          <span className={`badge copied-overlay ${showCopiedOverlay ? 'show' : ''}`}>
            <FontAwesomeIcon icon="check" /> SCORE COPIED!
          </span>
        </div>}
        {/* <div className='date-button'>`
          {daysSince() % quotesData.length !== 0 && (
            <button onClick={handlePreviousQuote} className='text-button'>Previous puzzle</button>
          )}
        </div> */}
      </footer>
      <div className='footer-date'>
        {new Date().toLocaleDateString('de-AT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Vienna' })}
        {/* {new Date().toDateString()} */}
      </div>
      {window.location.hash === '#admin' && <Generate />}
      {isSolved && <Confetti />}
    </div>
  );
}

export default App;

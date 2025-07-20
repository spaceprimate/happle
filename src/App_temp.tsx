import React, { useState, useEffect } from 'react';
import './App.css';
import Generate from './Generate';
import Confetti from './Confetti';
import { daysSince, quotesData } from './quotes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './fontawesome';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'WORD_HALF';

interface WordHalfProps {
  word: { first: string; second: string; original: string };
  index: number;
  onWordDragged: (dragIndex: number, hoverIndex: number) => void;
}

const WordButton: React.FC<WordHalfProps> = ({ word, index, onWordDragged }) => {
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

  return (
    <button
      ref={(node) => drag(drop(node))}
      className={`word-button word-button-split ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-over' : ''}`}
      onClick={() => console.log(`Clicked word ${index + 1}: ${word.first}${word.second}`)}
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

  // Touch drag state - REMOVED (now using React DnD)
  // Touch event handlers removed - using React DnD instead

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
    setWords(newWords);
  };

  const wordContent = words.map((word, index) => (
    <WordButton
      key={index}
      word={word}
      index={index}
      onWordDragged={wordDragged}
    />
  ));





  // Detect if touch device
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // Choose backend based on device type
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
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
    </DndProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import Generate from './Generate';
import Confetti from './Confetti';
import { calculateDaysSince, calculateNextDate, calculatePrevDate, daysSince, quotesData } from './quotes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './fontawesome';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useDrag, useDrop } from 'react-dnd';
import Birthday from './Birthday';
import Modal from './Modal';
import ModalInstructions from './ModalInstructions';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

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





function App() {
  const [words, setWords] = useState(quotesData[daysSince() % quotesData.length].words);
  // const author = quotesData[daysSince() % quotesData.length].author;
  const [author, setAuthor] = useState(quotesData[daysSince() % quotesData.length].author);

  const [wordPath, setWordPath] = useState<string[]>([]);
  const [scorePath, setScorePath] = useState<string[]>([]);
  const [showCopiedOverlay, setShowCopiedOverlay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(calculateDaysSince(currentDate) % quotesData.length);
  const maxIndex = calculateDaysSince(new Date())

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const resetPaths = () => {
    setWordPath([]);
    setScorePath([]);
    setAttempts(-2);
  }

  const updateWordPath = (p: string, b: boolean) => {
    const path = wordPath.concat(p);
    setWordPath(path);

    const score = scorePath.concat(b ? '🟩' : '🟥');
    setScorePath(score);
  }

  const copyScore = () => {
    // const scoreData = {
    //   attempts: attempts + 1,
    //   numberCorrect,
    //   wordPath,
    // };
    const text = `H🍏 - Solved in ${attempts + 1}!\n` + scorePath.join(' ');
    // const text = JSON.stringify(scoreData, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
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
        setShowCopiedOverlay(true);
        setTimeout(() => setShowCopiedOverlay(false), 2000);
      } catch (err) {
        console.error('Failed to copy score:', err);
      }
      document.body.removeChild(textarea);


    }
  };

  // const [dateOffset, setDateOffset] = useState<number>(0);

  const handlePreviousQuote = () => {
    // setDateOffset(dateOffset + 1);
    if (currentIndex > 0) {
      setCurrentDate(calculatePrevDate(currentDate));
      setCurrentIndex((currentIndex - 1 + quotesData.length) % quotesData.length);
      console.log('current index: ', currentIndex)
      resetPaths();
    }

  }

  const handleNextQuote = () => {
    // setDateOffset(dateOffset - 1);
    setCurrentDate(calculateNextDate(currentDate));
    setCurrentIndex((currentIndex + 1) % quotesData.length);
    resetPaths();
  }


  const [attempts, setAttempts] = useState(-2);
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  // Click-to-swap functionality
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(null);


  // calculates the index of the current quote based on the number of days since a 
  // reference date, the grabs the appropriate quote from the quotesData array
  useEffect(() => {
    // const index = (daysSince() - dateOffset) % quotesData.length;
    setWords(quotesData[currentIndex].words);
    setAuthor(quotesData[currentIndex].author);
  }, [currentIndex]);

  // on each update of the words, check if the words are solved
  // and update attempts and numberCorrect accordingly
  useEffect(() => {
    // Initialize words or perform any setup logic
    const solvedWords = words.filter(word => word.second === word.original);
    setAttempts(attempts + 1);
    setNumberCorrect(solvedWords.length);
    setIsSolved(solvedWords.length === words.length);
  }, [words]);


  // run once, handle initial setup
  useEffect(() => {
    // check confirmedInstructions cookie. if "true", set isModalOpen to true
    const confirmedInstructions = document.cookie
      .split('; ')
      .find(row => row.startsWith('confirmedInstructions='))
      ?.split('=')[1];

    if (confirmedInstructions !== 'true') {
      setIsModalOpen(true);
    }
  }, []);


  const wordDragged = (button1Index: number, button2Index: number) => {

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
    (document.activeElement as HTMLElement | null)?.blur(); // Remove focus from button after drag
  };

  // Handle button clicks for alternative interaction method
  const handleButtonClick = (clickedIndex: number) => {
    if (selectedButtonIndex === null) {
      // First click - select the button
      setSelectedButtonIndex(clickedIndex);
    } else if (selectedButtonIndex === clickedIndex) {
      // Clicking the same button again - deselect it
      setSelectedButtonIndex(null);
      (document.activeElement as HTMLElement | null)?.blur(); // Remove focus from button after deselect
    } else {
      // Second click on different button - perform swap
      wordDragged(selectedButtonIndex, clickedIndex);
      setSelectedButtonIndex(null);
    }
  };

  // Handle clicks outside buttons to deselect
  const handleBackgroundClick = () => {
    if (selectedButtonIndex !== null) {
      setSelectedButtonIndex(null);
    }
  };

  const wordContent = words.map((word, index) => (
    <WordButton
      key={index}
      word={word}
      index={index}
      onWordDragged={wordDragged}
      onButtonClick={handleButtonClick}
      isSelected={selectedButtonIndex === index}
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
      <div id='app-wrapper' className={`app-wrapper ${isSolved ? 'solved' : ''}`}>
        <nav className='app-nav'>
          <h1 className='app-title'>
            HAPPLE #{currentIndex} <span className='muted'>{currentDate.toDateString()}</span>

            {/* {(isSolved && (daysSince() !== 14 && daysSince() !== 13)) && 'Congrats!'} */}

          </h1>

          <div className='help-button'>
            <button onClick={handleOpenModal} className='icon-button' aria-label="Help">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </button>
          </div>


          <Modal show={isModalOpen} onClose={handleCloseModal}>
            <ModalInstructions onConfirm={handleCloseModal} />
          </Modal>
          {isSolved && <p>You have found the sentence!</p>}

        </nav>
        <div className={`app ${isSolved ? 'solved' : ''}`} onClick={handleBackgroundClick}>

          <main className="game">
            <div className='sentence-form'>
              <div className='word-buttons'>
                {wordContent}
                {isSolved && <span className='author'>― {author}</span>}
              </div>
            </div>

          </main>
          <footer className="game-footer">

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

          {window.location.hash === '#admin' && <Generate />}
          {window.location.hash === '#test' &&
            <button className='next-quote-button' onClick={handleNextQuote}>
              <FontAwesomeIcon icon="arrow-right" /> Next Quote
            </button>
          }
          {isSolved && <Confetti />}
        </div>
        <div className='app-footer'>


          <button className='previous-quote-button' onClick={handlePreviousQuote} disabled={currentIndex <= 1}>
            <FontAwesomeIcon icon="arrow-left" /> Previous
          </button>
          <button className='next-quote-button' onClick={handleNextQuote} disabled={currentIndex >= maxIndex}>
            Next <FontAwesomeIcon icon="arrow-right" />
          </button>
        </div>

      </div>
    </DndProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import Generate from './components/Generate';
import Confetti from './components/Confetti';
import { calculateDaysSince, calculateNextDate, calculatePrevDate, quotesData } from './quotes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './fontawesome';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import Modal from './components/modal/Modal';
import ModalInstructions from './components/modal/ModalInstructions';
import { faLink, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import WordButton from './components/WordButton';





function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [words, setWords] = useState([...quotesData[calculateDaysSince(currentDate) % quotesData.length].words]);
  type Word = { first: string; second: string; original: string };
  const [words, setWords] = useState<Word[]>([]);
  const [author, setAuthor] = useState<string>();
  const [wordPath, setWordPath] = useState<string[]>([]);
  const [scorePath, setScorePath] = useState<string[]>([]);
  const [showCopiedOverlay, setShowCopiedOverlay] = useState(false);
  // this is a copied overlay for the current puzzle link icon/button
  const [showLinkOverlay, setShowLinkOverlay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(calculateDaysSince(currentDate) % quotesData.length);
  
  const [attempts, setAttempts] = useState<number>(0);
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  
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
    setAttempts(0);
  }

  const updateWordPath = (p: string, b: boolean) => {
    const path = wordPath.concat(p);
    setWordPath(path);

    const score = scorePath.concat(b ? '🟩' : '🟥');
    setScorePath(score);

    console.log('Word path updated:', score);
    console.log('attempts', attempts)
  }

  const copyScore = () => {
    // const scoreData = {
    //   attempts: attempts + 1,
    //   numberCorrect,
    //   wordPath,
    // };

    console.log(scorePath)
    const text = `H🍏 - Solved in ${attempts}!\n` + scorePath.join(' ');
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

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowLinkOverlay(true);
        setTimeout(() => setShowLinkOverlay(false), 2000);
      })
      .catch(err => console.error('Failed to copy link:', err));
  };

  // const [dateOffset, setDateOffset] = useState<number>(0);

  const handlePreviousQuote = () => {
    // setDateOffset(dateOffset + 1);
    if (currentIndex > 0) {
      setCurrentDate(calculatePrevDate(currentDate));
      setCurrentIndex((currentIndex - 1 + quotesData.length) % quotesData.length);
      console.log('current index: ', currentIndex)
      resetPaths();

      // update the url
      const url = new URL(window.location.href);
      url.searchParams.set('number', (currentIndex - 1).toString());
      window.history.pushState({}, '', url);
    }



  }

  const handleNextQuote = () => {
    // setDateOffset(dateOffset - 1);
    setCurrentDate(calculateNextDate(currentDate));
    setCurrentIndex((currentIndex + 1) % quotesData.length);
    resetPaths();

    const url = new URL(window.location.href);
    url.searchParams.set('number', (currentIndex + 1).toString());
    window.history.pushState({}, '', url);
  }


  

  // Click-to-swap functionality
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(null);


  // calculates the index of the current quote based on the number of days since a 
  // reference date, the grabs the appropriate quote from the quotesData array
  // Note: this is also run on initialization, no need to set the words/author elsewhere
  useEffect(() => {
    // const index = (daysSince() - dateOffset) % quotesData.length;
    console.log('index changed, updating words', quotesData)
    setWords(structuredClone(quotesData[currentIndex].words));
    setAuthor(quotesData[currentIndex].author);
    setAttempts(0)
  }, [currentIndex]);

  // on each update of the words, check if the words are solved
  // and update attempts and numberCorrect accordingly
  useEffect(() => {
    // Initialize words or perform any setup logic
    const solvedWords = words.filter(word => word.second === word.original);
    // setAttempts(attempts + 1);
    console.log('words check', words)
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


    // check to see if there's a GET variable called "number". If there is, set the currentIndex accordingly
    const urlParams = new URLSearchParams(window.location.search);
    const number = urlParams.get('number');
    if (number) {
      const index = parseInt(number, 10);
      if (!isNaN(index) && index >= 0 && index <= maxIndex) {
        setCurrentIndex(index);


        // calculate the new date by subtracting the currentIndex from the maxIndex,
        // then setting the currentDate accordingly
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - (maxIndex - (index)));
        setCurrentDate(newDate);
      }
      else{
        // remove the invalid index from the URL
        const url = new URL(window.location.href);
        url.searchParams.delete('number');
        window.history.pushState({}, '', url);
      }






      // todo: make sure invalid numbers won't work
      // todo: update the url on prev/next
    }
  }, []);

  // used by dragging and clicking attempts
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
    setAttempts(attempts + 1)

    console.log('quotesdata: ', quotesData);
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
            HAPPLE<span className='muted'>#</span>{currentIndex} 

            {/* {(isSolved && (daysSince() !== 14 && daysSince() !== 13)) && 'Congrats!'} */}

          </h1>

          <span className='muted'>{currentDate.toDateString()}</span>

          <div className='help-button'>
            <button onClick={handleOpenModal} className='icon-button' aria-label="Help">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </button>
          </div>


          <Modal show={isModalOpen} onClose={handleCloseModal}>
            <ModalInstructions onConfirm={handleCloseModal} />
          </Modal>

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
              <div><span>Attempt: </span><span className='badge'>{attempts}</span></div>
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


          <button className='previous-quote-button' onClick={handlePreviousQuote} disabled={currentIndex <= 0}>
            <FontAwesomeIcon icon="arrow-left" /> Previous
          </button>

          <button title='copy link to this puzzle' onClick={copyLink} className='link-button'>
            <FontAwesomeIcon icon={faLink} />
            <span className={`badge copied-overlay ${showLinkOverlay ? 'show' : ''}`} style={{width: '150px', right: '-65px'}}>
              #{currentIndex} URL COPIED!
            </span>
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

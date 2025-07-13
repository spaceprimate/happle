import React, { useState } from 'react';
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
  const words = [
    { first: 'I', second: 'u', original: 'f' },
    { first: 'yo', second: '’t', original: 'u' },
    { first: 'can', second: 'e', original: '’t' },
    { first: 'b', second: 'f', original: 'e' },
    { first: 'kin', second: 'e', original: 'd,' },
    { first: 'a', second: 'ue', original: 't' },
    { first: 'lea', second: 't', original: 'st' },
    { first: 'b', second: 'st', original: 'e' },
    { first: 'vag', second: 'd,', original: 'ue' }
  ]

  const wordContent = words.map((word, index) => (
    <button
      key={index}
      className="word-button word-button-split"
      onClick={() => console.log(`Clicked word ${index + 1}: ${word.first}${word.second}`)}
    >
      <div className='left'>{word.first}</div>
      <div className='right'>{word.second}</div>
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

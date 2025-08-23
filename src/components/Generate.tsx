import React from 'react';

// const sentence = "If you can’t be kind, at least be vague";
// const sentence2 = "This is an example sentence";

// function splitWordInHalf(word: string): [string, string] {
//   const mid = Math.ceil(word.length / 2);
//   return [word.slice(0, mid), word.slice(mid)];
// }

const quotesToConvert: { quote: string, author: string }[] = [
  {quote: `move it up down left right oh switch it up like nintendo`, author: `Sabrina Carpenter`},
  {quote: `A word to the wise is infuriating.`, author: `Hunter S. Thompson`},
  {quote: `Why Are You Booing Me? I'm Right`, author: `Hannibal Buress`},
  {quote: `What's another word for thesaurus?`, author: `Steven Wright`},
  {quote: `Reality: What a concept!`, author: `Robin Williams`},
  {quote: `Love is blind but marriage is a real eye-opener`, author: `Pauline Thomason`},
  {quote: `Lord make me pure but not yet`, author: `Saint Augustine`},
  {quote: `Leia follows me like a vague smell`, author: `Carrie Fisher`},
  {quote: `Include me out`, author: `Samuel Goldwyn`},
  {quote: `What can you do? Medicine is not a science`, author: `Dr. Spaceman`},
  {quote: `Time is an illusion. Lunchtime doubly so.`, author: `Douglas Adams`},
  {quote: `To err is human, but it feels divine`, author: `Mae West`},
];

const startingId = 44;


function splitWords(sentence: string): [string, string][] {
  // const s1 = sentence.split(' ').map(splitWordInHalf);
  const s0 = sentence.replace("'", "");
  const s1 = s0.split(' ')
  const s2: [string, string][] = s1.map(word => {
    const mid = Math.ceil(word.length / 2);
    // const second = word.slice(mid).length > 0 ? word.slice(mid) : ' ';
    return [word.slice(0, mid), word.slice(mid)];
  })
  // const w2 = shuffleSecondStrings(w1);
  return s2;
}

function shuffleSecondStrings(arr: [string, string][]): [string, string][] {
  const seconds = arr.map(([_, second]) => second);
  // Fisher-Yates shuffle with derangement
  let n = seconds.length;
  for (let i = n - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    [seconds[i], seconds[j]] = [seconds[j], seconds[i]];
  }
  // Ensure no element is in its original position (simple derangement)
  for (let i = 0; i < n; i++) {
    if (seconds[i] === arr[i][1]) {
      // Swap with next (or previous if last)
      let swapWith = i === n - 1 ? i - 1 : i + 1;
      [seconds[i], seconds[swapWith]] = [seconds[swapWith], seconds[i]];
    }
  }
  return arr.map(([first], i) => [first, seconds[i]]);
}


const getObjectString = (s: [string, string][], o: [string, string][]): string => {
  return s.map(([first, second], index) => `{first: '${first}', second: '${second}', original: '${o[index][1]}'}`).join(', \n');
}

const getObject = (s: [string, string][], o: [string, string][]): { first: string, second: string, original: string }[] => {
  return s.map(([first, second], index) => ({ first, second, original: o[index][1] }));
}

const Generate: React.FC = () => {

  const [sentence, setSentence] = React.useState('');




  const words = splitWords(sentence);
  const wordsSuffled = shuffleSecondStrings(words);

  const genBulkQuotes = () => {
    const cleanedQuotes = quotesToConvert.map(q => ({
      quote: q.quote.replace(/'/g, '’'), // Remove apostrophes
      author: q.author.replace(/'/g, '’')
    }));
    return cleanedQuotes.map((q, idx) => {
      const w1 = splitWords(q.quote);
      const wShuffled = shuffleSecondStrings(w1);
      const wFinal = getObject(wShuffled, w1);
      return {
        id: startingId + idx,
        words: wFinal,
        quote: q.quote,
        author: q.author,
      }
    });
  };

  const bulkQuotes = genBulkQuotes();
  const bulkQuotesString = JSON.stringify(bulkQuotes, null, 2)
    .replace(/"(\w+)":/g, '$1:'); // Remove quotes around attribute names
  // console.log('Generated Bulk Quotes:', genBulkQuotes());

  // const rows = shuffleSecondStrings(splitWords());

  return (
    <>
      <input
        type="text"
        value={sentence}
        onChange={e => setSentence(e.target.value)}
        placeholder="Enter a sentence..."
        style={{ width: '100%', marginBottom: '1em' }}
      />

      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'right' }}>1</th>
            <th style={{ textAlign: 'left' }}>2</th>
          </tr>
        </thead>
        <tbody>
          {wordsSuffled.map(([first, second], idx) => (
            <tr key={idx}>
              <td>{first}</td>
              <td>{second}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>Generated Object String:</h3>
        <pre>{getObjectString(wordsSuffled, words)}</pre>
      </div>
      <hr />
      <div>
        <h3>Generated Bulk Quotes:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', textAlign: 'left' }}>{bulkQuotesString}</pre>
      </div>
    </>
  );
};

export default Generate;
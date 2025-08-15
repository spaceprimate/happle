import React from 'react';

// const sentence = "If you can’t be kind, at least be vague";
// const sentence2 = "This is an example sentence";

// function splitWordInHalf(word: string): [string, string] {
//   const mid = Math.ceil(word.length / 2);
//   return [word.slice(0, mid), word.slice(mid)];
// }

const quotesToConvert: { quote: string, author: string }[] = [
  { quote: `Love is what you've been through with somebody.`, author: `James Thurber` },
  { quote: `It ain't the heat, it's the humility.`, author: `Yogi Berra` },
  { quote: `They talk of the dignity of work. The dignity is in leisure.`, author: `Herman Melville` },
  { quote: `If life gives you limes, make margaritas.`, author: `Jimmy Buffet` },
  { quote: `Storms make trees take deeper roots.`, author: `Dolly Parton` },
  { quote: `Maybe I can find the truth by comparing the lies`, author: `Leon Trotsky` },
  { quote: `Sooner or later we're all someone's dog.`, author: `Terry Pratchett` },
  { quote: `To be or not to be. That's not really a question.`, author: `Jean-Luc Godard` },
  { quote: `In the beginning there was nothing, which exploded.`, author: `Terry Pratchett` },
  { quote: `What's missing from pop music is danger.`, author: `Prince` },
  { quote: `only time will tell if we stand the test of time`, author: `Eddie Van Halen` },
  { quote: `Sneaking up like Celery, yeah I'm stalkin`, author: `Vanilla Ice` },
  { quote: `Nobody goes there anymore. It's too crowded.`, author: `Yogi Berra` },
  { quote: `There's nothing like white trash at the White House.`, author: `Dolly Parton` },
  { quote: `I love Mickey Mouse more than any woman I have ever known.`, author: `Walt Disney` },
  { quote: `Maybe you think I'm a pervert but it is really boring at work`, author: `Robin Stricklin` },
  { quote: `Thank God I'm an atheist.`, author: `Luis Bunuel` },
  { quote: `I can resist everything except temptation`, author: `Oscar Wilde` },
  { quote: `the Quest for the truth had been born in me`, author: `Ida tarbell` },
  { quote: `Revolutions are always verbose.`, author: `Leon Trotsky` },
  { quote: `You can't die with an unfinished book.`, author: `Terry Pratchett` },
];

const startingId = 23;


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
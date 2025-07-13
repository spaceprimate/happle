import React from 'react';

const sentence = "If you can’t be kind, at least be vague";
const sentence2 = "This is an example sentence";

// function splitWordInHalf(word: string): [string, string] {
//   const mid = Math.ceil(word.length / 2);
//   return [word.slice(0, mid), word.slice(mid)];
// }


function splitWords(sentence: string): [string, string][] {
  // const s1 = sentence.split(' ').map(splitWordInHalf);
  const s1 = sentence.split(' ')
  const s2: [string, string][] = s1.map(word => {
    const mid = Math.ceil(word.length / 2);
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

const Generate: React.FC = () => {

  const [sentence, setSentence] = React.useState('');




  const words = splitWords(sentence);
  const wordsSuffled = shuffleSecondStrings(words);

  

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
            <th style={{textAlign: 'right'}}>1</th>
            <th style={{textAlign: 'left'}}>2</th>
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
    </>
  );
};

export default Generate;
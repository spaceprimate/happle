import React from 'react';

const sentence = "This is an example sentence";

function splitWordInHalf(word: string): [string, string] {
  const mid = Math.ceil(word.length / 2);
  return [word.slice(0, mid), word.slice(mid)];
}

function generate(): [string, string][] {
  return sentence.split(' ').map(splitWordInHalf);
}

const Generate: React.FC = () => {
  const rows = generate();

  return (
    <table>
      <thead>
        <tr>
          <th>First Half</th>
          <th>Second Half</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([first, second], idx) => (
          <tr key={idx}>
            <td>{first}</td>
            <td>{second}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Generate;
import { useState } from 'react';
import levels from './levels.json';
import Grid from './components/Rectangle';
import './App.css';

function App() {
  const pieces = levels[0].pieces;
  console.log(pieces);

  return (
    <div>
      {pieces.map((piece, pieceIndex) => (
        <Grid width={piece.width} height={piece.height} key={pieceIndex} />
      ))}
    </div>
  );
}
export default App;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { PiecesInPlayProvider } from './context/PiecesInPlay.tsx';
import BoardSquaresProvider from './context/BoardSquares.tsx';
import SelectedPieceProvider from './context/SelectedPiece.tsx';
import CurrentLevelProvider from './context/CurrentLevel.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <CurrentLevelProvider>
      <BoardSquaresProvider>
        <PiecesInPlayProvider>
          <SelectedPieceProvider>
            <App />
          </SelectedPieceProvider>
        </PiecesInPlayProvider>
      </BoardSquaresProvider>
    </CurrentLevelProvider>
  </StrictMode>
);

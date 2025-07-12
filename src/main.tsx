import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { PiecesInPlayProvider } from './context/PiecesInPlay';
import { SelectedPieceProvider } from './context/SelectedPiece';
import { CurrentLevelProvider } from './context/CurrentLevel';
import { BoardSquaresProvider } from './context/BoardSquares';

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

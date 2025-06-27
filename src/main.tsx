import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { PiecesInPlayProvider } from './context/PiecesInPlay';
import { SelectedPieceProvider } from './context/SelectedPiece';
import { CurrentLevelProvider } from './context/CurrentLevel';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <CurrentLevelProvider>
      <PiecesInPlayProvider>
        <SelectedPieceProvider>
          <App />
        </SelectedPieceProvider>
      </PiecesInPlayProvider>
    </CurrentLevelProvider>
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { PiecesInPlayProvider } from './context/PiecesInPlay.tsx';
import SelectedPieceProvider from './context/SelectedPiece.tsx';
import CurrentLevelProvider from './context/CurrentLevel.tsx';

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

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import PiecesInPlayProvider from './context/PiecesInPlay.jsx';
import SelectedPieceProvider from './context/SelectedPiece.tsx';
import CurrentLevelProvider from './context/CurrentLevel.tsx';

createRoot(document.getElementById('root')).render(
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

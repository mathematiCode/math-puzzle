import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import PiecesInPlayProvider from './context/PiecesInPlay.jsx';
import SelectedPieceProvider from './context/SelectedPiece.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PiecesInPlayProvider>
      <SelectedPieceProvider>
        <App />
      </SelectedPieceProvider>
    </PiecesInPlayProvider>
  </StrictMode>
);

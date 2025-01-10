import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import PiecesInPlayProvider from './context/PiecesInPlay.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PiecesInPlayProvider>
      <App />
    </PiecesInPlayProvider>
  </StrictMode>
);

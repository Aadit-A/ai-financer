import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress browser extension errors that don't affect the app
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Extension context invalidated')) {
    event.preventDefault();
    console.warn('Browser extension error suppressed (does not affect app functionality)');
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

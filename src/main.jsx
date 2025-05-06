import React from 'react';
import ReactDOM from 'react-dom/client';
import ProvidedApp from './App'; // Import the wrapped App
import './index.css'; // Import global styles (including Tailwind)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProvidedApp />
  </React.StrictMode>,
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import CountdownWebsiteV3 from './CountdownWebsiteV3';
import App from './App';
import Lrc from './Lrc';
import KaraokePlayer from './Player';
import { Navigate } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<CountdownWebsiteV3 />} />
        <Route path="/home" element={<App />} />
        <Route path="/lrc" element={<Lrc />} />        
        <Route path="/player" element={<KaraokePlayer />} />      
        <Route path="/playerhtml" element={<Navigate to="/player.html" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

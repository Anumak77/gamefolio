import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import * as Phaser from 'phaser';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameCanvas from './components/GameCanvas';
import RoomScene from './components/RoomScene';
import IntroGame from './components/IntroGame';


import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroGame />} />
        <Route path="/game" element={<GameCanvas />} />
        <Route path="/room" element={<RoomScene />} />
      </Routes>
    </Router>
  );
}

export default App;

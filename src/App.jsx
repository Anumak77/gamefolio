import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GameCanvas from './GameCanvas';

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden m-0 p-0">
      <GameCanvas />
    </div>
  );
}


export default App

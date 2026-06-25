import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import QuestionManager from './components/QuestionManager';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] relative overflow-hidden">
        {/* Dynamic Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        
        <Navbar />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:topic" element={<Quiz />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/manage-questions" element={<QuestionManager />} />
          </Routes>
        </main>

        {/* Global Scanline Effect */}
        <div className="scanline pointer-events-none"></div>
      </div>
    </Router>
  );
}

export default App;
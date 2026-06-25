import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center cyber-glow-primary group-hover:rotate-12 transition-transform">
              <span className="text-black font-bold text-xl">CR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-white group-hover:text-[var(--color-primary)] transition-colors">
                CYBER<span className="text-[var(--color-primary)]">RANGE</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-dim)] -mt-1">
                Mission Control v1.0
              </p>
            </div>
          </Link>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-dim)] hover:text-[var(--color-primary)] transition-colors">Missions</Link>
            <Link to="/leaderboard" className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-dim)] hover:text-[var(--color-primary)] transition-colors">Leaderboard</Link>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-green-500 uppercase">System: Online</span>
            </div>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-widest text-[var(--color-text-dim)]">Clearance XP</span>
              <div className="h-1 w-24 bg-white/5 rounded-full mt-1 overflow-hidden">
                <div className="h-full w-2/3 bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
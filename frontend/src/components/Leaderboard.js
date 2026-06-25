import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';

function Leaderboard() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}/quiz/leaderboard`);
        const data = await response.json();
        setRankings(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter text-white">GLOBAL <span className="text-[var(--color-primary)]">LEADERBOARD</span></h1>
        <p className="text-[var(--color-text-dim)] uppercase tracking-widest text-[10px]">The Elite SRE Responders</p>
      </div>

      <div className="cyber-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[var(--color-primary)]">Rank</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[var(--color-primary)]">Engineer</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[var(--color-primary)]">Mission</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[var(--color-primary)]">Score</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[var(--color-primary)] text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rankings.map((entry, index) => (
              <tr key={entry.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-6 font-mono text-xl text-white/20 group-hover:text-[var(--color-primary)] transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-[10px] font-bold text-black uppercase">
                      {entry.username.slice(0, 2)}
                    </div>
                    <span className="font-bold text-white uppercase tracking-tight">{entry.username}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm text-[var(--color-text-dim)]">
                  {entry.mission_title}
                </td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${entry.score >= 80 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {Math.round(entry.score)}%
                  </span>
                </td>
                <td className="px-6 py-6 text-[10px] font-mono text-[var(--color-text-dim)] text-right">
                  {entry.date}
                </td>
              </tr>
            ))}
            {rankings.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-[var(--color-text-dim)] uppercase tracking-[0.3em] text-xs">
                  No records found in central intelligence
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;

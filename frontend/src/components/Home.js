import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';

function Home() {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/topics`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched topics:', data);
        setTopics(data);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading topics: {error}</p>
          <p>Please make sure the backend server is running and accessible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <header className="text-center space-y-6 pt-10">
        <div className="inline-block px-4 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
          Active Scenario Feed Loaded
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
          SELECT YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">MISSION</span>
        </h1>
        <p className="text-lg text-[var(--color-text-dim)] max-w-2xl mx-auto">
          Test your SRE skills in simulated production environments. Resolve incidents, optimize performance, and keep the systems alive.
        </p>
      </header>

      {/* Mission Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {[
          { label: 'Active Missions', value: topics.length, color: 'var(--color-primary)' },
          { label: 'Clearance Level', value: 'Alpha-9', color: 'var(--color-accent)' },
          { label: 'System Load', value: '34%', color: 'var(--color-primary)' },
          { label: 'Pending Alerts', value: '3', color: 'var(--color-critical)' },
        ].map((stat, i) => (
          <div key={i} className="cyber-card p-4 flex items-center justify-between border-l-2" style={{ borderLeftColor: stat.color }}>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <div className="opacity-20">
              <svg className="w-8 h-8" fill="none" stroke={stat.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {topics.map((topic, index) => (
          <div key={topic.id} className="cyber-card group hover:-translate-y-2 hover:cyber-glow-primary">
            {/* Top Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)]/50 to-transparent"></div>
            
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
                  ID: MISSION-00{index + 1}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter ${
                  index % 3 === 0 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                  index % 3 === 1 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                  'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {index % 3 === 0 ? 'Low' : index % 3 === 1 ? 'Elevated' : 'Critical'} Severity
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-[var(--color-primary)] transition-colors mb-3">
                  {topic.title}
                </h2>
                <p className="text-sm text-[var(--color-text-dim)] leading-relaxed line-clamp-3">
                  {topic.description}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-bg)] flex items-center justify-center text-[8px] font-bold text-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <Link
                  to={`/quiz/${topic.id}`}
                  className="cyber-button cyber-button-outline !px-4 !py-2 !text-xs"
                >
                  Initiate Mission
                </Link>
              </div>
            </div>
            
            {/* Hover Background Accent */}
            <div className="absolute inset-0 bg-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
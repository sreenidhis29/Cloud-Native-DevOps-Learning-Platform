import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

function Quiz() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/quiz/${topic}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }
      const data = await response.json();
      console.log('Fetched quiz:', data);
      setQuiz(data);
      setAnswers({});
      setCurrentStep(0); // Reset to first card
      setError(null);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleAnswerSelect = (questionId, answerText) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerText
    }));
  };

  const handleSubmit = async () => {
    try {
      const answeredQuestions = Object.keys(answers).length;
      const totalQuestions = quiz.questions.length;

      if (answeredQuestions < totalQuestions) {
        alert(`Please answer all questions (${answeredQuestions}/${totalQuestions} answered)`);
        return;
      }

      const response = await fetch(`${API_URL}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          answers: answers
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quiz');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    }
  };

  const handleTryAgain = async () => {
    setResult(null);
    setAnswers({});
    await fetchQuiz();
  };

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const [logs, setLogs] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [systemHealth, setSystemHealth] = useState({ cpu: 85, mem: 72, net: 45 });

  // Simulate Live Logs
  useEffect(() => {
    if (result) return;
    
    const logPool = [
      "CRITICAL: Pod 'api-backend' restarted unexpectedly",
      "WARNING: Readiness probe failed for service 'db-proxy'",
      "INFO: Cluster-autoscaler scale-up triggered",
      "ERROR: 504 Gateway Timeout detected on Ingress controller",
      "DEBUG: Scrim-buffer sync initiated for namespace 'prod'",
      "ALERT: High latency detected in us-east-1a",
      "SYSTEM: Kernel panic prevented on node-x86-04",
      "INFO: New deployment 'frontend-v2' rollout started"
    ];

    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] ${logPool[Math.floor(Math.random() * logPool.length)]}`;
      setLogs(prev => [newLog, ...prev].slice(0, 8));
      
      // Jitter health stats
      setSystemHealth(prev => ({
        cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() * 4 - 2))),
        mem: Math.min(100, Math.max(10, prev.mem + (Math.random() * 2 - 1))),
        net: Math.min(100, Math.max(10, prev.net + (Math.random() * 10 - 5)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [result]);

  useEffect(() => {
    if (timeLeft > 0 && !result) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, result]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    // Simulate terminal response
    const newLog = `[${new Date().toLocaleTimeString()}] USER_EXEC: ${terminalInput}`;
    setLogs(prev => [newLog, ...prev].slice(0, 8));
    setTerminalInput('');
    
    // Check for some keywords to "boost" health
    if (terminalInput.toLowerCase().includes('kubectl') || terminalInput.toLowerCase().includes('fix')) {
        setSystemHealth(prev => ({ ...prev, cpu: prev.cpu - 5 }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[var(--color-primary)] font-mono animate-pulse uppercase tracking-widest text-xs">Establishing Secure Connection...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="cyber-card p-8 border-t-4 border-t-[var(--color-critical)] text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-[var(--color-critical)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest">Connection Interrupted</h2>
          <p className="text-sm text-[var(--color-text-dim)]">{error || 'Mission profile not found.'}</p>
          <button onClick={() => navigate('/')} className="cyber-button cyber-button-primary w-full text-xs">Return to Base</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      
      {/* LEFT COLUMN: Mission Control & Stats */}
      <div className="lg:col-span-4 space-y-6">
        <div className="cyber-card p-6 space-y-6 bg-gradient-to-br from-[var(--color-surface)] to-black/60">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">System Health</h2>
            <span className="text-[10px] text-[var(--color-text-dim)] uppercase">Real-time Feed</span>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'CPU Load', value: systemHealth.cpu, color: 'var(--color-primary)' },
              { label: 'Memory', value: systemHealth.mem, color: 'var(--color-accent)' },
              { label: 'Network', value: systemHealth.net, color: 'var(--color-secondary)' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>{stat.label}</span>
                  <span>{Math.round(stat.value)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 ease-out" 
                    style={{ width: `${stat.value}%`, backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-[var(--color-text-dim)]">Time Remaining</span>
              <span className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-[var(--color-critical)] animate-pulse' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${timeLeft < 60 ? 'bg-[var(--color-critical)]' : 'bg-[var(--color-primary)]'}`}
                style={{ width: `${(timeLeft / 600) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Live Logs */}
        <div className="cyber-card p-6 h-[300px] flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            System Log Feed
          </h3>
          <div className="flex-1 font-mono text-[10px] overflow-hidden space-y-2 opacity-80">
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={i} className={`border-l-2 pl-2 ${log.includes('CRITICAL') || log.includes('ERROR') ? 'border-red-500 text-red-400' : log.includes('USER_EXEC') ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-white/10 text-[var(--color-text-dim)]'}`}>
                {log}
              </div>
            )) : <p className="text-[var(--color-text-dim)] animate-pulse">Waiting for telemetry...</p>}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Terminal & Interactive Area */}
      <div className="lg:col-span-8 space-y-6">
        {!result ? (
          <>
            <div className="flex items-center justify-between px-2">
              <h1 className="text-2xl font-bold tracking-tight text-white uppercase">{quiz.title}</h1>
              <span className="text-[10px] font-mono text-[var(--color-primary)]">SESSION_TOKEN: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
            </div>

            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                <span>Mission Progress</span>
                <span className="text-[var(--color-primary)]">Question {currentStep + 1} of {quiz.questions.length}</span>
              </div>

              {/* Question Card Deck */}
              <div className="relative min-h-[400px]">
                {quiz.questions.map((question, index) => (
                  <div 
                    key={question.id} 
                    className={`cyber-card absolute inset-0 transition-all duration-500 transform ${
                        index === currentStep 
                        ? 'opacity-100 translate-x-0 pointer-events-auto scale-100' 
                        : index < currentStep 
                        ? 'opacity-0 -translate-x-full pointer-events-none scale-95' 
                        : 'opacity-0 translate-x-full pointer-events-none scale-95'
                    }`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <span className="text-6xl font-black italic">{index + 1}</span>
                    </div>
                    
                    <div className="p-10 space-y-8">
                      <div className="flex items-start space-x-6">
                        <div className="w-10 h-10 bg-black border border-[var(--color-primary)]/30 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]">
                          <span className="text-sm font-mono text-[var(--color-primary)]">{index + 1}</span>
                        </div>
                        <h3 className="text-xl font-medium leading-relaxed pt-1">
                          {question.question}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4 ml-16">
                        {question.options.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() => handleAnswerSelect(question.id, option)}
                            className={`text-left p-5 rounded-xl border transition-all duration-300 relative group overflow-hidden ${
                              answers[question.id] === option
                                ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-white'
                                : 'bg-black/40 border-white/5 text-[var(--color-text-dim)] hover:border-[var(--color-primary)]/30 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-4 relative z-10">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                answers[question.id] === option ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-white/20'
                              }`}>
                                {answers[question.id] === option && <div className="w-2 h-2 rounded-full bg-black"></div>}
                              </div>
                              <span className="text-base">{option}</span>
                            </div>
                            {/* Hover highlight effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/0 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className={`cyber-button flex-1 py-3 text-[10px] tracking-widest ${currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'cyber-button-outline'}`}
                >
                  PREVIOUS_STEP
                </button>

                {currentStep < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                    disabled={!answers[quiz.questions[currentStep].id]}
                    className={`cyber-button cyber-button-primary flex-1 py-3 text-[10px] tracking-widest ${!answers[quiz.questions[currentStep].id] ? 'opacity-50' : ''}`}
                  >
                    NEXT_STEP
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="cyber-button cyber-button-primary flex-[2] py-3 text-[10px] tracking-[0.3em] shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] animate-pulse"
                  >
                    COMMIT_RESOLUTIONS
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="cyber-card overflow-hidden">
            <div className={`h-2 w-full ${result.score >= 80 ? 'bg-green-500' : result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <div className="p-12 text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-[10px] uppercase tracking-[0.5em] text-[var(--color-text-dim)]">Mission Debriefing</h2>
                <h3 className="text-5xl font-bold tracking-tighter text-white">MISSION {result.score >= 80 ? 'SUCCESS' : 'FAILURE'}</h3>
              </div>

              <div className="inline-block relative">
                <svg className="w-48 h-48 -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={552.92}
                    strokeDashoffset={552.92 * (1 - result.score / 100)}
                    className={`transition-all duration-1000 ease-out ${result.score >= 80 ? 'text-green-500' : result.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black tracking-tighter">{Math.round(result.score)}%</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Score</span>
                </div>
              </div>

              <p className="text-lg text-[var(--color-text-dim)] max-w-md mx-auto italic">
                "{result.score >= 80 ? 'Exceptional work, Engineer. The infrastructure is stable and all services are back within SLIs.' : 'System state remains critical. Review the logs and attempt a new resolution strategy immediately.'}"
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button onClick={handleTryAgain} className="cyber-button cyber-button-outline text-xs">Re-initiate Mission</button>
                <button onClick={() => navigate('/')} className="cyber-button cyber-button-primary text-xs">Return to Command Center</button>
              </div>

              {/* Leaderboard Submission */}
              <div className="pt-8 border-t border-white/5 space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-primary)]">Log your result to the Global Registry</p>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="ENTER CODENAME..." 
                    id="username-input"
                    className="flex-1 bg-black/40 border border-white/10 rounded px-4 py-2 text-xs font-mono text-white outline-none focus:border-[var(--color-primary)]"
                  />
                  <button 
                    onClick={async () => {
                      const username = document.getElementById('username-input').value;
                      if (!username) return alert('Enter your codename, Engineer.');
                      
                      try {
                        const response = await fetch(`${API_URL}/quiz/leaderboard`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            username,
                            score: result.score,
                            mission_title: quiz.title
                          })
                        });
                        if (response.ok) {
                          alert('Entry logged successfully.');
                          navigate('/leaderboard');
                        }
                      } catch (err) {
                        alert('Log failure: Registry unreachable.');
                      }
                    }}
                    className="cyber-button cyber-button-primary !px-6 !py-2 !text-[10px]"
                  >
                    SAVE RESULT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
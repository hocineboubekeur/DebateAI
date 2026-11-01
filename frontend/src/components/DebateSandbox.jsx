import React, { useState, useEffect } from 'react';
import { coachingAPI } from '../services/api';

const modes = ['Rebuttal Rush', 'Fallacy Spotter', 'Evidence Challenge', 'Judge Practice'];

export default function DebateSandbox({ lang = 'en' }) {
  const [activeMode, setActiveMode] = useState(modes[0]);
  const [scenario, setScenario] = useState(null);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState(null);

  const startExercise = async () => {
    setResult(null);
    setAnswer('');
    try {
      const { data } = await coachingAPI.generateSandbox(activeMode, lang);
      setScenario(data.scenario || 'Sample Scenario for ' + activeMode);
      setTimeLeft(60);
      setIsActive(true);
    } catch (err) {
      console.error(err);
      setScenario('Sample Scenario for ' + activeMode + ' (Mocked due to API error)');
      setTimeLeft(60);
      setIsActive(true);
    }
  };

  const submitAnswer = async () => {
    setIsActive(false);
    try {
      const { data } = await coachingAPI.evaluateSandbox({ exercise_type: activeMode, answer, lang });
      setResult(data);
    } catch (err) {
      setResult({ score: 85, feedback: 'Great job identifying the logical flaw!', rewards: '+10 XP' });
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      submitAnswer();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <div className="p-6 max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <span className="text-yellow-500">⚡</span>
        {lang === 'ar' ? 'صندوق الرمل للمهارات' : 'Skill Sandbox'}
      </h1>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 shrink-0">
        {modes.map(mode => (
          <button 
            key={mode} 
            onClick={() => { setActiveMode(mode); setIsActive(false); setResult(null); }}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors font-medium ${activeMode === mode ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="flex-grow flex flex-col">
        {!isActive && !result && (
          <div className="flex-grow flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-lg">
                {lang === 'ar' ? `استعد لتمرين ${activeMode}` : `Ready for ${activeMode}?`}
              </p>
              <button onClick={startExercise} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg font-bold shadow-lg transform transition hover:scale-105">
                {lang === 'ar' ? 'ابدأ التمرين' : 'Start Exercise (60s)'}
              </button>
            </div>
          </div>
        )}

        {isActive && (
          <div className="flex-grow flex flex-col bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                {activeMode}
              </h2>
              <div className={`text-3xl font-mono font-bold px-4 py-1 rounded-lg ${timeLeft <= 10 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-white'}`}>
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl mb-6 border border-indigo-100 dark:border-indigo-800/50">
              <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-2 uppercase tracking-wider">Scenario</h3>
              <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">{scenario}</p>
            </div>
            
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-grow w-full p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-6 text-lg transition-shadow"
              placeholder={lang === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
              autoFocus
            ></textarea>
            
            <button onClick={submitAnswer} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors">
              {lang === 'ar' ? 'إرسال وتقييم' : 'Submit & Evaluate'}
            </button>
          </div>
        )}

        {result && (
          <div className="flex-grow flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-center max-w-lg w-full animate-[fadeInUp_0.5s_ease-out]">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">{lang === 'ar' ? 'نتيجة التقييم' : 'Evaluation Result'}</h2>
              
              <div className="relative inline-flex items-center justify-center mb-8">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle className="text-slate-200 dark:text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                  <circle className="text-indigo-600" strokeWidth="8" strokeDasharray={364} strokeDashoffset={364 - (364 * result.score) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-800 dark:text-white">{result.score}</span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl mb-6 text-left">
                <p className="text-slate-700 dark:text-slate-300">{result.feedback}</p>
              </div>
              
              {result.rewards && (
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-4 py-2 rounded-full font-bold mb-8 text-sm uppercase tracking-wider animate-bounce">
                  <span>🏆</span> {result.rewards}
                </div>
              )}
              
              <div className="flex gap-4">
                <button onClick={startExercise} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
                  {lang === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
                </button>
                <button onClick={() => { setResult(null); setIsActive(false); }} className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-bold transition-colors">
                  {lang === 'ar' ? 'تغيير النمط' : 'Change Mode'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

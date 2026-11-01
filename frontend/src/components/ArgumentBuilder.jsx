import React, { useState } from 'react';

const steps = ['Claim', 'Reason', 'Evidence', 'Rebuttal', 'Conclusion'];

export default function ArgumentBuilder({ onClose, onInsert, lang = 'en' }) {
  const [formData, setFormData] = useState({
    Claim: '', Reason: '', Evidence: '', Rebuttal: '', Conclusion: ''
  });
  const [reviewResult, setReviewResult] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleReview = () => {
    setIsReviewing(true);
    // Mock AI review delay
    setTimeout(() => {
      setReviewResult('Strong structure! Consider making your Evidence more specific and citing a source to bolster the Claim.');
      setIsReviewing(false);
    }, 1000);
  };

  const handleInsert = () => {
    const text = steps
      .map(step => formData[step] ? `**${step}:** ${formData[step]}` : null)
      .filter(Boolean)
      .join('\n\n');
    onInsert(text);
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto border-l border-slate-200 dark:border-slate-700 flex flex-col transform transition-transform duration-300">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <span className="text-blue-500">🏗️</span>
          {lang === 'ar' ? 'بناء الحجة' : 'Argument Builder'}
        </h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <div className="p-4 flex-grow space-y-6">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          {lang === 'ar' ? 'استخدم هذه الصيغة لبناء حجة قوية ومقنعة.' : 'Use this guided formula to construct a well-rounded argument.'}
        </div>
        
        <div className="space-y-5">
          {steps.map((step, idx) => (
            <div key={step} className="relative">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">{step}</label>
              </div>
              <textarea
                value={formData[step]}
                onChange={(e) => setFormData({...formData, [step]: e.target.value})}
                className="w-full p-3 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-shadow"
                rows="2"
                placeholder={`Enter your ${step.toLowerCase()}...`}
              ></textarea>
            </div>
          ))}
        </div>

        {reviewResult && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-lg text-sm shadow-inner relative">
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"></path></svg>
            </div>
            <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-1 flex items-center gap-1">
              ✨ AI Review
            </h4>
            <p className="text-indigo-900 dark:text-indigo-200 relative z-10">{reviewResult}</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky bottom-0 z-10 flex flex-col gap-2">
        <button 
          onClick={handleReview} 
          disabled={isReviewing}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg font-semibold text-sm transition-colors flex justify-center items-center gap-2"
        >
          {isReviewing ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing...</>
          ) : (
            <>🔍 AI Premise Review</>
          )}
        </button>
        <button 
          onClick={handleInsert} 
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md transition-colors"
        >
          Insert to Debate
        </button>
      </div>
    </div>
  );
}

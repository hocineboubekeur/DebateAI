import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Bot, User, Send, Clock, Volume2, VolumeX, ArrowLeft, Gavel, FileText, Paperclip, Mic, MicOff, AlertTriangle, Sparkles, Loader } from 'lucide-react';
import { translations } from '../utils/translations';
import ArenaHeader from './arena/ArenaHeader';
import ScorePanel from './arena/ScorePanel';
import ChatFeed from './arena/ChatFeed';
import ArgumentBuilder from './ArgumentBuilder';

export default function DebateArena({ debate, turns, onSubmitTurn, onFinishDebate, onExitArena, loading, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [autoTTS, setAutoTTS] = useState(false); // DEFAULT IS OFF as requested!
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showArgumentBuilder, setShowArgumentBuilder] = useState(false);

  // Round Timer (180s countdown per round)
  const [timeLeft, setTimeLeft] = useState(180);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-focus input on mount and when loading state changes
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading, turns.length]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const stateRef = useRef({ inputText, uploadedFile, lang, onSubmitTurn });
  useEffect(() => {
    stateRef.current = { inputText, uploadedFile, lang, onSubmitTurn };
  }, [inputText, uploadedFile, lang, onSubmitTurn]);

  // Force submit on timeout
  useEffect(() => {
    if (timeLeft === 0 && !loading) {
      const state = stateRef.current;
      let submissionText = state.inputText;
      if (!submissionText.trim()) {
        submissionText = state.lang === 'ar' ? "(انتهى الوقت)" : "(Time out)";
      }
      if (state.uploadedFile) {
        submissionText += `\n[Attached Evidence Document: ${state.uploadedFile.name}]`;
      }
      state.onSubmitTurn(submissionText);
      setInputText('');
      setUploadedFile(null);
      setTimeLeft(180);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [timeLeft, loading]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = lang === 'ar' ? 'ar-SA' : 'en-US';

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInputText(transcript);
      };

      rec.onend = () => setIsListening(false);
      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error(t.arena_voice_not_supported || "Voice dictation is not supported in this browser version.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (autoTTS && turns.length > 0) {
      const lastTurn = turns[turns.length - 1];
      if (lastTurn.speaker === 'AI') {
        speakText(lastTurn.text);
      }
    }
  }, [turns, autoTTS]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;
    
    let submissionText = inputText;
    if (uploadedFile) {
      submissionText += `\n[Attached Evidence Document: ${uploadedFile.name}]`;
    }

    onSubmitTurn(submissionText);
    setInputText('');
    setUploadedFile(null);
    setTimeLeft(180); // Reset timer for next round
    // Re-focus input after submission
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const personaName = debate?.persona || 'Opponent';
  const roundCount = Math.floor(turns.length / 2) + 1;

  // Live Score Gauge calculations based on turns
  const userTurns = turns.filter(turn => turn.speaker === 'USER');
  const avgLogic = userTurns.length > 0 ? Math.round(userTurns.reduce((acc, turn) => acc + (turn.logic_score || 80), 0) / userTurns.length) : 85;
  const avgPersuasion = userTurns.length > 0 ? Math.round(userTurns.reduce((acc, turn) => acc + (turn.persuasion_score || 75), 0) / userTurns.length) : 80;
  const totalFallacies = userTurns.reduce((acc, turn) => acc + (turn.fallacies_detected?.length || 0), 0);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {debate?.is_mystery && (
        <div style={{ background: 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', padding: '10px', borderRadius: '12px', color: '#e9d5ff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <span>❓ Mystery Opponent</span>
        </div>
      )}
      {debate?.roleplay_context && (
        <div style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', padding: '10px', borderRadius: '12px', color: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <span>🎭 Scenario: {debate.roleplay_context}</span>
        </div>
      )}
      <ArenaHeader 
        debate={debate} 
        roundCount={roundCount} 
        timeLeft={timeLeft} 
        autoTTS={autoTTS} 
        setAutoTTS={setAutoTTS} 
        onFinishDebate={onFinishDebate} 
        onExitArena={onExitArena} 
        turnsLength={turns.length} 
        loading={loading} 
      />

      <ScorePanel 
        avgLogic={avgLogic} 
        avgPersuasion={avgPersuasion} 
        totalFallacies={totalFallacies} 
      />

      <ChatFeed 
        turns={turns} 
        loading={loading} 
        personaName={personaName} 
        chatEndRef={chatEndRef} 
        speakText={speakText} 
      />

      {/* Sticky Bottom Navigation / Input Area */}
      <div style={{
        position: 'sticky',
        bottom: '20px',
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '16px',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Input Form with Attachment & Voice Dictation */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '12px 16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)' }}>
          
          {uploadedFile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#818cf8', width: 'fit-content' }}>
              <FileText size={14} />
              <span>Attached Evidence: <strong>{uploadedFile.name}</strong></span>
              <button type="button" onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', marginLeft: '4px' }}>✕</button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* File Upload Button */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*,.pdf,.txt" 
              style={{ display: 'none' }} 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Upload Evidence Image or PDF"
            >
              <Paperclip size={18} />
            </button>

            <button
              type="button"
              onClick={() => setShowArgumentBuilder(true)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Argument Builder"
            >
              <FileText size={18} />
            </button>

            {/* Voice Dictation STT Toggle */}
            <button
              type="button"
              onClick={toggleListening}
              style={{
                background: isListening ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255,255,255,0.06)',
                border: isListening ? '1px solid #f43f5e' : '1px solid var(--border-color)',
                color: isListening ? '#f43f5e' : 'var(--text-muted)',
                padding: '10px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isListening ? "Listening... Click to Stop" : "Click to Speak (Voice Dictation)"}
            >
              {isListening ? <Mic size={18} className="pulse-glow" /> : <MicOff size={18} />}
            </button>

            {/* Text Input — AUTO-FOCUSED so user never needs to click */}
            <input 
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? (lang === 'ar' ? 'جارٍ الاستماع لصوتك...' : "Listening to your voice...") : t.arena_input_placeholder}
              disabled={loading}
              autoFocus
              maxLength={2000}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'inherit',
                padding: '4px 0'
              }}
            />

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={!inputText.trim() || loading}
              style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {loading ? <Loader className="spin" size={18} /> : <Send size={18} />}
              {loading ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'إرسال الرد' : 'Submit Turn')}
            </button>
          </div>
        </form>

        {/* Finish & Call AI Judge Button - moved to sticky bottom for easier access */}
        {turns.length >= 2 && (
          <button 
            type="button"
            className="btn-primary" 
            onClick={onFinishDebate}
            disabled={loading}
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              padding: '14px',
              borderRadius: '16px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}
          >
            {loading ? <Loader className="spin" size={20} /> : <Gavel size={20} />}
            {loading ? (lang === 'ar' ? 'جاري تقييم المناظرة...' : 'Evaluating Debate...') : (lang === 'ar' ? 'استدعاء حكم الذكاء الاصطناعي وتقييم المناظرة' : 'Call AI Judge & Score Debate')}
          </button>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          gap: '16px'
        }}>
          <Loader className="spin" size={48} color="#818cf8" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }} className="gradient-text">
            {lang === 'ar' ? 'جاري المعالجة بواسطة الذكاء الاصطناعي...' : 'AI is Processing...'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {lang === 'ar' ? 'الرجاء الانتظار بينما يقوم الخصم بالرد أو الحكم بالتقييم.' : 'Please wait while the opponent replies or the judge evaluates.'}
          </p>
        </div>
      )}

      {showArgumentBuilder && (
        <ArgumentBuilder 
          onClose={() => setShowArgumentBuilder(false)}
          onInsert={(text) => {
            setInputText((prev) => prev ? prev + '\n\n' + text : text);
          }}
          lang={lang}
        />
      )}

    </div>
  );
}

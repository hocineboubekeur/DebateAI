import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import DebateSetupModal from './components/DebateSetupModal';
import DebateArena from './components/DebateArena';
import DebateReplay from './components/DebateReplay';
import DebateVault from './components/DebateVault';
import DebateDNA from './components/DebateDNA';
import RhetoricLibrary from './components/RhetoricLibrary';
import CommunityFeed from './components/CommunityFeed';
import TournamentsPage from './components/TournamentsPage';
import AchievementsModal from './components/AchievementsModal';
import UserProfilePage from './components/UserProfilePage';
import AdminDashboard from './components/AdminDashboard';
import SaveProgressBanner from './components/SaveProgressBanner';
import VocabularyVault from './components/VocabularyVault';
import DebateSandbox from './components/DebateSandbox';
import OnboardingWizard from './components/OnboardingWizard';
import DebateTimeline from './components/DebateTimeline';
import GlobalDebateSearch from './components/GlobalDebateSearch';
import toast, { Toaster } from 'react-hot-toast';

import { debatesAPI, communityAPI } from './services/api';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { lang, toggleLanguage } = useLanguage();
  
  const [debates, setDebates] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Debate active state
  const [activeDebate, setActiveDebate] = useState(null);
  const [activeTurns, setActiveTurns] = useState([]);
  const [activeEvaluation, setActiveEvaluation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Guest tracking
  const isGuest = !localStorage.getItem('debateai_token');
  const [debatesWon, setDebatesWon] = useState(0);
  const [showSaveBanner, setShowSaveBanner] = useState(false);

  useEffect(() => {
    async function initData() {
      if (!isGuest) {
        try {
          const res = await debatesAPI.list();
          setDebates(res.data);
        } catch (err) {
          console.error("Failed to load debates", err);
        }
      }
    }
    initData();
  }, [isGuest, user]);

  const refreshDebates = async () => {
    if (!isGuest) {
      try {
        const res = await debatesAPI.list();
        setDebates(res.data);
      } catch (err) {}
    }
  };

  const handleStartDebate = async (config) => {
    setActionLoading(true);
    try {
      const res = await debatesAPI.create(config);
      const newDebate = res.data;
      setActiveDebate(newDebate);
      setActiveTurns(newDebate.turns || []);
      setActiveEvaluation(null);
      setIsSetupOpen(false);
      navigate('/arena');
      if (!isGuest) {
        try { refreshDebates(); } catch (e) {}
      }
    } catch (err) {
      console.error("Start debate error:", err);
      toast.error(lang === 'ar' ? "فشل تهيئة الحلبة. حاول مرة أخرى." : "Failed to initialize debate arena. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitTurn = async (text) => {
    if (!activeDebate) return;
    setActionLoading(true);
    try {
      const res = await debatesAPI.submitTurn(activeDebate.id, text, lang);
      const updatedTurns = [...activeTurns, res.data.user_turn, res.data.ai_turn];
      setActiveTurns(updatedTurns);
    } catch (err) {
      console.error("Submit turn error:", err);
      toast.error(lang === 'ar' ? "فشل إرسال الحجة. حاول مرة أخرى." : "Failed to submit argument. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinishDebate = async () => {
    if (!activeDebate) return;
    setActionLoading(true);
    try {
      const res = await debatesAPI.finish(activeDebate.id);
      setActiveDebate(res.data.debate);
      setActiveEvaluation(res.data.debate.evaluation);
      navigate('/replay');
      
      if (!isGuest) {
        try {
          refreshDebates();
          refreshUser();
        } catch (e) {}
      }

      // Show save progress banner for guest users after first win
      if (isGuest && res.data.debate?.winner === 'USER') {
        setDebatesWon(prev => prev + 1);
        setShowSaveBanner(true);
      }
    } catch (err) {
      console.error("Finish debate error:", err);
      toast.error(lang === 'ar' ? "فشل التقييم. حاول مرة أخرى." : "Failed to trigger judge evaluation. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectDebateForReplay = (debate) => {
    setActiveDebate(debate);
    setActiveTurns(debate.turns || []);
    setActiveEvaluation(debate.evaluation || null);
    navigate('/replay');
  };

  const handlePublishDebate = async () => {
    if (!activeDebate) return;
    try {
      await communityAPI.publish(activeDebate.id, activeDebate.topic, `Victory replay on topic: ${activeDebate.topic}`);
      toast.success(lang === 'ar' ? "تم النشر في مجتمع المناظرات بنجاح!" : "Debate successfully published to the Community Arena Feed!");
      navigate('/community');
    } catch (err) {
      console.error("Publish error:", err);
      toast.error(lang === 'ar' ? "فشل نشر المناظرة في المجتمع." : "Failed to publish debate to community.");
    }
  };

  const handleLoginSuccess = (profile, token) => {
    if (token) {
      localStorage.setItem('debateai_token', token);
      setShowSaveBanner(false);
    }
    refreshUser();
    refreshDebates();
  };

  if (authLoading) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      
      {user && !user.onboarding_completed && !isGuest && (
        <OnboardingWizard user={user} setUser={refreshUser} lang={lang} onComplete={refreshUser} />
      )}
      
      {/* Hide Navbar completely during active debate screen */}
      {location.pathname !== '/arena' && (
        <Navbar 
          activeTab={location.pathname.substring(1) || 'dashboard'} 
          setActiveTab={(tab) => navigate(`/${tab}`)} 
          user={user}
          isLoggedIn={!isGuest}
          lang={lang}
          setLang={toggleLanguage}
          onStartNewDebate={() => setIsSetupOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={() => {
            localStorage.removeItem('debateai_token');
            window.location.href = '/';
          }}
        />
      )}

      {/* Main Content View Router */}
      <main style={{ flex: 1, paddingTop: location.pathname === '/arena' ? '24px' : '16px' }}>
        <Routes>
          <Route path="/" element={
            isGuest ? <LandingPage onStartDebating={() => setIsSetupOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} lang={lang} /> : <Navigate to="/dashboard" />
          } />
          
          <Route path="/dashboard" element={
            <Dashboard 
              user={user} 
              debates={debates}
              onStartNewDebate={() => setIsSetupOpen(true)}
              onSelectDebate={handleSelectDebateForReplay}
              setActiveTab={(tab) => navigate(`/${tab}`)}
              lang={lang}
            />
          } />
          
          <Route path="/arena" element={
            activeDebate ? (
              <DebateArena 
                debate={activeDebate}
                turns={activeTurns}
                onSubmitTurn={handleSubmitTurn}
                onFinishDebate={handleFinishDebate}
                onExitArena={() => navigate('/dashboard')}
                loading={actionLoading}
                lang={lang}
              />
            ) : <Navigate to="/dashboard" />
          } />
          
          <Route path="/replay" element={
            activeDebate ? (
              <DebateReplay 
                debate={activeDebate}
                evaluation={activeEvaluation}
                onBack={() => navigate('/dashboard')}
                onPublish={handlePublishDebate}
                lang={lang}
              />
            ) : <Navigate to="/dashboard" />
          } />
          
          <Route path="/vault" element={
            <DebateVault debates={debates} onSelectDebate={handleSelectDebateForReplay} lang={lang} />
          } />
          
          <Route path="/dna" element={<DebateDNA lang={lang} />} />
          
          <Route path="/sandbox" element={<DebateSandbox lang={lang} />} />
          
          <Route path="/vocabulary" element={<VocabularyVault lang={lang} />} />
          
          <Route path="/library" element={
            <RhetoricLibrary 
              onRewardXP={(amount) => {
                refreshUser();
              }}
              lang={lang}
            />
          } />
          
          <Route path="/community" element={
            <CommunityFeed onSelectDebate={handleSelectDebateForReplay} lang={lang} />
          } />
          
          <Route path="/tournaments" element={<TournamentsPage lang={lang} />} />
          
          <Route path="/achievements" element={<AchievementsModal lang={lang} />} />
          
          <Route path="/profile" element={
            <UserProfilePage 
              user={user} 
              onUserUpdate={refreshUser} 
              onOpenAuth={() => setIsAuthOpen(true)} 
              lang={lang} 
            />
          } />
          
          <Route path="/admin" element={<AdminDashboard user={user} lang={lang} />} />
          
          <Route path="/timeline" element={<DebateTimeline lang={lang} />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Save Progress Banner — shows for guest users after first win */}
      {showSaveBanner && isGuest && (
        <SaveProgressBanner 
          onSignUp={() => { setShowSaveBanner(false); setIsAuthOpen(true); }}
          onDismiss={() => setShowSaveBanner(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Debate Setup Modal */}
      <DebateSetupModal 
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartDebate={handleStartDebate}
        loading={actionLoading}
        lang={lang}
      />

      <GlobalDebateSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectDebate={handleSelectDebateForReplay}
        lang={lang}
      />
    </div>
  );
}

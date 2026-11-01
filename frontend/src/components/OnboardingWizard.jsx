import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { CheckCircle2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
  { id: 1, en: 'Experience Level', ar: 'مستوى الخبرة' },
  { id: 2, en: 'Debate Interests', ar: 'اهتمامات النقاش' },
  { id: 3, en: 'Learning Goals', ar: 'أهداف التعلم' },
  { id: 4, en: 'Favorite Personas', ar: 'الشخصيات المفضلة' },
];

const experienceOptions = [
  { id: 'NOVICE', title: 'Novice', title_ar: 'مبتدئ', desc: 'New to formal debate and rhetoric principles', desc_ar: 'جديد في المناظرات البلاغية والمنطقية', icon: '🌱' },
  { id: 'INTERMEDIATE', title: 'Competitor', title_ar: 'منافس', desc: 'Familiar with arguments and logical fallacies', desc_ar: 'على دراية بالحجج والمغالطات المنطقية', icon: '⚔️' },
  { id: 'ADVANCED', title: 'Master Debater', title_ar: 'خبير بلاغي', desc: 'Experienced in competitive debates & courtroom rhetoric', desc_ar: 'ذو خبرة عالية في المناظرات التنافسية والبلاغة', icon: '👑' },
];

const interestOptions = [
  { id: 'tech', label: 'Tech & AI Ethics', label_ar: 'الذكاء الاصطناعي والتقنية', icon: '🤖' },
  { id: 'law', label: 'Law & Justice', label_ar: 'القانون والعدالة', icon: '⚖️' },
  { id: 'science', label: 'Climate & Science', label_ar: 'العلوم والمناخ', icon: '🌍' },
  { id: 'politics', label: 'Politics & Policy', label_ar: 'السياسة والحوكمة', icon: '🏛️' },
  { id: 'ethics', label: 'Ethics & Philosophy', label_ar: 'الأخلاق والفلسفة', icon: '🧠' },
];

const goalOptions = [
  { id: 'fallacies', label: 'Spot Logical Fallacies Instantly', label_ar: 'كشف المغالطات المنطقية فوراً', icon: '🎯' },
  { id: 'rebuttal', label: 'Improve Rebuttal Speed Under Pressure', label_ar: 'تسريع سرعة الرد تحت الضغط', icon: '⚡' },
  { id: 'structure', label: 'Build Structured Empirical Arguments', label_ar: 'بناء حجج هيكلية مدعومة بأدلة', icon: '📐' },
  { id: 'rhetoric', label: 'Master Socratic & Formal Rhetoric', label_ar: 'إتقان البلاغة السقراطية والرسيمة', icon: '📜' },
];

const personaOptions = [
  { id: 'LAWYER', label: 'The Lawyer', label_ar: 'المحامي', desc: 'Sharp legal definitions & burdens of proof', desc_ar: 'أدلة قاطعة وحجج قانونية', icon: '⚖️' },
  { id: 'SCIENTIST', label: 'The Scientist', label_ar: 'العالم', desc: 'Empirical data & statistical consensus', desc_ar: 'أدلة تجريبية وبيانات علمية', icon: '🔬' },
  { id: 'PHILOSOPHER', label: 'The Philosopher', label_ar: 'الفيلسوف', desc: 'Epistemological bounds & Socratic rigor', desc_ar: 'تأمل سقراطي وتفكيك المفاهيم', icon: '🧠' },
  { id: 'SOCRATES', label: 'Socrates', label_ar: 'سقراط', desc: 'Relentless questioning & definition checks', desc_ar: 'أسئلة حادة لتفكيك الافتراضات', icon: '🏛️' },
];

export default function OnboardingWizard({ user, setUser, lang = 'en', onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    experience_level: 'INTERMEDIATE',
    interests: ['tech', 'ethics'],
    primary_goals: ['fallacies', 'rebuttal'],
    favorite_personas: ['LAWYER', 'SOCRATES']
  });

  const isAr = lang === 'ar';

  const toggleArrayItem = (key, value) => {
    setFormData(prev => {
      const list = prev[key] || [];
      const exists = list.includes(value);
      return {
        ...prev,
        [key]: exists ? list.filter(i => i !== value) : [...list, value]
      };
    });
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleComplete = async () => {
    try {
      const { data } = await authAPI.completeOnboarding(formData);
      setUser(data);
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Onboarding failed', err);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isAr ? 'تخصيص مسار التعلم' : 'Personalize Your Debate Path'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr ? `الخطوة ${currentStep} من 4: ${steps[currentStep-1].ar}` : `Step ${currentStep} of 4: ${steps[currentStep-1].en}`}
              </p>
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {steps.map(s => (
              <div key={s.id} className={`h-2 rounded-full transition-all duration-300 ${s.id === currentStep ? 'w-6 bg-indigo-500' : s.id < currentStep ? 'w-2 bg-indigo-800' : 'w-2 bg-slate-800'}`} />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 mb-6">
          {currentStep === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-300 font-medium mb-2">
                {isAr ? 'ما هو مستواك الحالي في المناظرات؟' : 'What is your current debate experience?'}
              </p>
              {experienceOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, experience_level: opt.id })}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all ${formData.experience_level === opt.id ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'}`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-base">{isAr ? opt.title_ar : opt.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{isAr ? opt.desc_ar : opt.desc}</div>
                  </div>
                  {formData.experience_level === opt.id && <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-300 font-medium mb-2">
                {isAr ? 'اختر المواضيع التي ترغب في مناظرتها (اختر أكثر من واحد):' : 'Select topics you want to debate (choose multiple):'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interestOptions.map(opt => {
                  const selected = formData.interests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleArrayItem('interests', opt.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${selected ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'}`}
                    >
                      <span className="flex items-center gap-2.5 font-medium text-sm">
                        <span>{opt.icon}</span>
                        {isAr ? opt.label_ar : opt.label}
                      </span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-300 font-medium mb-2">
                {isAr ? 'ما هي أهدافك الرئيسية في تطوير المهارات؟' : 'What are your primary skill improvement goals?'}
              </p>
              {goalOptions.map(opt => {
                const selected = formData.primary_goals.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleArrayItem('primary_goals', opt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${selected ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'}`}
                  >
                    <span className="flex items-center gap-3 font-medium text-sm">
                      <span>{opt.icon}</span>
                      {isAr ? opt.label_ar : opt.label}
                    </span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-300 font-medium mb-2">
                {isAr ? 'اختر شخصيات الذكاء الاصطناعي المفضلة لديك:' : 'Select your favorite AI debate opponents:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personaOptions.map(opt => {
                  const selected = formData.favorite_personas.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleArrayItem('favorite_personas', opt.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${selected ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'}`}
                    >
                      <span className="text-xl mt-0.5">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{isAr ? opt.label_ar : opt.label}</div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">{isAr ? opt.desc_ar : opt.desc}</div>
                      </div>
                      {selected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${currentStep === 1 ? 'opacity-40 cursor-not-allowed text-slate-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {isAr ? 'السابق' : 'Back'}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-colors"
            >
              {isAr ? 'التالي' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {isAr ? 'بدء رحلة المناظرات' : 'Launch Debate Path'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { BookOpen, HelpCircle, CheckCircle, Award, Sparkles, Lightbulb, Target, Brain, LayoutTemplate } from 'lucide-react';

export const STRATEGIES_EN = [
  { title: "Opening Strong", icon: <Target size={24} color="#f43f5e" />, description: "How to frame your thesis in the first 2 sentences to establish authority.", proTip: "A strong hook immediately captures attention and sets the tone." },
  { title: "Steel-Manning", icon: <Brain size={24} color="#8b5cf6" />, description: "Present the strongest version of your opponent's argument before dismantling it.", proTip: "Demonstrates intellectual honesty and makes your rebuttal devastating." },
  { title: "Socratic Method", icon: <HelpCircle size={24} color="#06b6d4" />, description: "Guide opponents to contradictions through strategic questioning.", proTip: "Ask questions that lead them to admit their own logical flaws." },
  { title: "Rebuttal Tactics", icon: <Lightbulb size={24} color="#eab308" />, description: "Address the opponent's strongest point first, then weaken secondary claims.", proTip: "Taking down the strongest pillar often causes the rest to collapse." },
  { title: "Evidence Anchoring", icon: <BookOpen size={24} color="#10b981" />, description: "Lead with data, statistics, or precedent to ground your position.", proTip: "Hard facts create a solid foundation that is difficult to dispute emotionally." },
  { title: "Closing Arguments", icon: <Award size={24} color="#f59e0b" />, description: "Summarize, restate thesis, and deliver a memorable final line.", proTip: "Your last words are often the only ones the audience truly remembers." },
  { title: "Emotional Intelligence", icon: <Sparkles size={24} color="#ec4899" />, description: "Read the tone and adapt your rhetorical approach.", proTip: "Matching or strategically contrasting tone can win over a hostile room." },
  { title: "Toulmin Model", icon: <LayoutTemplate size={24} color="#6366f1" />, description: "Structure arguments as Claim → Grounds → Warrant → Backing → Qualifier → Rebuttal.", proTip: "Use this mental checklist to ensure no gap exists in your logic." }
];

export const STRATEGIES_AR = [
  { title: "الافتتاح القوي والجاذب", icon: <Target size={24} color="#f43f5e" />, description: "كيفية صياغة أطروحتك في أول جملتين لتثبيت سلطتك البلاغية.", proTip: "الافتتاح الساحر يجذب انتباه الجمهور فوراً ويحدد مسار الحوار." },
  { title: "بناء حجة الند (Steel-Manning)", icon: <Brain size={24} color="#8b5cf6" />, description: "تقديم أقوى صورة ممكنة لحجة الخصم قبل تفكيكها وتفنيدها.", proTip: "يظهر النزاهة الفكرية ويجعل ردك الحاسم لا يُرد." },
  { title: "المنهج السقراطي في الحوار", icon: <HelpCircle size={24} color="#06b6d4" />, description: "توجيه الخصم إلى التناقض الذاتي من خلال الأسئلة الاستكشافية الذكية.", proTip: "اطرح أسئلة تقودهم للاعتراف بأخطائهم المنطقية بأنفسهم." },
  { title: "تكتيكات التفنيد والدحض", icon: <Lightbulb size={24} color="#eab308" />, description: "معالجة أقوى نقاط الخصم أولاً، ثم إضعاف الأدلة الثانوية.", proTip: "إسقاط العمود الفقري لحجة الخصم يؤدي لانهيار بقية كلامه تلقائياً." },
  { title: "الترسيخ بالأدلة والبينات", icon: <BookOpen size={24} color="#10b981" />, description: "البدء بالبيانات والإحصائيات والسوابق لترسيخ موقفك المنطقي.", proTip: "الستار الحقائقي يثبت منطقك ويصعب دحضه بالعاطفة." },
  { title: "الخاتمة الحاسمة والملهمة", icon: <Award size={24} color="#f59e0b" />, description: "تلخيص الحجج، إعادة تأكيد الأطروحة، وإلقاء جملة ختامية لا تُنسى.", proTip: "كلماتك الأخيرة هي غالباً ما يرتسخ في ذهن القاضي والجمهور." },
  { title: "الذكاء العاطفي والبلاغي", icon: <Sparkles size={24} color="#ec4899" />, description: "قراءة نبرة القاعة والتكيف معها بلاغياً.", proTip: "التناغم الذكي مع المشاعر يربح القضاة الأكثر تشككاً." },
  { title: "نموذج تولمين للحجاج", icon: <LayoutTemplate size={24} color="#6366f1" />, description: "هيكلة الحجة: الإدعاء ← البينات ← الضمان ← الدعم ← التقييد ← الرد.", proTip: "استخدم هذا المنهج لضمان عدم وجود أي ثغرة في منطقك." }
];

export const FAMOUS_DEBATES_EN = [
  { title: "Lincoln-Douglas", year: "1858", topic: "Slavery & democracy", context: "A series of seven debates between Abraham Lincoln and Stephen A. Douglas for the US Senate seat in Illinois.", takeaway: "Moral framing wins public opinion.", technique: "Moral Framing" },
  { title: "Scopes Trial", year: "1925", topic: "Evolution vs creationism", context: "The State of Tennessee v. John Thomas Scopes trial testing a law forbidding teaching human evolution.", takeaway: "Expert testimony shapes perception.", technique: "Evidence Anchoring" },
  { title: "Kennedy-Nixon", year: "1960", topic: "First televised debate", context: "The first ever televised presidential debate. Optics and body language defined public perception.", takeaway: "Visual presence matters as much as words.", technique: "Optics & Presentation" },
  { title: "Chomsky-Foucault", year: "1971", topic: "Human nature & politics", context: "A televised debate between Noam Chomsky and Michel Foucault about whether human nature is innate.", takeaway: "Define terms early to control scope.", technique: "Term Definition" },
  { title: "Hart-Devlin", year: "1960s", topic: "Law & morality", context: "An exchange between H.L.A. Hart and Lord Devlin regarding whether law should enforce moral norms.", takeaway: "Distinguish legal and moral arguments.", technique: "Categorical Distinction" },
  { title: "Rawls-Nozick", year: "1970s", topic: "Justice & fairness", context: "Debate on distributive justice between John Rawls and Robert Nozick.", takeaway: "Thought experiments test edge cases.", technique: "Thought Experiments" }
];

export const FAMOUS_DEBATES_AR = [
  { title: "مناظرة لينكون ودوجلاس", year: "1858", topic: "العبودية والديمقراطية", context: "سلسلة من سبع مناظرات بين أبراهام لينكون وستيفن دوجلاس شكلت النقاش الوطني حول الحرية والديمقراطية.", takeaway: "التأطير الأخلاقي يكسب الرأي العام.", technique: "التأطير الأخلاقي" },
  { title: "محاكمة سكوبس (محاكمة القرد)", year: "1925", topic: "التطور ضد الخلق", context: "محاكمة تاريخية حظيت باهتمام عالمي تختبر قانون حظر تدريس نظرية التطور البشري.", takeaway: "شهادات الخبراء تملي التصورات.", technique: "الترسيخ بالأدلة" },
  { title: "مناظرة كينيدي ونيكسون", year: "1960", topic: "أول مناظرة رئاسية متلفزة", context: "أول مناظرة رئاسية عبر الشاشة التلفزيونية حيث لعب الكاريزما والحضور البصري دوراً حاسماً.", takeaway: "الحضور البصري لا يقل أهمية عن الكلمات.", technique: "البلاغة البصرية" },
  { title: "مناظرة تشومسكي وفوكو", year: "1971", topic: "الطبيعة البشرية والسياسة", context: "مناظرة شهيرة بين العالم نعوم تشومسكي والفيلسوف ميشيل فوكو حول الفطرة البشرية.", takeaway: "تحديد المفاهيم مبكراً يضمن التحكم بالمناظرة.", technique: "تحرير محل النزاع" },
  { title: "مناظرة هارت وديفلين", year: "1960s", topic: "القانون والأخلاق", context: "نقاش فكري حول مدى حق القانون في فرض المعايير الأخلاقية على الأفراد.", takeaway: "الفصل الحاسم بين الحجة القانونية والأخلاقية.", technique: "التمييز الفئوي" },
  { title: "مناظرة رولز ونوزيك", year: "1970s", topic: "العدالة التوزيعية والحرية", context: "حوار فلسفي بين جون رولز وروبيرت نوزيك حول مفهوم العدالة والإنصاف في المجتمع.", takeaway: "التجارب الذهنية تختبر الحالات الحرجية.", technique: "التجارب الذهنية" }
];

export const TEMPLATES_EN = [
  { title: "Classical (Ciceronian)", steps: ["Exordium (Hook)", "Narratio (Context)", "Confirmatio (Proof)", "Refutatio (Rebuttal)", "Peroratio (Conclusion)"], description: "The gold standard of formal classical rhetoric perfected by Cicero." },
  { title: "Toulmin Framework", steps: ["Claim (Thesis)", "Grounds (Evidence)", "Warrant (Logic Bridge)", "Backing (Support)", "Qualifier (Nuance)", "Rebuttal (Counter)"], description: "Best for analytical, policy, and scientific arguments." },
  { title: "Rogerian Compromise", steps: ["Introduction", "Opponent's View", "Your Position", "Common Ground", "Win-Win Proposal"], description: "Best for resolving hostile conflicts and polarized debates." },
  { title: "SEEC Structure", steps: ["Statement", "Evidence", "Explanation", "Connection"], description: "Punchy, fast-paced 4-step framework for rapid counter-arguments." }
];

export const TEMPLATES_AR = [
  { title: "النموذج الكلاسيكي (الخطابة الخطابية)", steps: ["المقدمة والتمهيد", "سرد الوقائع والخلفية", "الإثبات والتأكيد", "التفنيد والدحض", "الخاتمة والتوصية"], description: "المعيار الذهبي للبلاغة الفصيحة الكلاسيكية." },
  { title: "نموذج تولمين التحليلي", steps: ["الأطروحة (الادعاء)", "الأدلة (البينات)", "الضمان (الجسر المنطقي)", "الدعم والإسناد", "التقييد والتحديد", "الرد والدحض"], description: "أفضل قالب للمناظرات العلمية والسياسية التحليلية." },
  { title: "النموذج الروجيلي للتوافق", steps: ["المقدمة", "عرض وجهة نظر الخصم", "عرض موقفك الخاص", "أرضية التوافق المشترك", "مقترح الحل العادل"], description: "أفضل قالب لحل النزاعات الحادة وبناء أرضية مشتركة." },
  { title: "قالب SEEC السريع", steps: ["التصريح (البيان)", "الدليل (الإثبات)", "الشرح (التوضيح)", "الربط (الاتصال)"], description: "هيكل سريع ومباشر مكون من 4 خطوات مخصصة للردود السريعة." }
];

export const BOOKS_EN = [
  {
    title: "Aristotle's Rhetoric",
    author: "Aristotle",
    year: "350 BCE",
    focus: "Ethos, Pathos, Logos",
    summary: "The foundational text on the art of persuasion. Aristotle systematically categorizes the modes of persuasion into ethical, emotional, and logical appeals.",
    takeaways: [
      "Ethos: Establish credibility and moral character.",
      "Pathos: Connect with the audience's emotions.",
      "Logos: Build logical arguments and proofs."
    ],
    notes: "Detailed chapter notes for Aristotle's Rhetoric: \n\n- Book I: Defines rhetoric and its relationship to dialectic. Explores deliberative, forensic, and epideictic genres.\n- Book II: Analyzes emotions (anger, calmness, fear) and how to evoke them strategically.\n- Book III: Discusses style, metaphor, and 4-part arrangement (proem, statement, argument, epilogue)."
  },
  {
    title: "The Art of Being Right",
    author: "Arthur Schopenhauer",
    year: "1831",
    focus: "Dialectical Stratagems",
    summary: "A cynical and pragmatic guide to winning arguments regardless of objective truth. Schopenhauer outlines 38 specific rhetorical tricks and fallacies.",
    takeaways: [
      "Truth is secondary to victory in eristic dialectic.",
      "Anticipate and deploy fallacies to destabilize opponents.",
      "Use anger and distraction as tactical weapons."
    ],
    notes: "Detailed chapter notes for The Art of Being Right: \n\n- Stratagem 1: Extension (exaggerate the opponent's premise to attack easier).\n- Stratagem 8: Make your opponent angry, as anger clouds judgment.\n- Stratagem 18: Divert the dispute if losing.\n- Stratagem 38: Become personal and insulting (ad personam) as a last resort."
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: "2011",
    focus: "Cognitive Biases",
    summary: "A groundbreaking exploration of System 1 (fast, intuitive) and System 2 (slow, analytical) thinking and the cognitive biases shaping human debate.",
    takeaways: [
      "System 1 relies on heuristics and is prone to systematic errors.",
      "System 2 requires effort and is often lazy.",
      "Anchoring and Availability biases heavily bias arguments."
    ],
    notes: "Detailed chapter notes for Thinking, Fast and Slow: \n\n- Part 1: Two Systems - dichotomy of mind and jumping to conclusions.\n- Part 2: Heuristics & Biases - anchoring, availability, representativeness.\n- Part 3: Overconfidence & narrative fallacies.\n- Part 4: Prospect Theory and loss aversion."
  },
  {
    title: "The Demon-Haunted World",
    author: "Carl Sagan",
    year: "1995",
    focus: "Scientific Skepticism",
    summary: "A passionate defense of science and reason. Sagan provides a 'Baloney Detection Kit' to evaluate claims critically and spot logical fallacies.",
    takeaways: [
      "Extraordinary claims require extraordinary evidence.",
      "Always seek independent confirmation of facts.",
      "Avoid ad hominem, straw man, and false dichotomy."
    ],
    notes: "Detailed chapter notes for The Demon-Haunted World: \n\n- Chapter 10: Dragon in My Garage - unfalsifiable claims.\n- Chapter 12: Baloney Detection Kit - Occam's Razor, quantifying claims, independent checking.\n- Chapter 25: Skepticism as a cornerstone of democratic freedoms."
  },
  {
    title: "Informal Logic: A Pragmatic Approach",
    author: "Douglas Walton",
    year: "2008",
    focus: "Dialogue-based Evaluation",
    summary: "A comprehensive guide to evaluating arguments in everyday contexts based on presumption, burden of proof, and pragmatic dialogue goals.",
    takeaways: [
      "Arguments must be judged within their specific dialogue context.",
      "Presumption and burden of proof are critical dynamic elements.",
      "Appeals to expert opinion require verification."
    ],
    notes: "Detailed chapter notes for Informal Logic: \n\n- Chapter 1: Argument as Dialogue - persuasion, inquiry, negotiation.\n- Chapter 3: Appeals to Emotion - legitimate vs fallacious emotional appeals.\n- Chapter 6: Ad Hominem Variants - abusive, circumstantial, poisoning the well."
  },
  {
    title: "A Rulebook for Arguments",
    author: "Anthony Weston",
    year: "2018",
    focus: "Writing & Assessing Claims",
    summary: "A concise and practical manual for constructing and evaluating short arguments, essay arguments, and oral presentations.",
    takeaways: [
      "Start from reliable premises and build logically.",
      "Use concrete, specific, and definite language.",
      "Consider alternative explanations and counterarguments."
    ],
    notes: "Detailed chapter notes for A Rulebook for Arguments: \n\n- Chapter 1: Short Arguments - premises vs conclusions.\n- Chapter 4: Arguments from Authority - source credibility criteria.\n- Chapter 6: Deductive Arguments - Modus Ponens, Modus Tollens, Disjunctive Syllogism."
  },
  {
    title: "The Uses of Argument",
    author: "Stephen Toulmin",
    year: "1958",
    focus: "Argument Structure",
    summary: "A revolutionary work proposing a pragmatic model for analyzing arguments: Claim, Data, Warrant, Backing, Qualifier, Rebuttal.",
    takeaways: [
      "Arguments are structurally similar to legal jurisprudence.",
      "Warrants bridge the gap between data and claims.",
      "Qualifiers and rebuttal conditions add necessary nuance."
    ],
    notes: "Detailed chapter notes for The Uses of Argument: \n\n- Chapter 1: Fields of Argument - standards vary by law, science, ethics.\n- Chapter 3: The 6-part Toulmin layout of arguments.\n- Chapter 5: Critique of absolute formal logic certainty."
  },
  {
    title: "Attacking Faulty Reasoning",
    author: "T. Edward Damer",
    year: "2012",
    focus: "Fallacy-by-fallacy Breakdown",
    summary: "A practical textbook dedicated to identifying and refuting logical fallacies based on structural validity, relevance, and acceptability.",
    takeaways: [
      "A good argument satisfies Relevance and Acceptability principles.",
      "Identify the specific structural violation to target fallacies.",
      "Construct a clean rebuttal targeting structural flaws."
    ],
    notes: "Detailed chapter notes for Attacking Faulty Reasoning: \n\n- Chapter 2: Criteria of a Good Argument.\n- Chapter 4: Fallacies violating Relevance (ad hominem, genetic fallacy).\n- Chapter 6: Fallacies violating Sufficiency (hasty generalization, false dilemma)."
  }
];

export const BOOKS_AR = [
  {
    title: "خطابة أرسطو (Rhetoric)",
    author: "أرسطو طاليس",
    year: "350 قبل الميلاد",
    focus: "الإيثوس، الباثوس، اللوجوس",
    summary: "النص التأسيسي الأكبر في تاريخ البلاغة الذي يصنف ركائز الإقناع إلى أخلاقية، عاطفية، ومنطقية.",
    takeaways: [
      "الإيثوس: إثبات مصداقية المتحدث والمكانة الأخلاقية.",
      "الباثوس: الاتصال الوجداني والعاطفي مع الجمهور.",
      "اللوجوس: بناء الاستدلالات البلاغية والمنطقية."
    ],
    notes: "ملاحظات وتلخيص كتاب خطابة أرسطو: \n\n- الكتاب الأول: تعريف البلاغة وعلاقتها بالجدل وأقسامها الثلاثة (التداولي، القضائي، والاحتفالي).\n- الكتاب الثاني: تحليل المشاعر (الغيظ، الطمأنينة، الخوف) وكيفية إثارتها بلاغياً.\n- الكتاب الثالث: الأسلوب والاستعارة والهيكل الأرباعي (المقدمة، البيان، الحجة، الخاتمة)."
  },
  {
    title: "فن أن تكون دائماً على صواب",
    author: "آرثر شوبنهاور",
    year: "1831",
    focus: "38 حيلة ومناورة بلاغية",
    summary: "دليل عملي تحليلي يدرس 38 حيلة وتكتيكاً للفوز بالمناظرة بغض النظر عن الحقيقة الموضوعية.",
    takeaways: [
      "الحقيقة ثانوية أمام الفوز في الجدل المغالطي.",
      "توقع الحيل المغالطة واستخدامها لخلخلة خصمك.",
      "استخدام الاستفزاز والتشتيت كتكتيكات دفاعية."
    ],
    notes: "تفاصيل حيل شوبنهاور الـ 38: \n\n- الحيلة 1: التعميم المبالغ فيه لتسهيل ضرب الحجة.\n- الحيلة 8: إغضاب الخصم لأن الغضب يربك التفكير.\n- الحيلة 18: قطع المناظرة وتغيير الموضوع عند الشعور بالخسارة.\n- الحيلة 38: الشخصنة والجموح للإهانة (Ad Personam) كحل الأخير."
  },
  {
    title: "التفكير، السريع والبطيء",
    author: "دانيال كانمان",
    year: "2011",
    focus: "النظام 1 مقابل النظام 2",
    summary: "دراسة ثورية للنظامين اللذين يديران تفكير الإنسان: النظام 1 (سريع وتلقائي) والنظام 2 (بطيء وتحليلي).",
    takeaways: [
      "النظام 1 يعتمد على الاختصارات الذهنية وعرضة للأخطاء.",
      "النظام 2 يتطلب مجهوداً وغالباً ما يكون كسولاً.",
      "انحياز الترسيخ والانحياز المتاح يؤثران على المناظرات."
    ],
    notes: "ملاحظات تفصيلية لكتاب دانيال كانمان: \n\n- الجزء 1: ثنائية العقل والقفز إلى النتائج.\n- الجزء 2: الانحيازات والاختصارات الذهنية.\n- الجزء 3: الثقة الزائدة ومغالطة السرد القصصي.\n- الجزء 4: نظرية التوقع وتجنب الخسارة."
  },
  {
    title: "عالم تسكنه الشياطين",
    author: "كارل ساغان",
    year: "1995",
    focus: "عدّة كشف الخزعبلات والمغالطات",
    summary: "دفاع عن التفكير العلمي النقدي يقدم أدوات كشف الادعاءات الزائفة والمغالطات المنطقية.",
    takeaways: [
      "الادعاءات الاستثنائية تتطلب أدلة استثنائية.",
      "المطالبة دائماً بالتحقق المستقل من الوقائع.",
      "تجنب الشخصنة، ورجل القش، والخيارات الزائفة."
    ],
    notes: "تفاصيل كتاب كارل ساغان: \n\n- الفصل 10: التنين في مرآبي (الادعاءات غير القابلة للإبطال).\n- الفصل 12: عدّة كشف الخزعبلات (شفرة أوكام، تكميم الكميات، الاختبار المستقل).\n- الفصل 25: التفكير النقدي كركيزة للحريات الديمقراطية."
  },
  {
    title: "المنطق غير الصوري: منهج pragmatics",
    author: "دوغلاس والتون",
    year: "2008",
    focus: "تقييم الحوار والسياق",
    summary: "دليل شامل لتقييم الحجج في الحياة اليومية بناءً على سياق الحوار وعبء الإثبات.",
    takeaways: [
      "الحجة تقيم بناءً على سياق الحوار المحدد.",
      "عبء الإثبات والافتراض ركيزتان ديناميكيتان.",
      "الاستدلال بالخبراء يحتاج للتحقق والتثبت."
    ],
    notes: "تفاصيل كتاب دوغلاس والتون: \n\n- الفصل 1: الحوار وأنواعه (الإقناع، الاستكشاف، التفاوض).\n- الفصل 3: الاستدلال بالعاطفة المبرر والمغالطي.\n- الفصل 6: مغالطة الشخصنة وتفرعاتها المتعددة."
  },
  {
    title: "دليل قواعد الحجج والبينات",
    author: "أنثوني ويستون",
    year: "2018",
    focus: "بناء الادعاءات وتفنيدها",
    summary: "كتيب عملي لبناء وتقييم الحجج القصيرة والمقالات التحليلية والعروض الشفهية بصارمة منطقية.",
    takeaways: [
      "البدء من مقدمات موثوقة والبناء المنطقي.",
      "استخدام لغة محددة ودقيقة ومباشرة.",
      "مراعاة التفسيرات البديلة والحجج المضادة."
    ],
    notes: "تفاصيل كتاب أنثوني ويستون: \n\n- الفصل 1: الحجج القصيرة والفرق بين المقدمات والنتائج.\n- الفصل 4: الحجج المبنية على السلطة والمعايير.\n- الفصل 6: الحجج الاستنباطية وقواعد قياس المنطق."
  },
  {
    title: "استخدامات الحجة والمنطق",
    author: "ستيفن تولمين",
    year: "1958",
    focus: "هيكل تولمين التحليلي",
    summary: "عمل ثوري يقدم نموذجاً عملياً لتحليل الحجج: الادعاء، البينات، الضمان، الإسناد، التقييد، والرد.",
    takeaways: [
      "الحجج تشبه هيكلياً المرافعة القانونية.",
      "الضمان يربط الفجوة بين البيانات والادعاء.",
      "التقييد والاستثناء يضيفان دقة علمية للحجة."
    ],
    notes: "ملاحظات تفصيلية لكتاب ستيفن تولمين: \n\n- الفصل 1: مجالات الحجاج واختلاف المعايير.\n- الفصل 3: نموذج تولمين السداسي للهيكلة.\n- الفصل 5: نقد اليقين المطلق في المنطق الصوري."
  },
  {
    title: "مهاجمة التفكير الفاسد والمغالطات",
    author: "تـ. إدوارد دامر",
    year: "2012",
    focus: "تفكيك المغالطات واحدة تلو الأخرى",
    summary: "كتاب عملي مخصص لتحديد ودحض المغالطات بناءً على معايير الحجة الصالحة.",
    takeaways: [
      "الحجة الصالحة تلبي مبدأ الصلة ومبدأ القبول.",
      "تحديد الانتهاك الهيكلي لضرب المغالطة.",
      "بناء رد مباشر يستهدف الثغرة الهيكلية."
    ],
    notes: "تفاصيل كتاب إدوارد دامر: \n\n- الفصل 2: معايير الحجة الجيدة الصالحة.\n- الفصل 4: مغالطات تنتهك مبدأ الصلة والارتباط.\n- الفصل 6: مغالطات تنتهك مبدأ الكفاية والشمول."
  }
];

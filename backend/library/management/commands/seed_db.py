from django.core.management.base import BaseCommand
from achievements.models import Achievement
from library.models import FallacyArticle, QuizQuestion

DEFAULT_ACHIEVEMENTS = [
    ("FIRST_DEBATE", "First Words", "Completed your very first debate.", "BEGINNER", "Award", False, 50, 100),
    ("WINNER", "Mind Changer", "Won your first debate against an AI opponent.", "WINNING", "Trophy", False, 100, 200),
    ("LOGIC_MASTER", "Sherlock Holmes", "Scored 90+ in Logic during a formal debate.", "EVIDENCE", "Zap", False, 150, 300),
    ("DEVILS_SURVIVOR", "Devil's Survivor", "Survived 5 rounds against Devil's Advocate persona.", "PERSONAS", "Shield", False, 200, 400),
    ("SECRET_PHOENIX", "Phoenix Redemption", "Recovered from a low score to win the debate.", "SECRET", "Flame", True, 250, 500),
    ("STREAK_3", "Streak Master", "Maintained a 3-day consecutive debate streak.", "CONSISTENCY", "Flame", False, 100, 150),
    ("SOCRATIC_WIN", "Socratic Scholar", "Won a debate using Socratic Questioning style.", "STYLE", "BookOpen", False, 120, 250),
    ("QUIZ_ACE", "Quiz Champion", "Answered 5 library quiz questions correctly.", "LEARNING", "CheckCircle2", False, 80, 120),
    ("COMMUNITY_PUB", "Community Star", "Published your first debate to the Community Arena.", "SOCIAL", "Share2", False, 75, 100),
    ("EVIDENCE_PRO", "Evidence Expert", "Uploaded evidence documents in 3 different debates.", "EVIDENCE", "FileText", False, 100, 200),
    ("FALLACY_SPOTTER", "Fallacy Spotter", "Triggered 0 fallacy warnings across an entire debate.", "SKILL", "ShieldAlert", False, 130, 250),
    ("SPEED_DEBATER", "Speed Debater", "Won a Rapid Fire style debate in under 2 minutes.", "SPEED", "Zap", False, 150, 300),
    ("DARK_LORD", "Slayer of Advocates", "Defeated Devil's Advocate persona on Master difficulty.", "SECRET", "Crown", True, 300, 600),
    ("THE_UNSTOPPABLE", "Unstoppable Force", "Won 3 consecutive debates in a row.", "SECRET", "Flame", True, 350, 700),
    ("STEEL_MAN", "Steel-Man Scholar", "Achieved 95+ Evidence score with an attached document.", "SECRET", "Shield", True, 400, 800),
]

DEFAULT_FALLACIES = [
    {
        "slug": "ad-hominem",
        "name": "Ad Hominem", "name_ar": "الشخصنة (الهجوم الشخصي)",
        "category": "Informal Fallacy", "category_ar": "مغالطة غير صورية",
        "summary": "Attacking the person instead of addressing their argument.",
        "summary_ar": "مهاجمة الشخص بدلاً من مناقشة حجته.",
        "description": "An ad hominem attack rejects a claim by focusing on personal characteristics, motive, or background of the speaker.",
        "example_bad": "'You can't trust his economics thesis because he was once fired from a retail job.'",
        "example_bad_ar": "'لا يمكنك الوثوق بنظريته الاقتصادية لأنه طُرد سابقاً من وظيفة بيع بالتجزئة.'",
        "example_good": "'His economic thesis fails to account for current inflation metrics.'",
        "how_to_counter": "Point out that personal attributes have no bearing on the validity of the premise.",
        "how_to_counter_ar": "وضّح أن الصفات الشخصية ليس لها علاقة بصحة أو خطأ الحجة."
    },
    {
        "slug": "straw-man",
        "name": "Straw Man", "name_ar": "رجل القش",
        "category": "Informal Fallacy", "category_ar": "مغالطة غير صورية",
        "summary": "Misrepresenting an opponent's argument to make it easier to attack.",
        "summary_ar": "تحريف حجة الخصم لجعل الهجوم عليها أسهل.",
        "description": "The straw man fallacy involves distorting, exaggerating, or oversimplifying a position.",
        "example_bad": "'Proponent: We should invest more in public transit. Opponent: You want to ban all personal cars!'",
        "example_bad_ar": "'المؤيد: يجب أن نستثمر في النقل العام. المعارض: أنت تريد حظر جميع السيارات الخاصة!'",
        "example_good": "'Proponent: Public transit improves urban flow. Opponent: Let's discuss cost efficiency.'",
        "how_to_counter": "Re-state your original position clearly: 'That is not what I claimed. My premise is specifically about bus rapid transit.'",
        "how_to_counter_ar": "أعد صياغة موقفك الأصلي بوضوح: 'هذا ليس ما ادعيته، حجتي تدور تحديداً حول...'"
    },
    {
        "slug": "false-dilemma",
        "name": "False Dilemma", "name_ar": "المعضلة المفتعلة",
        "category": "Formal Fallacy", "category_ar": "مغالطة صورية",
        "summary": "Presenting two extreme options as the only choices.",
        "summary_ar": "تقديم خيارين متطرفين على أنهما الخيارات الوحيدة المتاحة.",
        "description": "Limits the scope of discussion falsely by ignoring viable middle grounds or third choices.",
        "example_bad": "'Either we double our police budget or lawlessness will rule our streets.'",
        "example_bad_ar": "'إما أن نضاعف ميزانية الشرطة أو سيعم الانفلات الأمني شوارعنا.'",
        "example_good": "'We can evaluate targeted community safety programs alongside police budgeting.'",
        "how_to_counter": "Identify the missing middle alternatives and present them directly.",
        "how_to_counter_ar": "حدد البدائل الوسطية المفقودة واطرحها بشكل مباشر."
    },
    {
        "slug": "slippery-slope",
        "name": "Slippery Slope", "name_ar": "المنحدر الزلق",
        "category": "Rhetorical Fallacy", "category_ar": "مغالطة بلاغية",
        "summary": "Claiming a small first step will inevitably lead to extreme disaster.",
        "summary_ar": "الادعاء بأن خطوة أولى صغيرة ستؤدي حتماً إلى كارثة متطرفة.",
        "description": "Assumes a domino effect without providing evidence for each intermediate step.",
        "example_bad": "'If we allow students to use calculators, soon no one will know basic arithmetic or science!'",
        "example_bad_ar": "'إذا سمحنا للطلاب باستخدام الآلات الحاسبة، فسرعان ما لن يعرف أحد الحساب الأساسي!'",
        "example_good": "'Calculators enhance efficiency when standard math concepts are already understood.'",
        "how_to_counter": "Ask for proof for each link in the assumed causal chain.",
        "how_to_counter_ar": "اطلب دليلاً على كل حلقة في سلسلة الأسباب والنتائج المفترضة."
    },
    {
        "slug": "red-herring",
        "name": "Red Herring", "name_ar": "الرنجة الحمراء (تشتيت الانتباه)",
        "category": "Informal Fallacy", "category_ar": "مغالطة غير صورية",
        "summary": "Introducing an irrelevant topic to divert attention from the original issue.",
        "summary_ar": "إدخال موضوع غير ذي صلة لتحويل الانتباه عن القضية الأصلية.",
        "description": "A distraction tactic where an arguer changes the subject to something easier or more emotional to handle.",
        "example_bad": "'Why worry about environmental policy when our tax code needs complete reform?'",
        "example_bad_ar": "'لماذا نعدل السياسات البيئية بينما يحتاج قانون الضرائب إلى إصلاح شامل؟'",
        "example_good": "'Environmental policy and tax reforms are both important, but let's address the ecology bill currently on the floor.'",
        "how_to_counter": "Bring the debate back to the primary topic immediately.",
        "how_to_counter_ar": "أعد النقاش مباشرة إلى الموضوع الرئيسي دون الانسياب مع التشتيت."
    },
    {
        "slug": "appeal-to-authority",
        "name": "Appeal to Authority", "name_ar": "الاحتكام إلى السلطة (توسل بالسلطة)",
        "category": "Informal Fallacy", "category_ar": "مغالطة غير صورية",
        "summary": "Insisting a claim is true simply because an authority figure said so.",
        "summary_ar": "الادعاء بأن الفكرة صحيحة لمجرد أن شخصية مرموقة أو ذات سلطة قالتها.",
        "description": "Using an authority figure's opinion in place of actual evidence or logic, especially when out of their expert domain.",
        "example_bad": "'This famous actor claims this vitamin cures all diseases, so it must work!'",
        "example_bad_ar": "'هذا الممثل المشهور يقول إن الفيتامين يعالج جميع الأمراض، لذا يجب أن يكون هذا صحيحاً!'",
        "example_good": "'Clinical trials peer-reviewed in medical journals demonstrate a 15% reduction in symptoms.'",
        "how_to_counter": "Evaluate the evidence itself rather than the status of the person making the claim.",
        "how_to_counter_ar": "قيم الأدلة العلمية والموضوعية نفسها بدلاً من مكانة الشخص الذي أطلق الادعاء."
    },
    {
        "slug": "hasty-generalization",
        "name": "Hasty Generalization", "name_ar": "التعميم المتسرع",
        "category": "Informal Fallacy", "category_ar": "مغالطة غير صورية",
        "summary": "Drawing a broad conclusion from a very small or unrepresentative sample size.",
        "summary_ar": "الوصول إلى استنتاج عام واسع بناءً على عينة صغيرة جداً أو غير ممثلة.",
        "description": "Reaching an inductive generalization based on insufficient evidence.",
        "example_bad": "'I met two rude people in that town, so everyone there must be hostile.'",
        "example_bad_ar": "'لقد قابلت شخصين غير مهذبين في تلك المدينة، لذا يلتزم أن كل سكانها غير مهذبين.'",
        "example_good": "'Survey data across 1,000 residents indicates a diverse range of hospitality perspectives.'",
        "how_to_counter": "Highlight the inadequacy of the sample size.",
        "how_to_counter_ar": "أبرز عدم كفاية حجم العينة المطروحة للاستدلال."
    },
    {
        "slug": "circular-reasoning",
        "name": "Circular Reasoning", "name_ar": "الاستدلال الدائري (مصادرة على المطلوب)",
        "category": "Formal Fallacy", "category_ar": "مغالطة صورية",
        "summary": "Using the conclusion as one of the premises to prove the argument.",
        "summary_ar": "استخدام النتيجة النهائية كإحدى المقدمات لإثبات الحجة نفسها.",
        "description": "An argument where the reasoner begins with what they are trying to end with.",
        "example_bad": "'We must obey the law because it is illegal to break the law.'",
        "example_bad_ar": "'يجب علينا إطاعة القانون لأن مخالفة القانون أمر غير قانوني.'",
        "example_good": "'Laws maintain societal stability by establishing clear behavioral expectations and dispute resolutions.'",
        "how_to_counter": "Demonstrate that the premise and conclusion state the exact same assertion without independent proof.",
        "how_to_counter_ar": "بيّن أن المقدمة والنتيجة هما الشيء نفسه دون تقديم أدلة إضافية مستقلة."
    },
    {
        "slug": "appeal-to-emotion",
        "name": "Appeal to Emotion", "name_ar": "الاحتكام إلى العاطفة",
        "category": "Rhetorical Fallacy", "category_ar": "مغالطة بلاغية",
        "summary": "Manipulating emotional responses instead of presenting a valid argument.",
        "summary_ar": "استغلال مشاعر الاستعطاف أو الخوف بدلاً من تقديم حجة منطقية سليمة.",
        "description": "Using pity, fear, pride, or guilt to compel agreement rather than factual proof.",
        "example_bad": "'If you vote against this bill, think of all the sad puppies that will cry!'",
        "example_bad_ar": "'إذا تصوّت ضد هذا القانون، فكّر في الجراء الحزينة التي ستبكي!'",
        "example_good": "'This animal welfare bill secures annual funding for community shelter operations.'",
        "how_to_counter": "Acknowledge emotional empathy while redirecting focus back to logical principles and evidence.",
        "how_to_counter_ar": "أكّد أهمية العاطفة مع إعادة التركيز بوضوح إلى الأدلة المنطقية والحقائق."
    },
    {
        "slug": "bandwagon",
        "name": "Bandwagon Fallacy", "name_ar": "الاحتكام إلى الأغلبية (التوسل بالكثرة)",
        "category": "Informal Fallacy", "category_ar": "مغالطة غير صورية",
        "summary": "Arguing that a proposition must be true because many people believe it.",
        "summary_ar": "الادعاء بأن الفكرة صحيحة لمجرد أن الكثير من الناس يؤمنون بها.",
        "description": "Equating the popularity of a belief with its truth or factual correctness.",
        "example_bad": "'Millions of people believe this smartphone app cures insomnia, so it must work.'",
        "example_bad_ar": "'ملايين الناس يعتقدون أن هذا التطبيق يعالج الأرق، لذا يجب أن يكون هذا صحيحاً.'",
        "example_good": "'Popularity does not correlate with scientific efficacy; lab validation is required.'",
        "how_to_counter": "Remind that historical consensus has frequently been proven wrong by scientific facts.",
        "how_to_counter_ar": "ذكّر بأن الإجماع الشعبي والتاريخي غالباً ما ثبت خطؤه أمام الحقائق العلمية."
    },
    {
        "slug": "tu-quoque",
        "name": "Tu Quoque (Whataboutism)", "name_ar": "مغالطة (وأنت كذلك)",
        "category": "Informal Fallacy", "category_ar": "مغالطة غير صورية",
        "summary": "Deflecting criticism by pointing out hypocrisy in the opponent.",
        "summary_ar": "تجنب النقد بالإشارة إلى النفاق أو أخطاء الخصم السابقة.",
        "description": "Attempting to discredit an opponent's argument by asserting the opponent's failure to act consistently with its conclusion.",
        "example_bad": "'Why accuse me of wasteful spending when your department went over budget last year?'",
        "example_bad_ar": "'لماذا تتهمني بالإسراف بينما تجاوز قسمك الميزانية في العام الماضي؟'",
        "example_good": "'Previous budget overruns were addressed; let's focus on the line items of the current request.'",
        "how_to_counter": "Separate the speaker's personal actions from the objective merit of the argument.",
        "how_to_counter_ar": "افصل أفعال الشخص المتحدث عن الاستحقاق الموضوعي للحجة."
    },
    {
        "slug": "no-true-scotsman",
        "name": "No True Scotsman", "name_ar": "مغالطة (ليس إيرلندياً/عربياً حقيقياً)",
        "category": "Informal Fallacy", "category_ar": "مغالطة غير صورية",
        "summary": "Modifying a generalization ad hoc to exclude counterexamples.",
        "summary_ar": "تعديل التعميم بطريقة تعسفية لاستبعاد أي حالة مناقضة.",
        "description": "Refusing to admit a flaw in a universal claim by arbitrarily redefining the criteria for inclusion.",
        "example_bad": "'No true debater uses simple language. If they do, they aren't a real debater.'",
        "example_bad_ar": "'لا يوجد مناظر حقيقي يستخدم لغة بسيطة، وإن فعل ذلك فهو ليس مناظراً حقيقياً.'",
        "example_good": "'Debaters adapt their vocabulary to their audience for maximum clarity.'",
        "how_to_counter": "Challenge the ad hoc modification of criteria and demand objective metrics.",
        "how_to_counter_ar": "تحدَّ التعديل التعسفي للمعايير وطالب بمعايير تعريفية موضوعية."
    },
    {
        "slug": "appeal-to-democracy",
        "name": "Appeal to Democracy", "name_ar": "الاحتكام إلى الديمقراطية (الأغلبية)",
        "category": "Informal Fallacy", "category_ar": "مغالطة غير صورية",
        "summary": "Arguing that something must be true or right because the majority of people voted for it.",
        "summary_ar": "الادعاء بأن شيئاً ما يجب أن يكون صحيحاً لأن أغلبية الناس صوتوا له.",
        "description": "While democracy is a method of governance, it does not determine objective truth. The majority can be wrong about facts or morality.",
        "example_bad": "'Most people voted that the Earth is flat, so it must be true.'",
        "example_bad_ar": "'صوت معظم الناس بأن الأرض مسطحة، لذا يجب أن يكون هذا صحيحاً.'",
        "example_good": "'Let's consult geological and astronomical data rather than an opinion poll.'",
        "how_to_counter": "Point out that truth is not a popularity contest and provide objective facts.",
        "how_to_counter_ar": "أشر إلى أن الحقيقة ليست مسابقة شعبية وقدم حقائق موضوعية مستقلة."
    }
]

QUIZ_DEFAULTS = [
    {
        "question": "Candidate A says: 'We need to upgrade our electrical grid.' Candidate B replies: 'My opponent wants us to live in dark caves!' Which fallacy did Candidate B commit?",
        "question_ar": "المرشح الأول: 'يجب ترقية شبكة الكهرباء.' المرشح الثاني: 'خصمي يريدنا أن نعيش في كهوف مظلمة!' ما هي المغالطة؟",
        "option_a": "Ad Hominem", "option_a_ar": "الشخصنة",
        "option_b": "Straw Man", "option_b_ar": "رجل القش",
        "option_c": "False Dilemma", "option_c_ar": "المعضلة المفتعلة",
        "option_d": "Slippery Slope", "option_d_ar": "المنحدر الزلق",
        "correct": "B",
        "explanation": "Candidate B distorted Candidate A's proposal into an exaggerated, ridiculous position ('live in dark caves'), committing a classic Straw Man fallacy.",
        "explanation_ar": "قام المرشح الثاني بتحريف اقتراح المرشح الأول إلى موقف مبالغ فيه ('العيش في الكهوف')، وهو ما يمثل مغالطة رجل القش.",
        "xp": 30
    },
    {
        "question": "'Everyone is switching to this diet, so it must be the healthiest option.' Which fallacy is being committed?",
        "question_ar": "'الجميع ينتقل إلى هذا النظام الغذائي، لذا لابد أنه الخيار الأكثر صحة.' ما هي المغالطة؟",
        "option_a": "Hasty Generalization", "option_a_ar": "التعميم المتسرع",
        "option_b": "Bandwagon (Ad Populum)", "option_b_ar": "الاحتكام إلى الأغلبية",
        "option_c": "Appeal to Authority", "option_c_ar": "الاحتكام للسلطة",
        "option_d": "Red Herring", "option_d_ar": "الرنجة الحمراء",
        "correct": "B",
        "explanation": "The argument assumes that popularity equals correctness. The number of people following a diet does not validate its health benefits.",
        "explanation_ar": "تفترض الحجة أن الشعبية تساوي الصحة. عدد الأشخاص الذين يتبعون نظاماً ما لا يثبت فوائده، بل العلم يفعل ذلك.",
        "xp": 25
    },
    {
        "question": "'You say smoking is bad, but you smoked for 20 years!' This is an example of which fallacy?",
        "question_ar": "'أنت تقول أن التدخين مضر، لكنك دخنت لمدة 20 عاماً!' هذا مثال لأي مغالطة؟",
        "option_a": "Straw Man", "option_a_ar": "رجل القش",
        "option_b": "False Dilemma", "option_b_ar": "المعضلة المفتعلة",
        "option_c": "Tu Quoque", "option_c_ar": "وأنت كذلك (الشخصنة)",
        "option_d": "Circular Reasoning", "option_d_ar": "الاستدلال الدائري",
        "correct": "C",
        "explanation": "Tu Quoque (whataboutism) deflects criticism by pointing out the accuser's hypocrisy, rather than addressing the argument itself.",
        "explanation_ar": "هذه المغالطة (وأنت كذلك) تصرف الانتباه عن النقد بالإشارة إلى نفاق المتحدث بدلاً من مناقشة الحجة نفسها.",
        "xp": 30
    },
    {
        "question": "'If we allow employees to work from home on Fridays, next they will demand working only two days a week, and eventually our business will collapse!' Which fallacy is this?",
        "question_ar": "'إذا سمحنا للموظفين بالعمل من المنزل يوم الجمعة، فسيطلبون بعد ذلك العمل يومين فقط في الأسبوع، وفي النهاية ستنهر شركتنا!' ما هذه المغالطة؟",
        "option_a": "Slippery Slope", "option_a_ar": "المنحدر الزلق",
        "option_b": "Ad Hominem", "option_b_ar": "الشخصنة",
        "option_c": "No True Scotsman", "option_c_ar": "ليس إيرلندياً حقيقياً",
        "option_d": "Appeal to Emotion", "option_d_ar": "الاحتكام إلى العاطفة",
        "correct": "A",
        "explanation": "This argument assumes a chain reaction of extreme events without proving why one step must inevitably lead to the worst outcome.",
        "explanation_ar": "يفترض هذا الادعاء تسلسلاً كارثياً للأحداث دون إثبات أن الخطوة الأولى ستؤدي حتماً للنتيجة النهائية المتطرفة.",
        "xp": 30
    },
    {
        "question": "'We either cut all scientific research funding or our national debt will destroy our economy.' What fallacy is presented?",
        "question_ar": "'إما أن نلغي تمويل البحوث العلمية بالكامل أو أن الدين القومي سيدمر اقتصادنا.' ما هي المغالطة؟",
        "option_a": "False Dilemma", "option_a_ar": "المعضلة المفتعلة",
        "option_b": "Red Herring", "option_b_ar": "الرنجة الحمراء",
        "option_c": "Hasty Generalization", "option_c_ar": "التعميم المتسرع",
        "option_d": "Circular Reasoning", "option_d_ar": "الاستدلال الدائري",
        "correct": "A",
        "explanation": "It restricts options to two extreme choices, ignoring moderate solutions like targeted budget adjustments.",
        "explanation_ar": "تصر الحجة على حصر الاختيارات في خيارين حادين، متجاهلة خيارات وسطية وحلولاً أكثر اعتدالاً.",
        "xp": 25
    },
    {
        "question": "'Why should we listen to his opinion on tax reforms? He doesn't even hold a degree in mathematics!'",
        "question_ar": "'لماذا نستمع إلى رأيه حول الإصلاح الضريبي؟ هو لا يملك حتى شهادة في الرياضيات!'",
        "option_a": "Ad Hominem", "option_a_ar": "الشخصنة (الهجوم الشخصي)",
        "option_b": "Straw Man", "option_b_ar": "رجل القش",
        "option_c": "Appeal to Emotion", "option_c_ar": "الاحتكام للعاطفة",
        "option_d": "Bandwagon", "option_d_ar": "الاحتكام للأغلبية",
        "correct": "A",
        "explanation": "Attacking the speaker's background instead of critiquing their tax proposal logic.",
        "explanation_ar": "مهاجمة خلفية المتحدث بدلاً من نقد منطق مقترحه الضريبي هي مغالطة شخصنة.",
        "xp": 25
    }
]


class Command(BaseCommand):
    help = 'Seeds the database with default achievements, fallacies, and quizzes'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding achievements...')
        for code, title, desc, cat, icon, is_sec, xp, dp in DEFAULT_ACHIEVEMENTS:
            Achievement.objects.get_or_create(
                code=code,
                defaults={
                    'title': title,
                    'description': desc,
                    'category': cat,
                    'icon': icon,
                    'is_secret': is_sec,
                    'xp_reward': xp,
                    'dp_reward': dp
                }
            )
            
        self.stdout.write('Seeding fallacies...')
        for f in DEFAULT_FALLACIES:
            FallacyArticle.objects.update_or_create(
                slug=f["slug"],
                defaults={
                    'name': f["name"],
                    'name_ar': f.get("name_ar"),
                    'category': f["category"],
                    'category_ar': f.get("category_ar"),
                    'summary': f["summary"],
                    'summary_ar': f.get("summary_ar"),
                    'description': f["description"],
                    'example_bad': f["example_bad"],
                    'example_bad_ar': f.get("example_bad_ar"),
                    'example_good': f["example_good"],
                    'how_to_counter': f["how_to_counter"],
                    'how_to_counter_ar': f.get("how_to_counter_ar")
                }
            )
            
        self.stdout.write('Seeding quizzes...')
        QuizQuestion.objects.all().delete()
        fallacy = FallacyArticle.objects.first()
        if fallacy:
            for q in QUIZ_DEFAULTS:
                QuizQuestion.objects.create(
                    fallacy=fallacy,
                    question=q["question"],
                    question_ar=q.get("question_ar"),
                    option_a=q["option_a"], option_a_ar=q.get("option_a_ar"),
                    option_b=q["option_b"], option_b_ar=q.get("option_b_ar"),
                    option_c=q["option_c"], option_c_ar=q.get("option_c_ar"),
                    option_d=q["option_d"], option_d_ar=q.get("option_d_ar"),
                    correct_option=q["correct"],
                    explanation=q["explanation"],
                    explanation_ar=q.get("explanation_ar"),
                    xp_reward=q["xp"]
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database.'))

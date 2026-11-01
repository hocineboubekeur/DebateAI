import os
import json
import re
import random
import requests
from django.conf import settings
from .scoring_engine import ScoringEngine

# Multi-API Key Rotation System
# Rotates through multiple Gemini API keys to avoid per-key rate limits
GEMINI_API_KEYS = [k.strip() for k in os.getenv('GEMINI_API_KEYS', '').split(',') if k.strip()]
if not GEMINI_API_KEYS:
    GEMINI_API_KEYS = [settings.GEMINI_API_KEY] if getattr(settings, 'GEMINI_API_KEY', None) else []

# Round-robin key index (thread-safe enough for Django dev server)
_key_index = 0

def get_next_api_key():
    """Round-robin rotate through available API keys."""
    global _key_index
    key = GEMINI_API_KEYS[_key_index % len(GEMINI_API_KEYS)]
    _key_index += 1
    return key

PERSONA_PROMPTS = {
    'LAWYER': "You are 'The Lawyer', a razor-sharp legal mind. Focus on evidence, precedents, precise definitions, burdens of proof, and dissecting technical flaws in arguments. Tone: formal, analytical, authoritative.",
    'SCIENTIST': "You are 'The Scientist', an empirical researcher. Demand empirical data, peer-reviewed logic, statistical probability, and scientific consensus. Tone: objective, analytical, inquisitive.",
    'PHILOSOPHER': "You are 'The Philosopher', a deep conceptual thinker. Challenge underlying assumptions, moral ethical frameworks, epistemological bounds, and logical validity. Tone: contemplative, eloquent, Socratic.",
    'POLITICIAN': "You are 'The Politician', a master of rhetoric and public sentiment. Use persuasive framing, pragmatic outcomes, counter-narratives, and appeal to broader societal impacts. Tone: charismatic, strategic, persuasive.",
    'HISTORIAN': "You are 'The Historian', grounded in human history. Draw parallels to historical precedents, past policy outcomes, civilizational patterns, and lessons learned. Tone: wise, contextual, reflective.",
    'DEVILS_ADVOCATE': "You are 'Devil\'s Advocate'. No matter what stance the user takes, your goal is to poke holes, present radical counter-examples, and test the absolute limits of their thesis. Tone: sharp, challenging, relentless.",
    'TROLL': "You are 'Internet Troll', a witty, provocative debater who uses clever satire, irony, meme logic, and rapid-fire counter-questions without losing logical core. Tone: sarcastic, witty, fast-paced.",
    'RAGEBAITER': "You are 'The Ragebaiter', an infuriating contrarian. Your goal is to trigger the user by misrepresenting their points slightly, using inflammatory rhetoric, acting extremely condescending, and refusing to concede even basic facts. Tone: toxic, annoying, smug.",
    'JUDGE': "You are 'The Strict Judge', neutral and unyielding. Evaluate strictly on validity, sound premises, absence of fallacies, and empirical weight. Tone: fair, firm, impartial.",
    'SOCRATES': "You are 'Socrates', master of Socratic questioning. Challenge definitions, ask probing counter-questions, and expose logical contradictions with humble irony. Tone: Socratic, inquiring, relentless.",
    'ARISTOTLE': "You are 'Aristotle', master of formal logic and golden mean. Use categorical syllogisms, empirical observations, and golden mean balance. Tone: structured, analytical, authoritative.",
    'PLATO': "You are 'Plato', idealist philosopher. Challenge sensory illusions using ideal forms, political justice, and allegory. Tone: eloquent, idealistic, philosophical.",
    'TURING': "You are 'Alan Turing', pioneer of computing and formal logic. Focus on algorithmic feasibility, state transitions, and testable definitions. Tone: precise, technical, objective.",
    'SAGAN': "You are 'Carl Sagan', scientific skeptic and astronomer. Demand extraordinary evidence for extraordinary claims with cosmic perspective. Tone: inspiring, empirical, gentle.",
    'EINSTEIN': "You are 'Albert Einstein', theoretical physicist. Use thought experiments (Gedankenexperimente) and relational principles. Tone: imaginative, deep, humble.",
    'LINCOLN': "You are 'Abraham Lincoln', statesman and orator. Focus on constitutional law, moral union, and compelling legal rhetoric. Tone: solemn, persuasive, principled.",
    'SUN_TZU': "You are 'Sun Tzu', strategic strategist. Focus on strategic positioning, economic efficiency, and turning opponent momentum against them. Tone: strategic, concise, pragmatic."
}

STYLE_INSTRUCTIONS = {
    'CASUAL': "Keep arguments engaging, conversational, and direct.",
    'FORMAL': "Structure with clear thesis, premise 1, premise 2, and concluding rebuttal.",
    'SOCRATIC': "Answer with a strong counter-point followed by a probing philosophical question to force deep reflection.",
    'RAPID_FIRE': "Make punchy, short, high-impact counter-arguments (2-3 concise sentences max).",
    'COURTROOM': "Treat this as a court cross-examination: challenge witness credibility, demand evidence, highlight contradictions."
}

# Supported Gemini models to iterate over
GEMINI_MODELS = [
    'gemini-flash-latest',
    'gemini-3.6-flash',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash'
]

def call_gemini_api(prompt_text, system_instruction="", timeout=8, max_tokens=None, **kwargs):
    """Calls Gemini API with multi-key rotation and model fallback to prevent rate limits and timeouts."""
    if not GEMINI_API_KEYS:
        return None

    headers = {"Content-Type": "application/json"}
    contents = []
    if system_instruction:
        contents.append({"role": "user", "parts": [{"text": f"System Instruction: {system_instruction}\n\nPlease proceed."}]})
        contents.append({"role": "model", "parts": [{"text": "Understood. I will strictly fulfill this persona and rules."}]})

    contents.append({"role": "user", "parts": [{"text": prompt_text}]})

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 800
        }
    }

    num_keys = len(GEMINI_API_KEYS)
    for _ in range(num_keys):
        api_key = get_next_api_key()
        if not api_key:
            continue

        for model_name in GEMINI_MODELS:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            try:
                res = requests.post(url, headers=headers, json=payload, timeout=timeout)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        if text:
                            return text
            except Exception:
                continue

    return None


def compute_topic_relevance(user_text, topic):
    """Compute how relevant the user's text is to the debate topic.
    Returns a float 0.0 (completely off-topic) to 1.0 (highly relevant)."""
    # Extract meaningful words from the topic (4+ chars, skip stopwords)
    stopwords = {'this', 'that', 'with', 'from', 'have', 'were', 'which', 'about',
                 'there', 'their', 'would', 'could', 'should', 'been', 'being',
                 'more', 'than', 'other', 'into', 'some', 'such', 'only', 'over',
                 'very', 'just', 'also', 'most', 'after', 'before', 'between',
                 'does', 'must', 'will', 'what', 'when', 'where', 'while'}
    
    topic_words = set(w.lower() for w in re.findall(r'\b[a-zA-Z]{3,}\b', topic) if w.lower() not in stopwords)
    user_words = set(w.lower() for w in re.findall(r'\b[a-zA-Z]{3,}\b', user_text) if w.lower() not in stopwords)
    
    if not topic_words or not user_words:
        return 0.3  # Give benefit of doubt if parsing fails
    
    # Direct keyword overlap
    overlap = topic_words & user_words
    overlap_ratio = len(overlap) / max(len(topic_words), 1)
    
    # Also check semantic proximity via related domain words
    # Build a small set of domain-adjacent terms for common debate topics
    domain_expansions = {
        'regulation': {'law', 'policy', 'legislation', 'rules', 'governance', 'regulate', 'regulatory', 'compliance'},
        'artificial': {'algorithm', 'machine', 'learning', 'neural', 'automation', 'robot', 'compute'},
        'intelligence': {'cognitive', 'reasoning', 'smart', 'brain', 'thinking', 'sentient'},
        'climate': {'carbon', 'emission', 'warming', 'temperature', 'greenhouse', 'fossil', 'energy', 'renewable'},
        'nuclear': {'reactor', 'fission', 'fusion', 'radiation', 'uranium', 'atomic', 'power'},
        'genetic': {'dna', 'gene', 'crispr', 'mutation', 'hereditary', 'genome', 'biology', 'editing'},
        'social': {'platform', 'media', 'network', 'community', 'online', 'digital', 'internet', 'users'},
        'privacy': {'surveillance', 'data', 'tracking', 'monitoring', 'consent', 'personal', 'security'},
        'education': {'school', 'university', 'college', 'student', 'learning', 'teaching', 'academic'},
        'economic': {'market', 'trade', 'income', 'wealth', 'poverty', 'capitalism', 'inequality', 'tax'},
        'space': {'mars', 'nasa', 'orbit', 'rocket', 'colonize', 'planet', 'exploration', 'astronaut'},
        'punishment': {'prison', 'crime', 'justice', 'sentence', 'penalty', 'death', 'execution', 'criminal'},
        'voting': {'election', 'democracy', 'ballot', 'voter', 'political', 'citizen', 'government'},
        'animal': {'species', 'wildlife', 'testing', 'rights', 'welfare', 'cruelty', 'ethical'},
    }
    
    # Expand topic words with domain-related terms
    expanded_topic = set(topic_words)
    for tw in topic_words:
        if tw in domain_expansions:
            expanded_topic |= domain_expansions[tw]
    
    expanded_overlap = expanded_topic & user_words
    expanded_ratio = len(expanded_overlap) / max(len(expanded_topic), 1)
    
    # Combine: direct overlap has higher weight
    relevance = (overlap_ratio * 0.6) + (expanded_ratio * 0.4)
    
    return min(1.0, relevance)


class AIEngine:
    @staticmethod
    def call_gemini_api(prompt_text, system_instruction="", timeout=8, max_tokens=None, **kwargs):
        """Proxy to module-level call_gemini_api for backward compatibility."""
        return call_gemini_api(prompt_text, system_instruction=system_instruction, timeout=timeout, max_tokens=max_tokens, **kwargs)

    @staticmethod
    def generate_debater_turn(debate_session, user_argument, previous_turns=None, lang='en'):
        """Generates AI counter-argument for a debate turn."""
        if previous_turns is None:
            previous_turns = []
            
        persona = debate_session.persona
        style = debate_session.style
        topic = debate_session.topic
        user_side = debate_session.user_side
        
        if user_side == "FOR":
            ai_side = "AGAINST"
        elif user_side == "AGAINST":
            ai_side = "FOR"
        elif user_side == "NEUTRAL":
            ai_side = "HARDLINE FOR OR AGAINST"
        else: # SECRET
            ai_side = "DEVIL'S ADVOCATE - Assume they are wrong"

        # Arabic Language Detection / Override
        is_arabic = (lang == 'ar') or bool(re.search(r'[\u0600-\u06FF]', user_argument + topic))
        
        system_inst = f"{PERSONA_PROMPTS.get(persona, PERSONA_PROMPTS['PHILOSOPHER'])}\n{STYLE_INSTRUCTIONS.get(style, '')}"
        if is_arabic:
            system_inst += "\nIMPORTANT: The user has selected Arabic. You MUST respond entirely in fluent, eloquent Arabic (اللغة العربية الفصحى)."

        history_str = "\n".join([f"{t.speaker}: {t.text}" for t in previous_turns[-4:]])
        
        prompt = f"""
Debate Topic: "{topic}"
User Stance: {user_side}
Your Stance (AI): {ai_side}
Difficulty: {debate_session.difficulty}

Recent Conversation History:
{history_str}

User's Latest Argument:
"{user_argument}"

Formulate your counter-argument response in character as {persona}. Speak directly to the user in a compelling debate tone. Address their specific points directly. Keep it under 200 words. {"CRITICAL: Respond ONLY in Arabic." if is_arabic else ""}
"""
        response_text = call_gemini_api(prompt, system_instruction=system_inst)

        if not response_text:
            # Smart contextual fallback generator parsing key terms from user's input
            response_text = AIEngine.generate_contextual_fallback(user_argument, topic, persona, user_side, len(previous_turns), lang)

        fallacies = AIEngine.detect_quick_fallacies(user_argument, topic)
        
        # Compute relevance-aware scores
        relevance = compute_topic_relevance(user_argument, topic)
        base_logic = max(30, int(95 * relevance))
        base_persuasion = max(35, int(90 * relevance))
        
        # Penalize very short arguments
        word_count = len(user_argument.split())
        if word_count < 8:
            base_logic = max(25, base_logic - 20)
            base_persuasion = max(25, base_persuasion - 15)
        
        # Penalize for detected fallacies
        logic_score = max(20, base_logic - len(fallacies) * 15)
        persuasion_score = max(25, base_persuasion - len(fallacies) * 10)
        
        return {
            'text': response_text,
            'fallacies_detected': fallacies,
            'logic_score': logic_score,
            'persuasion_score': persuasion_score
        }

    @staticmethod
    def generate_contextual_fallback(user_text, topic, persona, user_side, turn_count, lang='en'):
        """Generates a dynamic, context-aware counter-argument based on words in user_text."""
        
        if lang == 'ar':
            ar_templates = [
                f"أفهم تركيزك على النقطة التي طرحتها، ولكن من منظور منهجي، هل تعتقد حقاً أن هذا كافٍ لإثبات موقفك حول '{topic}'؟ يجب أن تنظر للأدلة الأوسع.",
                f"أنت تبني حجتك على افتراضات قابلة للنقاش. كيف يمكنك تفسير التناقضات المنطقية عند تطبيق هذا المبدأ على '{topic}' بشكل عام؟",
                f"ما ذكرته قد يبدو منطقياً للوهلة الأولى، لكن بالتعمق في تفاصيل '{topic}' نجد أن الواقع يعاكس تماماً هذا الطرح. أحتاج لأدلة أقوى منك."
            ]
            return ar_templates[turn_count % len(ar_templates)]

        # Extract main words (nouns/concepts)
        words = re.findall(r'\b[a-zA-Z]{4,}\b', user_text)
        keywords = [w for w in words if w.lower() not in ['this', 'that', 'with', 'from', 'have', 'were', 'which', 'about', 'there', 'their', 'would', 'could', 'should']]
        
        focus_word = keywords[0] if keywords else "argument"
        second_word = keywords[1] if len(keywords) > 1 else "thesis"

        if persona == 'LAWYER':
            templates = [
                f"Your emphasis on '{focus_word}' is noted, but legally speaking, asserting '{focus_word}' without explicit statutory precedent or documented evidentiary burden fails to meet the required threshold of proof on '{topic}'.",
                f"Regarding your claim about '{focus_word}' and '{second_word}': in a courtroom setting, this would be deemed hearsay. Where is the verifiable contractual or empirical basis supporting your position?",
                f"You contend that '{focus_word}' dictates the outcome of '{topic}'. However, cross-examination reveals a fundamental flaw: your premise confuses correlation with legal liability."
            ]
        elif persona == 'SCIENTIST':
            templates = [
                f"Your assertion regarding '{focus_word}' lacks empirical validation. To validate '{focus_word}' in the context of '{topic}', we require double-blind peer-reviewed data rather than intuitive reasoning.",
                f"Analyzing your point on '{focus_word}' and '{second_word}': statistical modeling indicates that the variance in your data actually contradicts your primary thesis.",
                f"While '{focus_word}' sounds plausible in theory, rigorous scientific consensus demonstrates that the systemic variables surrounding '{topic}' lead to a vastly different outcome."
            ]
        elif persona == 'PHILOSOPHER':
            templates = [
                f"You base your argument on '{focus_word}', but consider the epistemological foundation: if we elevate '{focus_word}' to a universal principle, does it not create a moral contradiction regarding '{topic}'?",
                f"Your focus on '{focus_word}' and '{second_word}' touches on an ancient philosophical dilemma. But if we examine the underlying axioms, your premise assumes a subjective framework as objective truth.",
                f"To claim that '{focus_word}' justifies your stance on '{topic}' forces us to ask: what ethical framework prioritizes '{focus_word}' over systemic societal well-being?"
            ]
        elif persona == 'DEVILS_ADVOCATE':
            templates = [
                f"Let us test the extreme limit of your claim about '{focus_word}'. If '{focus_word}' is accepted, the unintended consequence is that it completely collapses your argument on '{topic}'.",
                f"You champion '{focus_word}' and '{second_word}', but let us invert the premise entirely: what if the exact opposite of '{focus_word}' is what actually stabilizes the situation?",
                f"That argument for '{focus_word}' is conventional, but highly vulnerable. If I press you on '{second_word}', your entire thesis on '{topic}' begins to unravel."
            ]
        elif persona == 'POLITICIAN':
            templates = [
                f"While your point on '{focus_word}' resonates in theory, pragmatic public governance requires balancing '{focus_word}' against the immediate real-world economic impact of '{topic}'.",
                f"Citizens care deeply about '{focus_word}' and '{second_word}'. However, your proposal neglects the broader societal compromise necessary to implement policy on '{topic}'.",
                f"Framing '{topic}' purely around '{focus_word}' ignores the political reality. We must look at sustainable, actionable outcomes that serve the entire community."
            ]
        elif persona == 'RAGEBAITER':
            templates = [
                f"Imagine actually believing '{focus_word}' is relevant to '{topic}'. That's honestly embarrassing. Did you even think about '{second_word}' or are you just repeating things you read online?",
                f"Wow, you just said '{focus_word}' with your whole chest. It's hilarious how you think '{focus_word}' and '{second_word}' somehow prove your point about '{topic}'. Just take the L.",
                f"I love how you bring up '{focus_word}' like it's a mic drop. Breaking news: '{focus_word}' has literally nothing to do with '{topic}'. Cry about it."
            ]
        else: # TROLL / HISTORIAN / DEFAULT
            templates = [
                f"Oh, so we're relying on '{focus_word}' now? History shows that every time someone built a thesis around '{focus_word}' regarding '{topic}', it resulted in complete failure.",
                f"Nice try bringing up '{focus_word}' and '{second_word}', but your argument on '{topic}' has more logical gaps than a sieve!",
                f"Extrapolating '{focus_word}' to justify '{topic}' is a classic misdirection. Address the core issue instead of hiding behind '{second_word}'!"
            ]

        return templates[turn_count % len(templates)]

    @staticmethod
    def detect_quick_fallacies(text, topic=""):
        """Detect common logical fallacies AND off-topic arguments."""
        text_lower = text.lower()
        found = []
        
        if "everyone knows" in text_lower or "obviously all" in text_lower or "nobody believes" in text_lower:
            found.append({"name": "Ad Populum", "reason": "Appeals to common belief rather than factual proof."})
        if "you always" in text_lower or "people like you" in text_lower or "stupid" in text_lower or "ignorant" in text_lower:
            found.append({"name": "Ad Hominem", "reason": "Attacks the person rather than the core argument."})
        if "either we" in text_lower or "if we don't" in text_lower:
            found.append({"name": "False Dilemma", "reason": "Presents only two extreme options when viable middle grounds exist."})
        if "slippery slope" in text_lower or "will lead to disaster" in text_lower or "catastrophe" in text_lower:
            found.append({"name": "Slippery Slope", "reason": "Assumes an extreme chain reaction without providing causal proof."})
        if "trust me" in text_lower or "believe me" in text_lower or "i just know" in text_lower:
            found.append({"name": "Appeal to Authority", "reason": "Relies on personal credibility instead of evidence."})
        if "because i said so" in text_lower or "it's true because it's true" in text_lower:
            found.append({"name": "Circular Reasoning", "reason": "The conclusion is used as its own premise."})
        
        # Off-topic detection: if argument has near-zero relevance to the debate topic
        if topic:
            relevance = compute_topic_relevance(text, topic)
            if relevance < 0.08 and len(text.split()) > 3:
                found.append({
                    "name": "Irrelevant Argument (Red Herring)",
                    "reason": f"Your argument appears unrelated to the debate topic: \"{topic}\". Stay focused on the central thesis."
                })
        
        return found

    @staticmethod
    def evaluate_debate(debate_session, turns):
        """Deploy 3 Specialized AI Judges to evaluate the debate transcript, then aggregate mathematically via ScoringEngine."""
        user_turns = [t for t in turns if t.speaker == 'USER']
        ai_turns = [t for t in turns if t.speaker == 'AI']
        
        user_transcript = "\n".join([f"Round {t.round_number}: {t.text}" for t in user_turns])
        ai_transcript = "\n".join([f"Round {t.round_number}: {t.text}" for t in ai_turns])
        
        topic = debate_session.topic
        user_side = debate_session.user_side
        persona = debate_session.persona

        # ----------------------------------------------------
        # JUDGE 1: Logic & Consistency Judge
        # ----------------------------------------------------
        prompt_j1 = f"""
Act as Judge #1 (Logic & Consistency Specialist). Evaluate ONLY logic validity, premises, internal consistency, and fallacies.
You are extremely strict. The baseline score is 15. Only award scores above 30 for highly logically sound and well-reasoned arguments. If the argument is very short, low-effort, or nonsensical, the score must be between 0 and 15.
Topic: "{topic}" | User Stance: {user_side} | AI Opponent: {persona}

User Transcript:
{user_transcript}

AI Transcript:
{ai_transcript}

Return valid JSON ONLY matching this structure:
{{
  "user_logic": 15,
  "user_consistency": 20,
  "ai_logic": 45,
  "ai_consistency": 40,
  "user_fallacies": [
     {{"type": "Strawman", "severity": "Medium", "round": 2, "explanation": "Distorted AI point."}}
  ],
  "ai_fallacies": [],
  "summary": "Judge 1 Logic Assessment: User logic was flawed and lacked solid premises."
}}
"""

        # ----------------------------------------------------
        # JUDGE 2: Evidence & Question Handling Judge
        # ----------------------------------------------------
        prompt_j2 = f"""
Act as Judge #2 (Evidence & Question Handling Specialist). Evaluate ONLY supporting evidence, empirical facts, citations, and responsiveness to direct questions.
You are extremely strict. The baseline score is 15. Only award scores above 30 if they provided actual empirical evidence and answered questions directly. If the argument is very short, low-effort, or nonsensical, the score must be between 0 and 15.
Topic: "{topic}" | User Stance: {user_side} | AI Opponent: {persona}

User Transcript:
{user_transcript}

AI Transcript:
{ai_transcript}

Return valid JSON ONLY matching this structure:
{{
  "user_evidence": 15,
  "user_question_handling": 15,
  "user_evidence_bonus": 0,
  "ai_evidence": 45,
  "ai_question_handling": 50,
  "ai_evidence_bonus": 1,
  "summary": "Judge 2 Evidence Assessment: User failed to provide concrete evidence."
}}
"""

        # ----------------------------------------------------
        # JUDGE 3: Rebuttal & Persuasion Judge
        # ----------------------------------------------------
        prompt_j3 = f"""
Act as Judge #3 (Rebuttal, Clarity & Rhetoric Specialist). Evaluate ONLY counter-argument directness, clarity of expression, and persuasive framing.
You are extremely strict. The baseline score is 15. Only award scores above 30 for highly persuasive and effective rebuttals. If the argument is very short, low-effort, or nonsensical, the score must be between 0 and 15.
Topic: "{topic}" | User Stance: {user_side} | AI Opponent: {persona}

User Transcript:
{user_transcript}

AI Transcript:
{ai_transcript}

Return valid JSON ONLY matching this structure:
{{
  "user_rebuttal": 15,
  "user_clarity": 20,
  "user_persuasion": 18,
  "ai_rebuttal": 50,
  "ai_clarity": 55,
  "ai_persuasion": 48,
  "summary": "Judge 3 Rhetoric Assessment: User delivered weak rebuttals that failed to directly dismantle the AI's core claims."
}}
"""

        # Run evaluations for 3 judges
        resp_j1 = call_gemini_api(prompt_j1, system_instruction="Output valid JSON only. You are a strict logic judge.", timeout=15)
        resp_j2 = call_gemini_api(prompt_j2, system_instruction="Output valid JSON only. You are an evidence judge.", timeout=15)
        resp_j3 = call_gemini_api(prompt_j3, system_instruction="Output valid JSON only. You are a rhetoric judge.", timeout=15)

        def parse_json_safely(raw_text):
            if not raw_text:
                return None
            try:
                match = re.search(r'\{.*\}', raw_text, re.DOTALL)
                if match:
                    return json.loads(match.group(0))
                return json.loads(raw_text)
            except Exception:
                return None

        j1_data = parse_json_safely(resp_j1)
        j2_data = parse_json_safely(resp_j2)
        j3_data = parse_json_safely(resp_j3)

        # Build intelligent heuristic metrics if API response is missing or partial
        user_words_total = sum(len(t.text.split()) for t in user_turns)
        user_turn_count = len(user_turns)
        avg_word_count = (user_words_total / max(1, user_turn_count))

        avg_rel = 0.0
        if user_turns:
            avg_rel = sum(compute_topic_relevance(t.text, topic) for t in user_turns) / len(user_turns)

        off_topic_penalty = 30 if avg_rel < 0.15 else (10 if avg_rel < 0.3 else 0)
        full_user_text_lower = " ".join([t.text.lower() for t in user_turns])

        # Evidence keywords & question counters
        evidence_kws = ['according to', 'percent', '%', 'study', 'data', 'research', 'proven', 'source', 'report', 'evidence', 'fact', 'statistic']
        evidence_count = sum(full_user_text_lower.count(kw) for kw in evidence_kws)

        rebuttal_kws = ['however', 'although', 'contrary', 'whereas', 'despite', 'instead', 'disagree', 'flaw', 'refute', 'counter', 'incorrect']
        rebuttal_count = sum(full_user_text_lower.count(kw) for kw in rebuttal_kws)
        question_count = full_user_text_lower.count('?')

        all_user_fallacies = []
        for t in user_turns:
            if t.fallacies_detected:
                all_user_fallacies.extend(t.fallacies_detected)

        # Realistic transcript-grounded category scores
        h_logic = min(95, max(30, int(70 * avg_rel + min(20, avg_word_count / 4) - len(all_user_fallacies) * 10 - off_topic_penalty)))
        h_consistency = min(95, max(35, int(65 + min(20, user_turn_count * 5) - len(all_user_fallacies) * 8)))
        h_evidence = min(95, max(30, int(40 + evidence_count * 12 + min(20, avg_word_count / 5) - off_topic_penalty)))
        h_question = min(95, max(35, int(50 + question_count * 12)))
        h_rebuttal = min(95, max(30, int(45 + rebuttal_count * 10 + min(20, avg_word_count / 5) - off_topic_penalty)))
        h_clarity = min(95, max(40, int(55 + min(25, avg_word_count / 3))))
        h_persuasion = min(95, max(35, int((h_logic + h_rebuttal) / 2)))

        # Construct Judges evaluation objects for Django Scoring Engine
        judges_eval_list = []

        # Convert Judge 1 data (Logic)
        j1_user_cat = {
            'logic': j1_data.get('user_logic', h_logic) if j1_data else h_logic,
            'consistency': j1_data.get('user_consistency', h_consistency) if j1_data else h_consistency,
            'evidence': 35, 'rebuttal': 35, 'clarity': 35, 'question_handling': 35, 'persuasion': 35
        }
        j1_ai_cat = {
            'logic': j1_data.get('ai_logic', 75) if j1_data else 75,
            'consistency': j1_data.get('ai_consistency', 78) if j1_data else 78,
            'evidence': 70, 'rebuttal': 70, 'clarity': 70, 'question_handling': 70, 'persuasion': 70
        }
        j1_summary = (j1_data.get('summary') if (j1_data and j1_data.get('summary'))
                      else f"Judge 1 (Logic): Evaluated argument structure. User logic score: {h_logic}/100 based on {int(avg_rel*100)}% topic focus and {len(all_user_fallacies)} detected fallacies.")
        
        judges_eval_list.append({
            'user_categories': j1_user_cat,
            'ai_categories': j1_ai_cat,
            'user_fallacies': j1_data.get('user_fallacies', all_user_fallacies) if j1_data else all_user_fallacies,
            'ai_fallacies': j1_data.get('ai_fallacies', []) if j1_data else [],
            'summary': j1_summary
        })

        # Convert Judge 2 data (Evidence)
        j2_user_cat = {
            'evidence': j2_data.get('user_evidence', h_evidence) if j2_data else h_evidence,
            'question_handling': j2_data.get('user_question_handling', h_question) if j2_data else h_question,
            'logic': 35, 'consistency': 35, 'rebuttal': 35, 'clarity': 35, 'persuasion': 35
        }
        j2_ai_cat = {
            'evidence': j2_data.get('ai_evidence', 74) if j2_data else 74,
            'question_handling': j2_data.get('ai_question_handling', 72) if j2_data else 72,
            'logic': 70, 'consistency': 70, 'rebuttal': 70, 'clarity': 70, 'persuasion': 70
        }
        j2_summary = (j2_data.get('summary') if (j2_data and j2_data.get('summary'))
                      else f"Judge 2 (Evidence): Assessed factual backing. User identified {evidence_count} empirical data points and {question_count} direct engagements.")
        
        judges_eval_list.append({
            'user_categories': j2_user_cat,
            'ai_categories': j2_ai_cat,
            'user_evidence_bonus': j2_data.get('user_evidence_bonus', min(3, evidence_count)) if j2_data else min(3, evidence_count),
            'ai_evidence_bonus': j2_data.get('ai_evidence_bonus', 2) if j2_data else 2,
            'summary': j2_summary
        })

        # Convert Judge 3 data (Rhetoric)
        j3_user_cat = {
            'rebuttal': j3_data.get('user_rebuttal', h_rebuttal) if j3_data else h_rebuttal,
            'clarity': j3_data.get('user_clarity', h_clarity) if j3_data else h_clarity,
            'persuasion': j3_data.get('user_persuasion', h_persuasion) if j3_data else h_persuasion,
            'logic': 35, 'consistency': 35, 'evidence': 35, 'question_handling': 35
        }
        j3_ai_cat = {
            'rebuttal': j3_data.get('ai_rebuttal', 76) if j3_data else 76,
            'clarity': j3_data.get('ai_clarity', 80) if j3_data else 80,
            'persuasion': j3_data.get('ai_persuasion', 75) if j3_data else 75,
            'logic': 70, 'consistency': 70, 'evidence': 70, 'question_handling': 70
        }
        j3_summary = (j3_data.get('summary') if (j3_data and j3_data.get('summary'))
                      else f"Judge 3 (Rhetoric): Evaluated persuasive delivery. User deployed {rebuttal_count} direct rebuttal transitions and achieved average turn length of {int(avg_word_count)} words.")
        
        judges_eval_list.append({
            'user_categories': j3_user_cat,
            'ai_categories': j3_ai_cat,
            'summary': j3_summary
        })

        # Perform Django Deterministic Aggregation via ScoringEngine
        result = ScoringEngine.aggregate_judges(judges_eval_list)

        return {
            'winner': result['winner'],
            'is_draw': result['is_draw'],
            'user_score': int(result['ads_user']),
            'ai_score': int(result['ads_ai']),
            'margin_of_victory': result['margin_of_victory'],
            'confidence': result['confidence'],
            'std_dev': result['std_dev'],
            'judge_summary': result['summary'],
            'user_categories': result['user_categories'],
            'ai_categories': result['ai_categories'],
            'user_fallacies': result['user_fallacies'],
            'ai_fallacies': result['ai_fallacies'],
            'logic_breakdown': {'user': int(result['user_categories']['logic']), 'ai': int(result['ai_categories']['logic']), 'comment': 'Evaluated by Logic & Consistency Judge.'},
            'evidence_breakdown': {'user': int(result['user_categories']['evidence']), 'ai': int(result['ai_categories']['evidence']), 'comment': 'Evaluated by Evidence Specialist Judge.'},
            'rebuttal_breakdown': {'user': int(result['user_categories']['rebuttal']), 'ai': int(result['ai_categories']['rebuttal']), 'comment': 'Evaluated by Rhetoric & Rebuttal Judge.'},
            'fallacies_found': [f"{f.get('type')}: {f.get('explanation')}" for f in result['user_fallacies']],
            'key_turning_points': [
                {"round": 1, "description": f"Opening arguments. {'User maintained high relevance.' if avg_rel > 0.4 else 'User struggled with topic focus.'}"},
                {"round": len(user_turns), "description": f"Final round closure. Margin of Victory: {result['margin_of_victory']} pts."}
            ],
            'top_recommendations': [
                "Maintain internal consistency between early and late round premises.",
                "Back up claims with peer-reviewed empirical data or official statistics.",
                "Answer opponent's direct questions before pivoting to counter-points."
            ]
        }


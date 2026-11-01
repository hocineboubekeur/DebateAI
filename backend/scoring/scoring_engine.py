import math

# Category Weights according to specification
CATEGORY_WEIGHTS = {
    'logic': 0.25,
    'evidence': 0.20,
    'rebuttal': 0.20,
    'consistency': 0.15,
    'clarity': 0.10,
    'question_handling': 0.05,
    'persuasion': 0.05,
}

FALLACY_SEVERITY_PENALTIES = {
    'LOW': 2,
    'MEDIUM': 5,
    'HIGH': 10,
}

DRAW_THRESHOLD = 2.0  # Margin of Victory below 2.0 results in a Draw


class ScoringEngine:
    @staticmethod
    def calculate_fallacy_penalties(fallacies):
        """Calculates total fallacy penalty with repetition scaling."""
        if not fallacies:
            return 0.0, []

        processed = []
        counts_by_type = {}
        total_penalty = 0.0

        for f in fallacies:
            f_type = f.get('type', 'General Fallacy')
            severity = str(f.get('severity', 'MEDIUM')).upper()
            base_pen = f.get('penalty', FALLACY_SEVERITY_PENALTIES.get(severity, 5))

            counts_by_type[f_type] = counts_by_type.get(f_type, 0) + 1
            repeat_count = counts_by_type[f_type]

            # Repetition scaling bonus penalty: 1st=0, 2nd=+1, 3rd=+3, 4th=+6
            scaled_pen = base_pen + (repeat_count - 1) * (repeat_count // 2 + 1) if repeat_count > 1 else base_pen

            total_penalty += scaled_pen
            processed.append({
                'type': f_type,
                'severity': severity,
                'penalty': scaled_pen,
                'round': f.get('round', 1),
                'explanation': f.get('explanation', '')
            })

        return total_penalty, processed

    @staticmethod
    def calculate_weighted_score(cat_scores):
        """Calculates Weighted Score (WS) from 7 category scores (0-100)."""
        ws = 0.0
        for cat, weight in CATEGORY_WEIGHTS.items():
            val = float(cat_scores.get(cat, 15))
            # Clamp between 0 and 100
            val = max(0.0, min(100.0, val))
            ws += val * weight
        return round(ws, 2)

    @staticmethod
    def calculate_debate_score(cat_scores, fallacies=None, evidence_bonus=0.0):
        """Calculates final Debate Score (DS) = WS + EB - FP."""
        ws = ScoringEngine.calculate_weighted_score(cat_scores)
        fp, processed_fallacies = ScoringEngine.calculate_fallacy_penalties(fallacies or [])
        eb = max(0.0, min(5.0, float(evidence_bonus)))

        ds = max(0.0, min(100.0, ws + eb - fp))

        return {
            'weighted_score': ws,
            'fallacy_penalty': fp,
            'evidence_bonus': eb,
            'debate_score': round(ds, 2),
            'fallacies': processed_fallacies,
            'categories': {
                'logic': cat_scores.get('logic', 15),
                'evidence': cat_scores.get('evidence', 15),
                'rebuttal': cat_scores.get('rebuttal', 15),
                'consistency': cat_scores.get('consistency', 15),
                'clarity': cat_scores.get('clarity', 15),
                'question_handling': cat_scores.get('question_handling', 15),
                'persuasion': cat_scores.get('persuasion', 15),
            }
        }

    @staticmethod
    def aggregate_judges(judges_eval_list):
        """Aggregates multiple judges' evaluations and computes deterministic winner & confidence."""
        if not judges_eval_list:
            raise ValueError("No judge evaluations provided for aggregation.")

        user_ds_list = []
        ai_ds_list = []
        user_cat_sums = {cat: 0.0 for cat in CATEGORY_WEIGHTS}
        ai_cat_sums = {cat: 0.0 for cat in CATEGORY_WEIGHTS}
        all_user_fallacies = []
        all_ai_fallacies = []
        summaries = []

        n = len(judges_eval_list)

        for judge_data in judges_eval_list:
            user_eval = ScoringEngine.calculate_debate_score(
                judge_data.get('user_categories', {}),
                judge_data.get('user_fallacies', []),
                judge_data.get('user_evidence_bonus', 0)
            )

            ai_eval = ScoringEngine.calculate_debate_score(
                judge_data.get('ai_categories', {}),
                judge_data.get('ai_fallacies', []),
                judge_data.get('ai_evidence_bonus', 0)
            )

            user_ds_list.append(user_eval['debate_score'])
            ai_ds_list.append(ai_eval['debate_score'])

            for cat in CATEGORY_WEIGHTS:
                user_cat_sums[cat] += user_eval['categories'][cat]
                ai_cat_sums[cat] += ai_eval['categories'][cat]

            all_user_fallacies.extend(user_eval['fallacies'])
            all_ai_fallacies.extend(ai_eval['fallacies'])

            if judge_data.get('summary'):
                summaries.append(judge_data['summary'])

        # Calculate Average Debate Score (ADS)
        ads_user = round(sum(user_ds_list) / n, 2)
        ads_ai = round(sum(ai_ds_list) / n, 2)

        # Average 7-category scores
        avg_user_cats = {cat: round(user_cat_sums[cat] / n, 1) for cat in CATEGORY_WEIGHTS}
        avg_ai_cats = {cat: round(ai_cat_sums[cat] / n, 1) for cat in CATEGORY_WEIGHTS}

        # Margin of Victory
        mov = round(abs(ads_user - ads_ai), 2)

        # Winner & Draw Determination
        if mov < DRAW_THRESHOLD:
            winner = "Draw"
            is_draw = True
        elif ads_user > ads_ai:
            winner = "USER"
            is_draw = False
        else:
            winner = "AI"
            is_draw = False

        # Calculate Standard Deviation across judges' scores for confidence formula
        if n > 1:
            mean_diffs = [(u - a) for u, a in zip(user_ds_list, ai_ds_list)]
            mean_diff = sum(mean_diffs) / n
            variance = sum((d - mean_diff) ** 2 for d in mean_diffs) / n
            std_dev = math.sqrt(variance)
        else:
            std_dev = 0.0

        # Confidence Formula: clamp(70 + (MOV * 5) - (σ * 4), 0, 100)
        raw_confidence = 70.0 + (mov * 5.0) - (std_dev * 4.0)
        confidence = max(0, min(100, int(round(raw_confidence))))

        combined_summary = "\n\n".join(summaries) if summaries else "Balanced evaluation across multi-judge panel."

        return {
            'winner': winner,
            'is_draw': is_draw,
            'margin_of_victory': mov,
            'confidence': confidence,
            'std_dev': round(std_dev, 2),
            'ads_user': ads_user,
            'ads_ai': ads_ai,
            'user_categories': avg_user_cats,
            'ai_categories': avg_ai_cats,
            'user_fallacies': all_user_fallacies,
            'ai_fallacies': all_ai_fallacies,
            'summary': combined_summary,
            'judge_count': n
        }

import os
import django
from django.conf import settings
from django.core.management.base import BaseCommand
import re

class Command(BaseCommand):
    help = 'Translates all empty _ar fields in the database using the AI Engine'

    def handle(self, *args, **kwargs):
        from library.models import FallacyArticle, QuizQuestion
        from achievements.models import Achievement
        from scoring.ai_engine import call_gemini_api

        def translate_text(text, context=""):
            if not text: return ""
            prompt = f"Translate the following text into fluent, natural Arabic. Context: {context}\n\nText:\n{text}\n\nONLY output the Arabic translation, nothing else."
            translated = call_gemini_api(prompt, system_instruction="You are a professional translator. Output only the translation.")
            if translated:
                translated = translated.strip()
                if translated.startswith("```") and translated.endswith("```"):
                    lines = translated.split('\n')
                    translated = '\n'.join(lines[1:-1]) if len(lines) > 2 else lines[1]
                return translated
            return ""

        self.stdout.write("Starting translation process...")

        # 1. Translate Fallacy Articles
        fallacies = FallacyArticle.objects.all()
        for f in fallacies:
            updated = False
            if not f.name_ar and f.name:
                self.stdout.write(f"Translating name for {f.name}...")
                f.name_ar = translate_text(f.name, "Name of a logical fallacy")
                updated = True
            if not f.category_ar and f.category:
                self.stdout.write(f"Translating category for {f.name}...")
                f.category_ar = translate_text(f.category, "Category of a logical fallacy (e.g. Formal, Informal)")
                updated = True
            if not f.summary_ar and f.summary:
                self.stdout.write(f"Translating summary for {f.name}...")
                f.summary_ar = translate_text(f.summary, "Summary of a logical fallacy")
                updated = True
            if not f.description_ar and f.description:
                self.stdout.write(f"Translating description for {f.name}...")
                f.description_ar = translate_text(f.description, "Description of a logical fallacy")
                updated = True
            if not f.example_bad_ar and f.example_bad:
                self.stdout.write(f"Translating bad example for {f.name}...")
                f.example_bad_ar = translate_text(f.example_bad, "An example illustrating a logical fallacy in a debate")
                updated = True
            if not f.example_good_ar and f.example_good:
                self.stdout.write(f"Translating good example for {f.name}...")
                f.example_good_ar = translate_text(f.example_good, "An example illustrating good logic in a debate")
                updated = True
            if not f.how_to_counter_ar and f.how_to_counter:
                self.stdout.write(f"Translating counter for {f.name}...")
                f.how_to_counter_ar = translate_text(f.how_to_counter, "How to counter this logical fallacy in a debate")
                updated = True
            
            if updated:
                f.save()
                self.stdout.write(self.style.SUCCESS(f"Successfully translated Fallacy: {f.name}"))

        # 2. Translate Quiz Questions
        quizzes = QuizQuestion.objects.all()
        for q in quizzes:
            updated = False
            if not q.question_ar and q.question:
                self.stdout.write(f"Translating quiz question: {q.question[:30]}...")
                q.question_ar = translate_text(q.question, "A multiple choice question about debate and logic")
                updated = True
            if not q.option_a_ar and q.option_a:
                self.stdout.write(f"Translating option A...")
                q.option_a_ar = translate_text(q.option_a, "A multiple choice answer option")
                updated = True
            if not q.option_b_ar and q.option_b:
                self.stdout.write(f"Translating option B...")
                q.option_b_ar = translate_text(q.option_b, "A multiple choice answer option")
                updated = True
            if not q.option_c_ar and q.option_c:
                self.stdout.write(f"Translating option C...")
                q.option_c_ar = translate_text(q.option_c, "A multiple choice answer option")
                updated = True
            if not q.option_d_ar and q.option_d:
                self.stdout.write(f"Translating option D...")
                q.option_d_ar = translate_text(q.option_d, "A multiple choice answer option")
                updated = True
            if not q.explanation_ar and q.explanation:
                self.stdout.write(f"Translating explanation...")
                q.explanation_ar = translate_text(q.explanation, "Explanation for the correct answer of the quiz")
                updated = True

            if updated:
                q.save()
                self.stdout.write(self.style.SUCCESS(f"Successfully translated Quiz: {q.id}"))

        # 3. Translate Achievements
        achievements = Achievement.objects.all()
        for a in achievements:
            updated = False
            if not a.title_ar and a.title:
                self.stdout.write(f"Translating achievement title: {a.title}...")
                a.title_ar = translate_text(a.title, "Title of an achievement or badge in a debate game")
                updated = True
            if not a.description_ar and a.description:
                self.stdout.write(f"Translating achievement description: {a.title}...")
                a.description_ar = translate_text(a.description, "Description of how to unlock this achievement in a debate game")
                updated = True
            
            if updated:
                a.save()
                self.stdout.write(self.style.SUCCESS(f"Successfully translated Achievement: {a.title}"))

        self.stdout.write(self.style.SUCCESS("Translation process completed!"))

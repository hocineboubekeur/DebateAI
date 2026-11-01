from django.db import models

class FallacyArticle(models.Model):
    name = models.CharField(max_length=150)
    name_ar = models.CharField(max_length=150, null=True, blank=True)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=50, default="Formal Fallacy")  # Formal, Informal, Rhetorical
    category_ar = models.CharField(max_length=50, null=True, blank=True)
    summary = models.TextField()
    summary_ar = models.TextField(null=True, blank=True)
    description = models.TextField()
    description_ar = models.TextField(null=True, blank=True)
    example_bad = models.TextField()
    example_bad_ar = models.TextField(null=True, blank=True)
    example_good = models.TextField()
    example_good_ar = models.TextField(null=True, blank=True)
    how_to_counter = models.TextField()
    how_to_counter_ar = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class QuizQuestion(models.Model):
    fallacy = models.ForeignKey(FallacyArticle, on_delete=models.CASCADE, related_name='quizzes', null=True, blank=True)
    question = models.TextField()
    question_ar = models.TextField(null=True, blank=True)
    option_a = models.CharField(max_length=255)
    option_a_ar = models.CharField(max_length=255, null=True, blank=True)
    option_b = models.CharField(max_length=255)
    option_b_ar = models.CharField(max_length=255, null=True, blank=True)
    option_c = models.CharField(max_length=255)
    option_c_ar = models.CharField(max_length=255, null=True, blank=True)
    option_d = models.CharField(max_length=255)
    option_d_ar = models.CharField(max_length=255, null=True, blank=True)
    correct_option = models.CharField(max_length=1)  # A, B, C, or D
    explanation = models.TextField()
    explanation_ar = models.TextField(null=True, blank=True)
    xp_reward = models.IntegerField(default=20)

    def __str__(self):
        return f"Quiz Question #{self.id}: {self.question[:50]}..."


class BookDebateTopic(models.Model):
    book_title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    cover_image_url = models.CharField(max_length=500, blank=True)
    theme = models.CharField(max_length=100)
    debate_topic = models.CharField(max_length=300)
    description = models.TextField()
    description_ar = models.TextField(blank=True)

    def __str__(self):
        return f"{self.book_title} by {self.author}"


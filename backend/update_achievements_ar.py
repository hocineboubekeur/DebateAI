import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from achievements.models import Achievement

updates = {
    "FIRST_DEBATE": ("الكلمات الأولى", "أكملت مناظرتك الأولى."),
    "WINNER": ("مُغيِّر العقول", "فزت في مناظرتك الأولى ضد الذكاء الاصطناعي."),
    "LOGIC_MASTER": ("شارلوك هولمز", "سجلت 90+ في المنطق خلال مناظرة رسمية."),
    "DEVILS_SURVIVOR": ("الناجي من محامي الشيطان", "صمدت 5 جولات ضد شخصية محامي الشيطان."),
    "SECRET_PHOENIX": ("نهضة العنقاء", "تعافيت من نتيجة منخفضة لتفوز بالمناظرة."),
    "STREAK_3": ("سيد الاستمرارية", "حافظت على سلسلة مناظرات متتالية لمدة 3 أيام."),
    "SOCRATIC_WIN": ("باحث سقراطي", "فزت في مناظرة باستخدام أسلوب التساؤل السقراطي."),
    "QUIZ_ACE": ("بطل الاختبارات", "أجبت على 5 أسئلة من اختبارات المكتبة بشكل صحيح."),
    "COMMUNITY_PUB": ("نجم المجتمع", "نشرت مناظرتك الأولى في الساحة المجتمعية."),
    "EVIDENCE_PRO": ("خبير الأدلة", "قمت برفع مستندات أدلة في 3 مناظرات مختلفة."),
    "FALLACY_SPOTTER": ("مكتشف المغالطات", "أنهيت مناظرة كاملة بدون أي تحذير من ارتكاب مغالطة."),
    "SPEED_DEBATER": ("مناظر سريع", "فزت في مناظرة سريعة في أقل من دقيقتين."),
    "DARK_LORD": ("قاهر المحامين", "هزمت شخصية محامي الشيطان على مستوى الصعوبة العالي."),
    "THE_UNSTOPPABLE": ("قوة لا تقهر", "فزت في 3 مناظرات متتالية."),
    "STEEL_MAN": ("باحث حجة الفولاذ", "حققت درجة 95+ في الأدلة مع إرفاق مستند داعم.")
}

count = 0
for code, (title_ar, desc_ar) in updates.items():
    try:
        a = Achievement.objects.get(code=code)
        a.title_ar = title_ar
        a.description_ar = desc_ar
        a.save()
        count += 1
    except Achievement.DoesNotExist:
        print(f"Skipping {code} - not found")

print(f"Updated {count} achievements with Arabic titles and descriptions.")

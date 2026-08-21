import type { Locale } from "./locales";

export type { Locale };

export type Labeled = { id: string } & Record<Locale, string>;

function L(
  id: string,
  en: string,
  fa: string,
  ar: string,
  tr: string,
  az: string,
  ur: string,
  ku: string,
): Labeled {
  return { id, en, fa, ar, tr, az, ur, ku };
}

export const POSITIONS: Labeled[] = [
  L("GK", "Goalkeeper", "دروازه‌بان", "حارس مرمى", "Kaleci", "Qapıçı", "گول کیپر", "گۆڵپارێز"),
  L("CB", "Centre-back", "مدافع میانی", "مدافع وسط", "Stoper", "Mərkəz müdafiəçi", "سینٹر بیک", "بەرگریکاری ناوەڕاست"),
  L("LB", "Left-back", "مدافع چپ", "ظهير أيسر", "Sol bek", "Sol cinah müdafiəçi", "لیفٹ بیک", "بەرگریکاری چەپ"),
  L("RB", "Right-back", "مدافع راست", "ظهير أيمن", "Sağ bek", "Sağ cinah müdafiəçi", "رائٹ بیک", "بەرگریکاری ڕاست"),
  L("LWB", "Left wing-back", "وینگ‌بک چپ", "جناح أيسر دفاع", "Sol kanat bek", "Sol vinqbek", "لیفٹ ونگ بیک", "وینگبێکی چەپ"),
  L("RWB", "Right wing-back", "وینگ‌بک راست", "جناح أيمن دفاع", "Sağ kanat bek", "Sağ vinqbek", "رائٹ ونگ بیک", "وینگبێکی ڕاست"),
  L("CDM", "Defensive midfielder", "هافبک دفاعی", "وسط دفاعي", "Defansif orta saha", "Müdafiə yarımmüdafiəçisi", "ڈیفنسو مڈفیلڈر", "ناوەڕاستی بەرگری"),
  L("CM", "Central midfielder", "هافبک میانی", "وسط ملعب", "Orta saha", "Mərkəz yarımmüdafiəçi", "سنٹرل مڈفیلڈر", "ناوەڕاست"),
  L("CAM", "Attacking midfielder", "هافبک تهاجمی", "وسط هجومي", "Ofansif orta saha", "Hücum yarımmüdafiəçisi", "اٹیکنگ مڈفیلڈر", "ناوەڕاستی هێرشبەر"),
  L("LM", "Left midfielder", "هافبک چپ", "وسط أيسر", "Sol orta saha", "Sol yarımmüdafiəçi", "لیفٹ مڈفیلڈر", "ناوەڕاستی چەپ"),
  L("RM", "Right midfielder", "هافبک راست", "وسط أيمن", "Sağ orta saha", "Sağ yarımmüdafiəçi", "رائٹ مڈفیلڈر", "ناوەڕاستی ڕاست"),
  L("LW", "Left winger", "وینگر چپ", "جناح أيسر", "Sol kanat", "Sol cinah hücumçusu", "لیفٹ ونگر", "باڵی چەپ"),
  L("RW", "Right winger", "وینگر راست", "جناح أيمن", "Sağ kanat", "Sağ cinah hücumçusu", "رائٹ ونگر", "باڵی ڕاست"),
  L("CF", "Centre-forward", "مهاجم سایه", "مهاجم ثانٍ", "Gölcü arkası", "İkinci hücumçu", "سینٹر فارورڈ", "هێرشبەری سێبەر"),
  L("ST", "Striker", "مهاجم نوک", "مهاجم", "Forvet", "Hücumçu", "سٹرائیکر", "هێرشبەر"),
];

export const FEET: Labeled[] = [
  L("right", "Right", "راست", "يمين", "Sağ", "Sağ", "دائیں", "ڕاست"),
  L("left", "Left", "چپ", "يسار", "Sol", "Sol", "بائیں", "چەپ"),
  L("both", "Both", "هر دو", "كلا القدمين", "İkisi", "Hər ikisi", "دونوں", "هەردوو"),
];

export const LEVELS: Labeled[] = [
  L("amateur", "Amateur", "آماتور", "هواة", "Amatör", "Həvəskar", "شوقیہ", "ئاماتۆر"),
  L("semi_pro", "Semi-pro", "نیمه‌حرفه‌ای", "شبه محترف", "Yarı profesyonel", "Yarıpeşəkar", "نیمہ پیشہ ور", "نیوەپیشەیی"),
  L("professional", "Professional", "حرفه‌ای", "محترف", "Profesyonel", "Peşəkar", "پیشہ ور", "پیشەیی"),
];

export const VIDEO_CATEGORIES: Labeled[] = [
  L("goal_highlights", "Goals", "گل‌ها", "أهداف", "Goller", "Qollar", "گولز", "گۆڵەکان"),
  L("defending", "Defending", "دفاع", "دفاع", "Savunma", "Müdafiə", "دفاع", "بەرگری"),
  L("passing", "Passing", "پاس", "تمرير", "Pas", "Pas", "پاس", "پاس"),
  L("full_match_clip", "Match clip", "کلیپ بازی", "مقطع مباراة", "Maç klibi", "Oyun klipi", "میچ کلپ", "کلیپی یاری"),
  L("training", "Training", "تمرین", "تدريب", "Antrenman", "Məşq", "ٹریننگ", "ڕاهێنان"),
  L("other", "Other", "سایر", "أخرى", "Diğer", "Digər", "دیگر", "هیتر"),
];

export const SHORTLIST_STATUSES: Labeled[] = [
  L("watching", "Watching", "در حال بررسی", "قيد المتابعة", "İzleniyor", "İzlənir", "زیر نظر", "لەژێر چاودێری"),
  L("reviewing", "In review", "ارزیابی", "قيد التقييم", "Değerlendirme", "Qiymətləndirmə", "جائزہ", "هەڵسەنگاندن"),
  L("contacted", "Contacted", "تماس گرفته شده", "تم التواصل", "İletişime geçildi", "Əlaqə saxlanılıb", "رابطہ ہوا", "پەیوەندی کراوە"),
  L("passed", "Passed", "رد شده", "مستبعد", "Elendi", "Keçildi", "منسوخ", "ڕەتکراوە"),
];

export const COUNTRIES: Labeled[] = [
  L("IR", "Iran", "ایران", "إيران", "İran", "İran", "ایران", "ئێران"),
  L("TR", "Türkiye", "ترکیه", "تركيا", "Türkiye", "Türkiyə", "ترکیہ", "تورکیا"),
  L("AZ", "Azerbaijan", "آذربایجان", "أذربيجان", "Azerbaycan", "Azərbaycan", "آذربائیجان", "ئازەربایجان"),
  L("AM", "Armenia", "ارمنستان", "أرمينيا", "Ermenistan", "Ermənistan", "آرمینیا", "ئەرمەنستان"),
  L("IQ", "Iraq", "عراق", "العراق", "Irak", "İraq", "عراق", "عێراق"),
  L("AF", "Afghanistan", "افغانستان", "أفغانستان", "Afganistan", "Əfqanıstan", "افغانستان", "ئەفغانستان"),
  L("PK", "Pakistan", "پاکستان", "باكستان", "Pakistan", "Pakistan", "پاکستان", "پاکستان"),
  L("TM", "Turkmenistan", "ترکمنستان", "تركمانستان", "Türkmenistan", "Türkmənistan", "ترکمانستان", "تورکمانستان"),
  L("JP", "Japan", "ژاپن", "اليابان", "Japonya", "Yaponiya", "جاپان", "ژاپۆن"),
  L("KR", "South Korea", "کره جنوبی", "كوريا الجنوبية", "Güney Kore", "Cənubi Koreya", "جنوبی کوریا", "کۆریای باشوور"),
  L("SA", "Saudi Arabia", "عربستان سعودی", "السعودية", "Suudi Arabistan", "Səudiyyə Ərəbistanı", "سعودی عرب", "عەرەبستانی سعودی"),
  L("AE", "United Arab Emirates", "امارات", "الإمارات", "Birleşik Arap Emirlikleri", "Birləşmiş Ərəb Əmirlikləri", "متحدہ عرب امارات", "ئیمارات"),
  L("QA", "Qatar", "قطر", "قطر", "Katar", "Qətər", "قطر", "قەتەر"),
  L("UZ", "Uzbekistan", "ازبکستان", "أوزبكستان", "Özbekistan", "Özbəkistan", "ازبکستان", "ئۆزبەکستان"),
  L("KZ", "Kazakhstan", "قزاقستان", "كازاخستان", "Kazakistan", "Qazaxıstan", "قزاقستان", "کازاخستان"),
  L("IN", "India", "هند", "الهند", "Hindistan", "Hindistan", "بھارت", "هیندستان"),
  L("ID", "Indonesia", "اندونزی", "إندونيسيا", "Endonezya", "İndoneziya", "انڈونیشیا", "ئیندۆنیزیا"),
  L("TH", "Thailand", "تایلند", "تايلاند", "Tayland", "Tailand", "تھائی لینڈ", "تایلەند"),
  L("VN", "Vietnam", "ویتنام", "فيتنام", "Vietnam", "Vyetnam", "ویتنام", "ڤیەتنام"),
  L("MY", "Malaysia", "مالزی", "ماليزيا", "Malezya", "Malayziya", "ملائیشیا", "مالیزیا"),
  L("SY", "Syria", "سوریه", "سوريا", "Suriye", "Suriya", "شام", "سووریا"),
  L("JO", "Jordan", "اردن", "الأردن", "Ürdün", "İordaniya", "اردن", "ئوردن"),
  L("LB", "Lebanon", "لبنان", "لبنان", "Lübnan", "Livan", "لبنان", "لوبنان"),
  L("PS", "Palestine", "فلسطین", "فلسطين", "Filistin", "Fələstin", "فلسطین", "فەلەستین"),
  L("CN", "China", "چین", "الصين", "Çin", "Çin", "چین", "چین"),
  L("AU", "Australia", "استرالیا", "أستراليا", "Avustralya", "Avstraliya", "آسٹریلیا", "ئوسترالیا"),
  L("OM", "Oman", "عمان", "عُمان", "Umman", "Oman", "عمان", "عومان"),
  L("BH", "Bahrain", "بحرین", "البحرين", "Bahreyn", "Bəhreyn", "بحرین", "بەحرەین"),
  L("KW", "Kuwait", "کویت", "الكويت", "Kuveyt", "Küveyt", "کویت", "کوەیت"),
  L("BD", "Bangladesh", "بنگلادش", "بنغلاديش", "Bangladeş", "Banqladeş", "بنگلہ دیش", "بەنگلادیش"),
  L("PH", "Philippines", "فیلیپین", "الفلبين", "Filipinler", "Filippin", "فلپائن", "فیلیپین"),
  L("SG", "Singapore", "سنگاپور", "سنغافورة", "Singapur", "Sinqapur", "سنگاپور", "سینگاپور"),
  L("TJ", "Tajikistan", "تاجیکستان", "طاجيكستان", "Tacikistan", "Tacikistan", "تاجکستان", "تاجیکستان"),
  L("KG", "Kyrgyzstan", "قرقیزستان", "قيرغيزستان", "Kırgızistan", "Qırğızıstan", "کرغزستان", "قرغیزستان"),
  L("YE", "Yemen", "یمن", "اليمن", "Yemen", "Yəmən", "یمن", "یەمەن"),
  L("NP", "Nepal", "نپال", "نيبال", "Nepal", "Nepal", "نیپال", "نیپال"),
  L("MM", "Myanmar", "میانمار", "ميانمار", "Myanmar", "Myanma", "میانمار", "میانمار"),
  L("KH", "Cambodia", "کامبوج", "كمبوديا", "Kamboçya", "Kamboca", "کمبوڈیا", "کامبۆجیا"),
  L("LA", "Laos", "لائوس", "لاوس", "Laos", "Laos", "لاؤس", "لائۆس"),
  L("MN", "Mongolia", "مغولستان", "منغوليا", "Moğolistan", "Monqolustan", "منگولیا", "مەنگۆلیا"),
  L("HK", "Hong Kong", "هنگ‌کنگ", "هونغ كونغ", "Hong Kong", "Honkonq", "ہانگ کانگ", "هۆنگ کۆنگ"),
  L("TW", "Chinese Taipei", "چین تایپه", "تايبيه الصينية", "Çin Taipeyi", "Çin Taybeyi", "چینی تائیپے", "تایپەی چینی"),
];

export const REGIONS: { id: string; countries: string[] }[] = [
  { id: "west", countries: ["IR", "IQ", "TR", "AZ", "AM", "SY", "JO", "LB", "PS", "AF"] },
  { id: "gulf", countries: ["SA", "AE", "QA", "KW", "BH", "OM", "YE"] },
  { id: "central", countries: ["UZ", "KZ", "TJ", "KG", "TM"] },
  { id: "south", countries: ["IN", "PK", "BD", "NP"] },
  { id: "east", countries: ["JP", "KR", "CN", "HK", "TW", "MN", "AU"] },
  { id: "sea", countries: ["ID", "TH", "VN", "MY", "PH", "SG", "MM", "KH", "LA"] },
];

export const PITCH_COORDS: Record<string, { x: number; y: number }> = {
  GK: { x: 50, y: 90 },
  CB: { x: 50, y: 76 },
  LB: { x: 16, y: 72 },
  RB: { x: 84, y: 72 },
  LWB: { x: 12, y: 60 },
  RWB: { x: 88, y: 60 },
  CDM: { x: 50, y: 62 },
  CM: { x: 50, y: 50 },
  CAM: { x: 50, y: 38 },
  LM: { x: 16, y: 50 },
  RM: { x: 84, y: 50 },
  LW: { x: 16, y: 26 },
  RW: { x: 84, y: 26 },
  CF: { x: 50, y: 24 },
  ST: { x: 50, y: 16 },
};

/** Attack plays to the right — used on the landing pitch. */
export const WIDE_PITCH_COORDS: Record<string, { x: number; y: number }> = {
  GK: { x: 8, y: 50 },
  CB: { x: 20, y: 50 },
  LB: { x: 22, y: 18 },
  RB: { x: 22, y: 82 },
  LWB: { x: 32, y: 12 },
  RWB: { x: 32, y: 88 },
  CDM: { x: 36, y: 50 },
  CM: { x: 50, y: 50 },
  CAM: { x: 64, y: 50 },
  LM: { x: 50, y: 18 },
  RM: { x: 50, y: 82 },
  LW: { x: 78, y: 18 },
  RW: { x: 78, y: 82 },
  CF: { x: 84, y: 50 },
  ST: { x: 92, y: 50 },
};

export function labeled(list: Labeled[], id: string | null | undefined, locale: Locale) {
  if (!id) return "—";
  const row = list.find((x) => x.id === id);
  if (!row) return id;
  return row[locale] || row.en;
}

export function countryName(id: string | null | undefined, locale: Locale) {
  return labeled(COUNTRIES, id, locale);
}

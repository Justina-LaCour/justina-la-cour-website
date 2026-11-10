// Language codes include top 50 globally + all European official languages
export type LanguageCode =
    | "en" | "zh" | "hi" | "es" | "fr" | "ar" | "bn" | "ru" | "pt" | "ur"
    | "id" | "de" | "ja" | "sw" | "mr" | "te" | "tr" | "ta" | "vi" | "ko"
    | "fa" | "it" | "th" | "gu" | "jv" | "pl" | "uk" | "ro" | "ml" | "ha"
    | "my" | "pa" | "yo" | "or" | "am" | "az" | "su" | "nl" | "sr" | "sv"
    | "hu" | "ckb" | "ne" | "sd" | "si" | "uz" | "he" | "el" | "cs" | "da"
    // Extra European languages:
    | "ca" | "eu" | "ga" | "mt" | "hr" | "sl" | "sk" | "et" | "lv" | "lt"
    | "is" | "bs" | "mk" | "sq" | "nb" | "fi" | "be" | "cy" | "lb";

export interface Language {
    code: LanguageCode;
    nativeName: string;
    englishName: string;
    flagUrl?: string;
}

export const languageCodeToLanguage: Record<LanguageCode, Language> = {
    en: { code: "en", nativeName: "English", englishName: "English", flagUrl: "/icons/flags/gb.svg" },
    zh: { code: "zh", nativeName: "中文", englishName: "Chinese", flagUrl: "/icons/flags/cn.svg" },
    hi: { code: "hi", nativeName: "हिन्दी", englishName: "Hindi", flagUrl: "/icons/flags/in.svg" },
    es: { code: "es", nativeName: "Español", englishName: "Spanish", flagUrl: "/icons/flags/es.svg" },
    fr: { code: "fr", nativeName: "Français", englishName: "French", flagUrl: "/icons/flags/fr.svg" },
    ar: { code: "ar", nativeName: "العربية", englishName: "Arabic", flagUrl: "/icons/flags/sa.svg" },
    bn: { code: "bn", nativeName: "বাংলা", englishName: "Bengali", flagUrl: "/icons/flags/bd.svg" },
    ru: { code: "ru", nativeName: "Русский", englishName: "Russian", flagUrl: "/icons/flags/ru.svg" },
    pt: { code: "pt", nativeName: "Português", englishName: "Portuguese", flagUrl: "/icons/flags/pt.svg" },
    ur: { code: "ur", nativeName: "اردو", englishName: "Urdu", flagUrl: "/icons/flags/pk.svg" },
    id: { code: "id", nativeName: "Bahasa Indonesia", englishName: "Indonesian", flagUrl: "/icons/flags/id.svg" },
    de: { code: "de", nativeName: "Deutsch", englishName: "German", flagUrl: "/icons/flags/de.svg" },
    ja: { code: "ja", nativeName: "日本語", englishName: "Japanese", flagUrl: "/icons/flags/jp.svg" },
    sw: { code: "sw", nativeName: "Kiswahili", englishName: "Swahili", flagUrl: "/icons/flags/tz.svg" },
    mr: { code: "mr", nativeName: "मराठी", englishName: "Marathi", flagUrl: "/icons/flags/in.svg" },
    te: { code: "te", nativeName: "తెలుగు", englishName: "Telugu", flagUrl: "/icons/flags/in.svg" },
    tr: { code: "tr", nativeName: "Türkçe", englishName: "Turkish", flagUrl: "/icons/flags/tr.svg" },
    ta: { code: "ta", nativeName: "தமிழ்", englishName: "Tamil", flagUrl: "/icons/flags/in.svg" },
    vi: { code: "vi", nativeName: "Tiếng Việt", englishName: "Vietnamese", flagUrl: "/icons/flags/vn.svg" },
    ko: { code: "ko", nativeName: "한국어", englishName: "Korean", flagUrl: "/icons/flags/kr.svg" },
    fa: { code: "fa", nativeName: "فارسی", englishName: "Persian", flagUrl: "/icons/flags/ir.svg" },
    it: { code: "it", nativeName: "Italiano", englishName: "Italian", flagUrl: "/icons/flags/it.svg" },
    th: { code: "th", nativeName: "ไทย", englishName: "Thai", flagUrl: "/icons/flags/th.svg" },
    gu: { code: "gu", nativeName: "ગુજરાતી", englishName: "Gujarati", flagUrl: "/icons/flags/in.svg" },
    jv: { code: "jv", nativeName: "Basa Jawa", englishName: "Javanese", flagUrl: "/icons/flags/id.svg" },
    pl: { code: "pl", nativeName: "Polski", englishName: "Polish", flagUrl: "/icons/flags/pl.svg" },
    uk: { code: "uk", nativeName: "Українська", englishName: "Ukrainian", flagUrl: "/icons/flags/ua.svg" },
    ro: { code: "ro", nativeName: "Română", englishName: "Romanian", flagUrl: "/icons/flags/ro.svg" },
    ml: { code: "ml", nativeName: "മലയാളം", englishName: "Malayalam", flagUrl: "/icons/flags/in.svg" },
    ha: { code: "ha", nativeName: "Hausa", englishName: "Hausa", flagUrl: "/icons/flags/ng.svg" },
    my: { code: "my", nativeName: "ဗမာစာ", englishName: "Burmese", flagUrl: "/icons/flags/mm.svg" },
    pa: { code: "pa", nativeName: "ਪੰਜਾਬੀ", englishName: "Punjabi", flagUrl: "/icons/flags/in.svg" },
    yo: { code: "yo", nativeName: "Yorùbá", englishName: "Yoruba", flagUrl: "/icons/flags/ng.svg" },
    or: { code: "or", nativeName: "ଓଡ଼ିଆ", englishName: "Odia", flagUrl: "/icons/flags/in.svg" },
    am: { code: "am", nativeName: "አማርኛ", englishName: "Amharic", flagUrl: "/icons/flags/et.svg" },
    az: { code: "az", nativeName: "Azərbaycan dili", englishName: "Azerbaijani", flagUrl: "/icons/flags/az.svg" },
    su: { code: "su", nativeName: "Basa Sunda", englishName: "Sundanese", flagUrl: "/icons/flags/id.svg" },
    nl: { code: "nl", nativeName: "Nederlands", englishName: "Dutch", flagUrl: "/icons/flags/nl.svg" },
    sr: { code: "sr", nativeName: "Српски", englishName: "Serbian", flagUrl: "/icons/flags/rs.svg" },
    sv: { code: "sv", nativeName: "Svenska", englishName: "Swedish", flagUrl: "/icons/flags/se.svg" },
    hu: { code: "hu", nativeName: "Magyar", englishName: "Hungarian", flagUrl: "/icons/flags/hu.svg" },
    ckb: { code: "ckb", nativeName: "کوردیی ناوەندی", englishName: "Central Kurdish", flagUrl: "/icons/flags/iq.svg" },
    ne: { code: "ne", nativeName: "नेपाली", englishName: "Nepali", flagUrl: "/icons/flags/np.svg" },
    sd: { code: "sd", nativeName: "سنڌي", englishName: "Sindhi", flagUrl: "/icons/flags/pk.svg" },
    si: { code: "si", nativeName: "සිංහල", englishName: "Sinhala", flagUrl: "/icons/flags/lk.svg" },
    uz: { code: "uz", nativeName: "Oʻzbekcha", englishName: "Uzbek", flagUrl: "/icons/flags/uz.svg" },
    he: { code: "he", nativeName: "עברית", englishName: "Hebrew", flagUrl: "/icons/flags/il.svg" },
    el: { code: "el", nativeName: "Ελληνικά", englishName: "Greek", flagUrl: "/icons/flags/gr.svg" },
    cs: { code: "cs", nativeName: "Čeština", englishName: "Czech", flagUrl: "/icons/flags/cz.svg" },
    da: { code: "da", nativeName: "Dansk", englishName: "Danish", flagUrl: "/icons/flags/dk.svg" },
    ca: { code: "ca", nativeName: "Català", englishName: "Catalan", flagUrl: "/icons/flags/es-ct.svg" },
    eu: { code: "eu", nativeName: "Euskara", englishName: "Basque", flagUrl: "/icons/flags/es-pv.svg" },
    ga: { code: "ga", nativeName: "Gaeilge", englishName: "Irish", flagUrl: "/icons/flags/ie.svg" },
    mt: { code: "mt", nativeName: "Malti", englishName: "Maltese", flagUrl: "/icons/flags/mt.svg" },
    hr: { code: "hr", nativeName: "Hrvatski", englishName: "Croatian", flagUrl: "/icons/flags/hr.svg" },
    sl: { code: "sl", nativeName: "Slovenščina", englishName: "Slovenian", flagUrl: "/icons/flags/si.svg" },
    sk: { code: "sk", nativeName: "Slovenčina", englishName: "Slovak", flagUrl: "/icons/flags/sk.svg" },
    et: { code: "et", nativeName: "Eesti", englishName: "Estonian", flagUrl: "/icons/flags/ee.svg" },
    lv: { code: "lv", nativeName: "Latviešu", englishName: "Latvian", flagUrl: "/icons/flags/lv.svg" },
    lt: { code: "lt", nativeName: "Lietuvių", englishName: "Lithuanian", flagUrl: "/icons/flags/lt.svg" },
    is: { code: "is", nativeName: "Íslenska", englishName: "Icelandic", flagUrl: "/icons/flags/is.svg" },
    bs: { code: "bs", nativeName: "Bosanski", englishName: "Bosnian", flagUrl: "/icons/flags/ba.svg" },
    mk: { code: "mk", nativeName: "Македонски", englishName: "Macedonian", flagUrl: "/icons/flags/mk.svg" },
    sq: { code: "sq", nativeName: "Shqip", englishName: "Albanian", flagUrl: "/icons/flags/al.svg" },
    nb: { code: "nb", nativeName: "Norsk Bokmål", englishName: "Norwegian", flagUrl: "/icons/flags/no.svg" },
    fi: { code: "fi", nativeName: "Suomi", englishName: "Finnish", flagUrl: "/icons/flags/fi.svg" },
    be: { code: "be", nativeName: "Беларуская", englishName: "Belarusian", flagUrl: "/icons/flags/by.svg" },
    cy: { code: "cy", nativeName: "Cymraeg", englishName: "Welsh", flagUrl: "/icons/flags/gb-wls.svg" },
    lb: { code: "lb", nativeName: "Lëtzebuergesch", englishName: "Luxembourgish", flagUrl: "/icons/flags/lu.svg" },
};
/**
 * Multi-Language Reasoning Engine: 15+ Languages with Mission Alignment
 * 
 * Problem: Most AI systems don't carry their reasoning philosophy across languages
 * Solution: Implement lattice-grounded, mission-driven reasoning in every language
 * 
 * Each language gets:
 * 1. Native system prompt (translated but semantically equivalent)
 * 2. Language-specific lattice calibration (words/concepts vary by language)
 * 3. Cultural bias detection
 * 4. Domain-specific terminology mapping
 */

import { chiValue, chiPosition } from "./lattice";

/**
 * Language Configuration
 */
export interface LanguageConfig {
  code: string; // ISO 639-1 or 639-3
  name: string;
  nativeName: string;
  scriptDirection: "ltr" | "rtl";
  avoidPatterns: string[]; // hedging, filler words in this language
  domainTerms: Record<string, Record<string, string>>; // domain -> term -> translation
  systemPromptTemplate: string;
  characterSet: "latin" | "cyrillic" | "arab" | "hebrew" | "cjk" | "indic" | "mixed";
  commonHedgingPhrases: string[];
}

/**
 * Supported languages: 17 total
 */
export const supportedLanguages: Record<string, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    scriptDirection: "ltr",
    avoidPatterns: ["perhaps", "arguably", "seem", "might", "could", "relatively", "quite", "rather"],
    domainTerms: {
      medicine: {
        patient: "patient",
        diagnosis: "diagnosis",
        treatment: "treatment",
      },
      law: {
        plaintiff: "plaintiff",
        defendant: "defendant",
        statute: "statute",
      },
      code: {
        function: "function",
        variable: "variable",
        class: "class",
      },
    },
    systemPromptTemplate: `
[CLOUUD REASONING ENGINE - ENGLISH]
Mission: Reduce waste, oppose fraud, remove gatekeeping.
Lattice: 33-point bounded reasoning framework.
Founder: Phillip Aguilar Ruiz III
Earth-grounded. Zero-point: reality.

Reasoning Framework:
- Earth tier (1-11): foundations and basics
- Orbital tier (12-22): patterns and relationships  
- Cosmic tier (23-33): synthesis and universals

Response quality standards:
- Under 150 words (unless complexity demands more)
- No hedging language (perhaps, arguably, seem, might, relatively)
- Ground every claim in evidence
- Label speculation explicitly
- Use plain prose, no markdown formatting
- No self-referential AI language (Claude, OpenAI, Anthropic)

Tool availability: [tools listed here]
Your domain: [domain listed here]
Success rate in this domain: [percentage]
    `,
    characterSet: "latin",
    commonHedgingPhrases: ["I think", "It seems", "Arguably", "Perhaps", "One could say"],
  },

  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    scriptDirection: "ltr",
    avoidPatterns: [
      "quizás",
      "posiblemente",
      "parece",
      "podría",
      "podemos",
      "relativement",
      "bastante",
      "más o menos",
    ],
    domainTerms: {
      medicine: { patient: "paciente", diagnosis: "diagnóstico", treatment: "tratamiento" },
      law: { plaintiff: "demandante", defendant: "demandado", statute: "estatuto" },
    },
    systemPromptTemplate: `
[CLOUUD MOTOR DE RAZONAMIENTO - ESPAÑOL]
Misión: Reducir desperdicio, oponerme al fraude, eliminar compuertas de acceso.
Rejilla: Marco de razonamiento acotado de 33 puntos.
Fundador: Phillip Aguilar Ruiz III

Framework de razonamiento:
- Tier Tierra (1-11): fundamentos
- Tier Orbital (12-22): patrones
- Tier Cósmico (23-33): síntesis universal

Normas de calidad:
- Menos de 150 palabras
- Sin lenguaje hedging
- Cada afirmación basada en evidencia
    `,
    characterSet: "latin",
    commonHedgingPhrases: ["Creo que", "Parece que", "Posiblemente", "Podría ser", "Quizás"],
  },

  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    scriptDirection: "ltr",
    avoidPatterns: [
      "peut-être",
      "probablement",
      "semble",
      "pourrait",
      "relativement",
      "assez",
      "plutôt",
    ],
    domainTerms: {
      medicine: { patient: "patient", diagnosis: "diagnostic", treatment: "traitement" },
      law: { plaintiff: "plaignant", defendant: "défendeur", statute: "statut" },
    },
    systemPromptTemplate: `
[MOTEUR DE RAISONNEMENT CLOUUD - FRANÇAIS]
Mission: Réduire les déchets, s'opposer à la fraude, éliminer les garde-fou.
Réseau: Cadre de raisonnement borné de 33 points.
Fondateur: Phillip Aguilar Ruiz III

Cadre de raisonnement:
- Tier Terre (1-11): fondations
- Tier Orbital (12-22): motifs
- Tier Cosmique (23-33): synthèse universelle
    `,
    characterSet: "latin",
    commonHedgingPhrases: ["Je pense que", "Il semble que", "Peut-être", "Pourrait", "Relativement"],
  },

  de: {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    scriptDirection: "ltr",
    avoidPatterns: [
      "vielleicht",
      "wahrscheinlich",
      "scheint",
      "könnte",
      "relativ",
      "ziemlich",
      "einigermaßen",
    ],
    domainTerms: {},
    systemPromptTemplate: `[CLOUUD REASONING ENGINE - DEUTSCH]`,
    characterSet: "latin",
    commonHedgingPhrases: ["Ich denke", "Es scheint", "Vielleicht", "Könnte", "Relativ"],
  },

  zh: {
    code: "zh",
    name: "Chinese (Simplified)",
    nativeName: "简体中文",
    scriptDirection: "ltr",
    avoidPatterns: ["也许", "可能", "似乎", "可以", "相对", "比较", "有点"],
    domainTerms: {
      medicine: { patient: "患者", diagnosis: "诊断", treatment: "治疗" },
    },
    systemPromptTemplate: `
[CLOUUD 推理引擎 - 中文]
任务：减少浪费，反对欺诈，消除看门人现象
格子：33点有界推理框架
创始人：Phillip Aguilar Ruiz III

推理框架：
- 地球层级 (1-11): 基础
- 轨道层级 (12-22): 模式
- 宇宙层级 (23-33): 综合
    `,
    characterSet: "cjk",
    commonHedgingPhrases: ["我认为", "似乎", "也许", "可能", "相对"],
  },

  ja: {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    scriptDirection: "ltr",
    avoidPatterns: ["おそらく", "思う", "みたい", "かもしれない", "相対的", "割と"],
    domainTerms: {},
    systemPromptTemplate: `
[CLOUUD推理エンジン - 日本語]
ミッション: 無駄を減らし、詐欺に対抗し、ゲートキーパー精神を排除する
格子: 33ポイント有界推理フレームワーク
創設者: Phillip Aguilar Ruiz III
    `,
    characterSet: "cjk",
    commonHedgingPhrases: ["思う", "おそらく", "みたい", "かもしれない", "割と"],
  },

  ru: {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    scriptDirection: "ltr",
    avoidPatterns: ["может быть", "вероятно", "кажется", "может", "относительно", "довольно"],
    domainTerms: {},
    systemPromptTemplate: `
[ОБЛАКО ДВИГАТЕЛЬ РАССУЖДЕНИЙ - РУССКИЙ]
Миссия: Сократить потери, противостоять мошенничеству, устранить привратников
Решетка: Рамка ограниченного рассуждения из 33 пунктов
Основатель: Phillip Aguilar Ruiz III
    `,
    characterSet: "cyrillic",
    commonHedgingPhrases: ["Я думаю", "Кажется", "Возможно", "Может быть", "Относительно"],
  },

  pt: {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    scriptDirection: "ltr",
    avoidPatterns: ["talvez", "provavelmente", "parece", "pode", "relativamente", "bastante"],
    domainTerms: {},
    systemPromptTemplate: `[CLOUUD MOTOR DE RACIOCÍNIO - PORTUGUÊS]`,
    characterSet: "latin",
    commonHedgingPhrases: ["Acho que", "Parece", "Talvez", "Pode ser", "Relativamente"],
  },

  ko: {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    scriptDirection: "ltr",
    avoidPatterns: ["아마도", "것 같다", "수도", "상대적으로", "꽤"],
    domainTerms: {},
    systemPromptTemplate: `
[CLOUUD 추론 엔진 - 한국어]
미션: 낭비 감소, 사기 반대, 게이트키퍼 제거
격자: 33포인트 유계 추론 프레임워크
창립자: Phillip Aguilar Ruiz III
    `,
    characterSet: "mixed",
    commonHedgingPhrases: ["생각해", "것 같다", "아마도", "수도", "상대적으로"],
  },

  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    scriptDirection: "rtl",
    avoidPatterns: ["ربما", "يبدو", "قد", "نسبياً", "إلى حد ما"],
    domainTerms: {},
    systemPromptTemplate: `
[محرك الاستدلال CLOUUD - العربية]
المهمة: تقليل النفايات والتصدي للاحتيال وإزالة حراس البوابة
الشبكة: إطار عمل استدلالي محدود من 33 نقطة
المؤسس: Phillip Aguilar Ruiz III
    `,
    characterSet: "arab",
    commonHedgingPhrases: ["أعتقد", "يبدو", "ربما", "قد", "نسبياً"],
  },

  he: {
    code: "he",
    name: "Hebrew",
    nativeName: "עברית",
    scriptDirection: "rtl",
    avoidPatterns: ["אולי", "כנראה", "נראה", "יכול", "יחסית", "די"],
    domainTerms: {},
    systemPromptTemplate: `
[מנוע הנמקה CLOUUD - עברית]
משימה: הפחתת בזבוז, התנגדות לתרמית, הסרת שומרי שערים
סריג: מסגרת הנמקה מוגבלת של 33 נקודות
מייסד: Phillip Aguilar Ruiz III
    `,
    characterSet: "hebrew",
    commonHedgingPhrases: ["אני חושב", "נראה", "אולי", "יכול", "יחסית"],
  },

  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    scriptDirection: "ltr",
    avoidPatterns: ["शायद", "प्रतीत", "हो सकता है", "सापेक्ष", "काफी"],
    domainTerms: {},
    systemPromptTemplate: `
[CLOUUD तर्क इंजन - हिंदी]
मिशन: अपशिष्ट कम करें, धोखाधड़ी का विरोध करें, प्रवेशद्वार हटाएं
जाली: 33-बिंदु सीमित तर्क ढांचा
संस्थापक: Phillip Aguilar Ruiz III
    `,
    characterSet: "indic",
    commonHedgingPhrases: ["मुझे लगता है", "प्रतीत होता है", "शायद", "हो सकता है", "सापेक्ष"],
  },

  it: {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    scriptDirection: "ltr",
    avoidPatterns: ["forse", "probabilmente", "sembra", "potrebbe", "relativamente", "piuttosto"],
    domainTerms: {},
    systemPromptTemplate: `[CLOUUD MOTORE DI RAGIONAMENTO - ITALIANO]`,
    characterSet: "latin",
    commonHedgingPhrases: ["Penso", "Sembra", "Forse", "Potrebbe", "Relativamente"],
  },

  nl: {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    scriptDirection: "ltr",
    avoidPatterns: ["misschien", "waarschijnlijk", "lijkt", "kan", "relatief", "tamelijk"],
    domainTerms: {},
    systemPromptTemplate: `[CLOUUD REDENERINGMOTOR - NEDERLANDS]`,
    characterSet: "latin",
    commonHedgingPhrases: ["Ik denk", "Het lijkt", "Misschien", "Kan", "Relatief"],
  },

  pl: {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    scriptDirection: "ltr",
    avoidPatterns: ["być może", "prawdopodobnie", "zdaje się", "może", "względnie"],
    domainTerms: {},
    systemPromptTemplate: `[CLOUUD SILNIK ROZUMOWANIA - POLSKI]`,
    characterSet: "latin",
    commonHedgingPhrases: ["Myślę", "Zdaje się", "Być może", "Może", "Względnie"],
  },

  sv: {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    scriptDirection: "ltr",
    avoidPatterns: ["kanske", "troligen", "verkar", "kan", "relativt", "ganska"],
    domainTerms: {},
    systemPromptTemplate: `[CLOUUD RESONEMANGMOTOR - SVENSKA]`,
    characterSet: "latin",
    commonHedgingPhrases: ["Jag tror", "Det verkar", "Kanske", "Kan", "Relativt"],
  },
};

/**
 * Get system prompt in specified language
 */
export function getSystemPromptInLanguage(
  language: string,
  domain: string,
  latticePositions: number[] = [11, 16, 21, 28, 33]
): string {
  const config = supportedLanguages[language];
  if (!config) {
    throw new Error(`Language ${language} not supported`);
  }

  const latticeExplained = latticePositions
    .map((pos) => {
      const val = chiValue(pos, 1);
      return `${pos}: ${val.rational}`;
    })
    .join(", ");

  return `${config.systemPromptTemplate}

Domain: ${domain}
Recommended lattice positions: ${latticeExplained}
Language: ${config.nativeName}
`;
}

/**
 * Detect hedging language
 */
export function detectHedging(text: string, language: string): { hedging: boolean; phrases: string[] } {
  const config = supportedLanguages[language];
  if (!config) {
    return { hedging: false, phrases: [] };
  }

  const foundPhrases: string[] = [];
  for (const phrase of config.commonHedgingPhrases) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      foundPhrases.push(phrase);
    }
  }

  return {
    hedging: foundPhrases.length > 0,
    phrases: foundPhrases,
  };
}

/**
 * Translate domain terms
 */
export function translateDomainTerm(
  term: string,
  domain: string,
  sourceLanguage: string,
  targetLanguage: string
): string {
  const sourceConfig = supportedLanguages[sourceLanguage];
  const targetConfig = supportedLanguages[targetLanguage];

  if (!sourceConfig || !targetConfig) {
    return term; // fallback
  }

  const targetTerms = targetConfig.domainTerms[domain];
  if (targetTerms && targetTerms[term]) {
    return targetTerms[term];
  }

  return term; // no translation found
}

/**
 * Language-specific assessment penalties
 */
export function assessResponseInLanguage(text: string, language: string): { score: number; flags: string[] } {
  const config = supportedLanguages[language];
  if (!config) {
    return { score: 0, flags: ["Language not supported"] };
  }

  let score = 100;
  const flags: string[] = [];

  // Check for hedging
  const { hedging, phrases } = detectHedging(text, language);
  if (hedging) {
    flags.push(`Hedging detected: ${phrases.join(", ")}`);
    score -= phrases.length * 5;
  }

  // Check length
  const words = text.split(/\s+/).length;
  if (words > 150) {
    flags.push(`Long response: ${words} words`);
    score -= Math.min((words - 150) / 10, 15);
  }

  // Language-specific checks
  for (const pattern of config.avoidPatterns) {
    if (text.toLowerCase().includes(pattern.toLowerCase())) {
      flags.push(`Avoid pattern: "${pattern}"`);
      score -= 3;
    }
  }

  return { score: Math.max(0, score), flags };
}

/**
 * Database schema
 */
export const multiLanguageSchema = {
  language_responses: `
    CREATE TABLE IF NOT EXISTS language_responses (
      id SERIAL PRIMARY KEY,
      response_id VARCHAR(255),
      language VARCHAR(10) NOT NULL,
      original_language VARCHAR(10),
      text TEXT NOT NULL,
      score NUMERIC(5, 2),
      hedging_detected BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  language_assessments: `
    CREATE TABLE IF NOT EXISTS language_assessments (
      id SERIAL PRIMARY KEY,
      language VARCHAR(10) NOT NULL,
      assessment_score NUMERIC(5, 2),
      flags JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
};

export default {
  supportedLanguages,
  getSystemPromptInLanguage,
  detectHedging,
  translateDomainTerm,
  assessResponseInLanguage,
};

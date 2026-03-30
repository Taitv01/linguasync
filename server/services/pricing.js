/**
 * LinguaSync — Pricing Service
 * Handles all pricing calculations for quotes
 */

const PRICING_CONFIG = {
  baseRate: 50,
  baseMinutes: 5,
  perMinuteRate: 15,
  lipSyncFeePerLang: 20,
  rushMultiplier: 1.30,
  multiLangDiscount: 0.15,
  multiLangThreshold: 3,

  languages: {
    en: { name: 'English', flag: '🇺🇸' },
    vi: { name: 'Vietnamese', flag: '🇻🇳' },
    ja: { name: 'Japanese', flag: '🇯🇵' },
    ko: { name: 'Korean', flag: '🇰🇷' },
    zh: { name: 'Chinese', flag: '🇨🇳' },
    th: { name: 'Thai', flag: '🇹🇭' },
    es: { name: 'Spanish', flag: '🇪🇸' },
    fr: { name: 'French', flag: '🇫🇷' },
    de: { name: 'German', flag: '🇩🇪' },
    pt: { name: 'Portuguese', flag: '🇧🇷' },
    id: { name: 'Indonesian', flag: '🇮🇩' },
    hi: { name: 'Hindi', flag: '🇮🇳' },
  }
};

function calculateQuote({ duration, targetLanguages, lipSync = false, rush = false, subtitles = true }) {
  if (!duration || !targetLanguages || targetLanguages.length === 0) {
    return { error: 'Duration and at least one target language are required.' };
  }

  const numLangs = targetLanguages.length;
  const breakdown = [];

  // Base dubbing cost
  let baseCost = duration <= PRICING_CONFIG.baseMinutes
    ? PRICING_CONFIG.baseRate
    : PRICING_CONFIG.baseRate + ((duration - PRICING_CONFIG.baseMinutes) * PRICING_CONFIG.perMinuteRate);

  const totalBase = baseCost * numLangs;
  breakdown.push({
    item: `AI Dubbing (${duration} min × ${numLangs} languages)`,
    amount: totalBase
  });

  // Lip-sync
  let lipSyncTotal = 0;
  if (lipSync) {
    lipSyncTotal = PRICING_CONFIG.lipSyncFeePerLang * numLangs;
    breakdown.push({
      item: `Lip-sync matching (${numLangs} × $${PRICING_CONFIG.lipSyncFeePerLang})`,
      amount: lipSyncTotal
    });
  }

  let subtotal = totalBase + lipSyncTotal;

  // Multi-language discount
  let discount = 0;
  if (numLangs >= PRICING_CONFIG.multiLangThreshold) {
    discount = subtotal * PRICING_CONFIG.multiLangDiscount;
    breakdown.push({
      item: `Multi-language discount (${numLangs} langs, -15%)`,
      amount: -Math.round(discount)
    });
    subtotal -= discount;
  }

  // Rush fee
  let rushFee = 0;
  if (rush) {
    rushFee = subtotal * (PRICING_CONFIG.rushMultiplier - 1);
    breakdown.push({
      item: 'Rush delivery surcharge (+30%)',
      amount: Math.round(rushFee)
    });
  }

  const total = Math.round(subtotal + rushFee);

  // Subtitles
  if (subtitles) {
    breakdown.push({ item: 'Subtitle files (SRT/VTT)', amount: 0, note: 'Included free' });
  }

  // Turnaround days
  let turnaroundDays;
  if (rush) turnaroundDays = 1;
  else if (duration <= 10 && numLangs <= 2) turnaroundDays = 2;
  else if (duration <= 30 && numLangs <= 3) turnaroundDays = 3;
  else turnaroundDays = 4;

  // Language names
  const langNames = targetLanguages.map(code => {
    const lang = PRICING_CONFIG.languages[code];
    return lang ? `${lang.flag} ${lang.name}` : code;
  });

  return {
    total,
    perLanguage: Math.round(total / numLangs),
    breakdown,
    turnaroundDays,
    duration,
    targetLanguages: langNames,
    options: { lipSync, rush, subtitles },
    currency: 'USD',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
}

function getPricingTable() {
  return {
    plans: [
      { name: 'Basic Dubbing', description: '1 language, ≤5 min', priceRange: '$50–80', features: ['AI dubbing', 'Human QC', 'SRT/VTT subtitles'] },
      { name: 'Advanced Dubbing', description: '1 language, ≤15 min', priceRange: '$100–200', features: ['AI dubbing', 'Lip-sync', 'Human QC', 'SRT/VTT subtitles'] },
      { name: 'Multi-Language Pack', description: '3 languages, ≤10 min', priceRange: '$250–400', features: ['AI dubbing', 'Lip-sync', 'Human QC', '15% multi-lang discount', 'Cultural adaptation'] },
      { name: 'Monthly Retainer', description: '≤20 videos/month', priceRange: '$800–1,500', features: ['Everything in Advanced', 'Priority processing', '20-30% discount', 'Dedicated account manager'] },
    ],
    config: PRICING_CONFIG,
  };
}

module.exports = { calculateQuote, getPricingTable, PRICING_CONFIG };

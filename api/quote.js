const PRICING_CONFIG = {
  baseRate: 50, baseMinutes: 5, perMinuteRate: 15,
  lipSyncFeePerLang: 20, rushMultiplier: 1.30,
  multiLangDiscount: 0.15, multiLangThreshold: 3,
  languages: {
    en: { name: 'English', flag: '🇺🇸' }, vi: { name: 'Vietnamese', flag: '🇻🇳' },
    ja: { name: 'Japanese', flag: '🇯🇵' }, ko: { name: 'Korean', flag: '🇰🇷' },
    zh: { name: 'Chinese', flag: '🇨🇳' }, th: { name: 'Thai', flag: '🇹🇭' },
    es: { name: 'Spanish', flag: '🇪🇸' }, fr: { name: 'French', flag: '🇫🇷' },
    de: { name: 'German', flag: '🇩🇪' }, pt: { name: 'Portuguese', flag: '🇧🇷' },
    id: { name: 'Indonesian', flag: '🇮🇩' }, hi: { name: 'Hindi', flag: '🇮🇳' },
  }
};

function calculateQuote({ duration, targetLanguages, lipSync, rush, subtitles }) {
  const numLangs = targetLanguages.length;
  const breakdown = [];
  let baseCost = duration <= PRICING_CONFIG.baseMinutes
    ? PRICING_CONFIG.baseRate
    : PRICING_CONFIG.baseRate + ((duration - PRICING_CONFIG.baseMinutes) * PRICING_CONFIG.perMinuteRate);
  const totalBase = baseCost * numLangs;
  breakdown.push({ item: `AI Dubbing (${duration} min × ${numLangs} languages)`, amount: totalBase });

  let lipSyncTotal = 0;
  if (lipSync) {
    lipSyncTotal = PRICING_CONFIG.lipSyncFeePerLang * numLangs;
    breakdown.push({ item: `Lip-sync matching (${numLangs} × $${PRICING_CONFIG.lipSyncFeePerLang})`, amount: lipSyncTotal });
  }

  let subtotal = totalBase + lipSyncTotal;
  let discount = 0;
  if (numLangs >= PRICING_CONFIG.multiLangThreshold) {
    discount = subtotal * PRICING_CONFIG.multiLangDiscount;
    breakdown.push({ item: `Multi-language discount (${numLangs} langs, -15%)`, amount: -Math.round(discount) });
    subtotal -= discount;
  }

  let rushFee = 0;
  if (rush) {
    rushFee = subtotal * (PRICING_CONFIG.rushMultiplier - 1);
    breakdown.push({ item: 'Rush delivery surcharge (+30%)', amount: Math.round(rushFee) });
  }

  const total = Math.round(subtotal + rushFee);
  if (subtitles) breakdown.push({ item: 'Subtitle files (SRT/VTT)', amount: 0, note: 'Included free' });

  let turnaroundDays;
  if (rush) turnaroundDays = 1;
  else if (duration <= 10 && numLangs <= 2) turnaroundDays = 2;
  else if (duration <= 30 && numLangs <= 3) turnaroundDays = 3;
  else turnaroundDays = 4;

  return {
    total, perLanguage: Math.round(total / numLangs), breakdown, turnaroundDays,
    duration, targetLanguages: targetLanguages.map(c => PRICING_CONFIG.languages[c] ? `${PRICING_CONFIG.languages[c].flag} ${PRICING_CONFIG.languages[c].name}` : c),
    options: { lipSync, rush, subtitles }, currency: 'USD',
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json({ success: true, data: { config: PRICING_CONFIG } });
  }

  if (req.method === 'POST') {
    const { duration, targetLanguages, lipSync, rush, subtitles } = req.body || {};
    if (!duration || !targetLanguages || !Array.isArray(targetLanguages) || targetLanguages.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing required fields: duration, targetLanguages[]' });
    }
    const quote = calculateQuote({ duration: parseInt(duration), targetLanguages, lipSync: !!lipSync, rush: !!rush, subtitles: subtitles !== false });
    return res.json({ success: true, data: quote });
  }

  res.status(405).json({ error: 'Method not allowed' });
}

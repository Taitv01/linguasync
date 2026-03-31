export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, video_url, target_languages, budget, message } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }

  // Log the lead
  console.log(`[CONTACT] New lead: ${name} <${email}> | Languages: ${target_languages} | Budget: ${budget}`);

  // Send Telegram notification (non-blocking)
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const telegramMessage = [
        `🎬 *New LinguaSync Lead!*`,
        ``,
        `👤 *Name:* ${escapeMarkdown(name)}`,
        `📧 *Email:* ${escapeMarkdown(email)}`,
        video_url ? `🔗 *Video:* ${escapeMarkdown(video_url)}` : '',
        target_languages ? `🌍 *Languages:* ${escapeMarkdown(target_languages)}` : '',
        budget ? `💰 *Budget:* ${escapeMarkdown(budget)}` : '',
        message ? `📝 *Message:* ${escapeMarkdown(message)}` : '',
        ``,
        `⏰ *Time:* ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
      ].filter(Boolean).join('\n');

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      });
    } catch (telegramError) {
      console.error('[TELEGRAM] Failed to send notification:', telegramError.message);
      // Don't fail the request if Telegram fails
    }
  }

  res.json({
    success: true,
    message: 'Thank you! We\'ll get back to you within 2 hours.',
    data: { name, email, received_at: new Date().toISOString() }
  });
}

function escapeMarkdown(text) {
  if (!text) return '';
  return String(text).replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

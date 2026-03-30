export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, video_url, target_languages, budget, message } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  // In production, send notification email via Nodemailer here
  // For now, just acknowledge the submission
  console.log(`[CONTACT] New lead: ${name} <${email}> | Languages: ${target_languages} | Budget: ${budget}`);

  res.json({
    success: true,
    message: 'Thank you! We\'ll get back to you within 2 hours.',
    data: { name, email, received_at: new Date().toISOString() }
  });
}

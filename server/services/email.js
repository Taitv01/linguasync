/**
 * LinguaSync — Email Service
 * Sends quote emails and notifications via Nodemailer
 */

const nodemailer = require('nodemailer');

let transporter = null;

function initTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

/**
 * Send a quote email to the client
 */
async function sendQuoteEmail(clientEmail, clientName, quote) {
  const transport = initTransporter();

  const breakdownHTML = quote.breakdown.map(line => {
    const amount = line.amount === 0 ? '<span style="color:#10b981;">Free</span>'
      : line.amount < 0 ? `<span style="color:#10b981;">-$${Math.abs(line.amount)}</span>`
      : `$${line.amount}`;
    return `<tr><td style="padding:8px 0;color:#94a3b8;">${line.item}</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#f1f5f9;">${amount}</td></tr>`;
  }).join('');

  const html = `
    <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#111127;color:#f1f5f9;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#6366f1,#06b6d4);padding:32px;text-align:center;">
        <h1 style="margin:0;font-size:1.5rem;color:white;">🌐 LinguaSync</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:0.9rem;">Your Localization Quote</p>
      </div>
      <div style="padding:32px;">
        <p>Hi ${clientName},</p>
        <p style="color:#94a3b8;">Thank you for your interest in our video localization services. Here's your custom quote:</p>
        
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin:24px 0;">
          <div style="text-align:center;margin-bottom:20px;">
            <p style="color:#64748b;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;margin:0;">Estimated Total</p>
            <p style="font-size:2.5rem;font-weight:900;margin:8px 0;background:linear-gradient(135deg,#c7d2fe,#a5f3fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">$${quote.total}</p>
            <p style="color:#64748b;font-size:0.85rem;margin:0;">~$${quote.perLanguage}/language · ${quote.turnaroundDays}-day delivery</p>
          </div>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:16px 0;">
          <table style="width:100%;border-collapse:collapse;">
            ${breakdownHTML}
            <tr style="border-top:1px solid rgba(255,255,255,0.1);">
              <td style="padding:12px 0 0;font-weight:700;font-size:1.05rem;">TOTAL</td>
              <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:1.05rem;color:#a5f3fc;">$${quote.total}</td>
            </tr>
          </table>
        </div>

        <div style="margin:24px 0;">
          <p style="font-weight:600;margin-bottom:8px;">✅ What's included:</p>
          <ul style="color:#94a3b8;padding-left:20px;">
            <li>AI dubbing with human quality control</li>
            <li>Cultural adaptation (not just translation)</li>
            <li>1 free revision per language</li>
            <li>Delivery via Google Drive</li>
            ${quote.options.subtitles ? '<li>SRT/VTT subtitle files</li>' : ''}
            ${quote.options.lipSync ? '<li>Lip-sync matching</li>' : ''}
          </ul>
        </div>

        <div style="text-align:center;margin:32px 0;">
          <p style="color:#94a3b8;font-size:0.85rem;">To confirm this quote, simply reply to this email with <strong style="color:#f1f5f9;">"CONFIRMED"</strong></p>
          <p style="color:#64748b;font-size:0.8rem;">Quote valid until: ${quote.validUntil}</p>
        </div>

        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;">
        <p style="color:#64748b;font-size:0.8rem;text-align:center;">
          LinguaSync · Ho Chi Minh City, Vietnam · hello@linguasync.io
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"LinguaSync" <${process.env.SMTP_USER}>`,
    to: clientEmail,
    subject: `Your Video Localization Quote — $${quote.total}`,
    html,
  };

  return transport.sendMail(mailOptions);
}

/**
 * Send internal notification about new contact form submission
 */
async function sendContactNotification(formData) {
  const transport = initTransporter();

  const html = `
    <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#111127;color:#f1f5f9;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#f59e0b,#ef4444);padding:24px;text-align:center;">
        <h2 style="margin:0;color:white;">🔔 New Contact Form Submission</h2>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#64748b;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${formData.name}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;font-weight:600;">${formData.email}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Video URL</td><td style="padding:8px 0;">${formData.video_url || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Target Languages</td><td style="padding:8px 0;">${formData.target_languages || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Budget</td><td style="padding:8px 0;">${formData.budget || 'N/A'}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Message</td><td style="padding:8px 0;">${formData.message || 'N/A'}</td></tr>
        </table>
        <p style="color:#64748b;font-size:0.8rem;margin-top:16px;">Received: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"LinguaSync Bot" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFICATION_EMAIL,
    subject: `🔔 New Lead: ${formData.name} — ${formData.target_languages || 'No languages specified'}`,
    html,
  };

  return transport.sendMail(mailOptions);
}

module.exports = { sendQuoteEmail, sendContactNotification };

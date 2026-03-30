/**
 * LinguaSync — API Routes
 * Express router for all API endpoints
 */

const express = require('express');
const router = express.Router();
const { calculateQuote, getPricingTable } = require('../services/pricing');
const { sendQuoteEmail, sendContactNotification } = require('../services/email');

/**
 * GET /api/health
 * Health check
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'LinguaSync API', timestamp: new Date().toISOString() });
});

/**
 * GET /api/pricing
 * Returns the current pricing table and configuration
 */
router.get('/pricing', (req, res) => {
  const pricing = getPricingTable();
  res.json({ success: true, data: pricing });
});

/**
 * POST /api/quote
 * Calculate a custom quote based on project parameters
 * 
 * Body: { duration, targetLanguages[], lipSync, rush, subtitles, clientName?, clientEmail? }
 */
router.post('/quote', async (req, res) => {
  try {
    const { duration, targetLanguages, lipSync, rush, subtitles, clientName, clientEmail } = req.body;

    // Validation
    if (!duration || !targetLanguages || !Array.isArray(targetLanguages) || targetLanguages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: duration (number), targetLanguages (array)'
      });
    }

    if (duration < 1 || duration > 120) {
      return res.status(400).json({
        success: false,
        error: 'Duration must be between 1 and 120 minutes'
      });
    }

    // Calculate quote
    const quote = calculateQuote({
      duration: parseInt(duration),
      targetLanguages,
      lipSync: !!lipSync,
      rush: !!rush,
      subtitles: subtitles !== false,
    });

    if (quote.error) {
      return res.status(400).json({ success: false, error: quote.error });
    }

    // If client email provided, send quote email
    if (clientEmail && clientName) {
      try {
        await sendQuoteEmail(clientEmail, clientName, quote);
        quote.emailSent = true;
      } catch (emailError) {
        console.error('Failed to send quote email:', emailError.message);
        quote.emailSent = false;
        quote.emailError = 'Quote calculated but email delivery failed. Please try again.';
      }
    }

    res.json({ success: true, data: quote });

  } catch (error) {
    console.error('Quote calculation error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/contact
 * Handle contact form submissions
 * 
 * Body: { name, email, video_url?, target_languages?, budget?, message? }
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, video_url, target_languages, budget, message } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Send notification email
    try {
      await sendContactNotification({ name, email, video_url, target_languages, budget, message });
    } catch (emailError) {
      console.error('Failed to send contact notification:', emailError.message);
      // Don't fail the request — log and continue
    }

    res.json({
      success: true,
      message: 'Thank you! We\'ll get back to you within 2 hours.',
      data: { name, email, received_at: new Date().toISOString() }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;

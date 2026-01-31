import express from 'express';
import { sendVerificationEmail } from '../config/email.js';

const router = express.Router();

// Test email endpoint (for development only)
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const testToken = 'test-token-123';
    const result = await sendVerificationEmail(email, testToken);
    
    res.json({
      message: 'Test email sent successfully',
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send test email',
      error: error.message,
      details: error.code || error.responseCode,
    });
  }
});

export default router;

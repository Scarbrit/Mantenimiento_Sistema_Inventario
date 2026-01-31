import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Verify email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};


// Debug: Check for common issues
if (emailConfig.auth.pass) {
  const pass = emailConfig.auth.pass;
  if (pass.includes(' ')) {
    console.warn('⚠️  WARNING: Password contains spaces! App Passwords should not have spaces.');
  }
  if (pass.length !== 16) {
    console.warn(`⚠️  WARNING: Password length is ${pass.length}, expected 16 characters.`);
  }
  // Check for common hidden characters
  if (pass.includes('\n') || pass.includes('\r') || pass.includes('\t')) {
    console.warn('⚠️  WARNING: Password contains line breaks or tabs!');
  }
}

const transporter = nodemailer.createTransport(emailConfig);

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Response:', error.response);
    
    // Provide helpful suggestions based on error
    if (error.code === 'EAUTH') {
      console.error('\n🔧 Troubleshooting EAUTH error:');
      console.error('1. Make sure you\'re using an App Password (not regular password)');
      console.error('2. Check that the App Password is exactly 16 characters (no spaces)');
      console.error('3. Verify the App Password was generated for the correct Gmail account');
      console.error('4. Try generating a new App Password');
      console.error('5. Make sure 2-Step Verification is enabled on the Gmail account');
      console.error('6. Check your .env file for hidden characters or extra spaces');
    }
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

export const sendVerificationEmail = async (email, token) => {
  try {
    // Check if email configuration is set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration is missing. Please check your .env file.');
      throw new Error('Email configuration is missing');
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Account - H-M-C Inventory',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Welcome to H-M-C Inventory Management System</h2>
          <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #D4AF37; color: #000; text-decoration: none; border-radius: 4px; margin: 20px 0;">Verify Email</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };

    console.log(`Attempting to send verification email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
    });
    throw error; // Re-throw to let the controller handle it
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    // Check if email configuration is set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration is missing. Please check your .env file.');
      throw new Error('Email configuration is missing');
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password - H-M-C Inventory',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #D4AF37; color: #000; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    console.log(`Attempting to send password reset email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
    });
    throw error;
  }
};

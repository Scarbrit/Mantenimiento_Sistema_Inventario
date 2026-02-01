import { validationResult } from 'express-validator';
import passport from '../config/passport.js';
import * as userModel from '../models/userModel.js';
import { generateToken } from '../utils/helpers.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../config/email.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, first_name, last_name, role } = req.body;

    // Check if user already exists
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate verification token
    const verification_token = generateToken();

    // Create user
    const user = await userModel.createUser({
      email,
      password,
      first_name,
      last_name,
      role: role || 'staff',
      verification_token,
    });

    // Send verification email
    try {
      const emailResult = await sendVerificationEmail(email, verification_token);
      console.log('Verification email sent:', emailResult);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // User is created, but email failed - still return success but warn user
      return res.status(201).json({
        message: 'User registered successfully, but verification email could not be sent. Please contact administrator.',
        warning: 'Email service is not configured properly. Please check server logs.',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
        // Token removido de la respuesta por seguridad - usar endpoint /api/auth/resend-verification
      });
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login error' });
        }

        res.json({
          message: 'Login successful',
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
          },
        });
      });
    })(req, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout error' });
    }
    res.json({ message: 'Logout successful' });
  });
};

export const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role,
      },
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await userModel.verifyUser(token);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({ message: 'If email exists, password reset link has been sent' });
    }

    const reset_token = generateToken();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await userModel.setResetPasswordToken(email, reset_token, expires);
    await sendPasswordResetEmail(email, reset_token);

    res.json({ message: 'If email exists, password reset link has been sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    const user = await userModel.getUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    await userModel.updatePassword(user.id, password);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

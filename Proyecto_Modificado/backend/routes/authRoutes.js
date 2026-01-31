import express from 'express';
import passport from '../config/passport.js';
import * as authController from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';
import { registerValidator, loginValidator, resetPasswordValidator } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/logout', isAuthenticated, authController.logout);
router.get('/me', isAuthenticated, authController.getCurrentUser);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', resetPasswordValidator, authController.resetPassword);

export default router;

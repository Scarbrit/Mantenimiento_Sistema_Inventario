import express from 'express';
import rateLimit from 'express-rate-limit';
import passport from '../config/passport.js';
import * as authController from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';
import { registerValidator, loginValidator, resetPasswordValidator } from '../validators/authValidators.js';

const router = express.Router();

// Rate limiter para endpoints de autenticación - previene ataques de fuerza bruta
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos por ventana
    message: {
        message: 'Demasiados intentos de autenticación. Por favor, intente nuevamente en 15 minutos.',
        code: 'ERR_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true, // Incluir headers RateLimit-*
    legacyHeaders: false,
});

// Rate limiter más estricto para password reset
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // 3 intentos por hora
    message: {
        message: 'Demasiadas solicitudes de restablecimiento de contraseña. Intente nuevamente en 1 hora.',
        code: 'ERR_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authLimiter, registerValidator, authController.register);
router.post('/login', authLimiter, loginValidator, authController.login);
router.post('/logout', isAuthenticated, authController.logout);
router.get('/me', isAuthenticated, authController.getCurrentUser);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', passwordResetLimiter, authController.requestPasswordReset);
router.post('/reset-password', passwordResetLimiter, resetPasswordValidator, authController.resetPassword);

export default router;

import express from 'express';
import * as userController from '../controllers/userController.js';
import { isSuperAdmin } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/', isSuperAdmin, userController.getAllUsers);
router.put('/:id/role', isSuperAdmin, [
  body('role').isIn(['superadmin', 'admin', 'staff']).withMessage('Invalid role'),
], userController.updateUserRole);

export default router;

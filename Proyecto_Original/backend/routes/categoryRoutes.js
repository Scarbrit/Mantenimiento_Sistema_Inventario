import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { categoryValidator } from '../validators/categoryValidators.js';

const router = express.Router();

router.get('/', isAuthenticated, categoryController.getAllCategories);
router.get('/:id', isAuthenticated, categoryController.getCategoryById);
router.post('/', isAdmin, categoryValidator, categoryController.createCategory);
router.put('/:id', isAdmin, categoryValidator, categoryController.updateCategory);
router.delete('/:id', isAdmin, categoryController.deleteCategory);

export default router;

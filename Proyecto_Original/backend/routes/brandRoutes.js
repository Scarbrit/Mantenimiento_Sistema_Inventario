import express from 'express';
import * as brandController from '../controllers/brandController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { brandValidator } from '../validators/brandValidators.js';

const router = express.Router();

router.get('/', isAuthenticated, brandController.getAllBrands);
router.get('/:id', isAuthenticated, brandController.getBrandById);
router.post('/', isAdmin, brandValidator, brandController.createBrand);
router.put('/:id', isAdmin, brandValidator, brandController.updateBrand);
router.delete('/:id', isAdmin, brandController.deleteBrand);

export default router;

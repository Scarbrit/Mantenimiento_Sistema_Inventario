import express from 'express';
import * as productController from '../controllers/productController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { productValidator, variantValidator, stockAdjustmentValidator } from '../validators/productValidators.js';

const router = express.Router();

router.get('/', isAuthenticated, productController.getAllProducts);
router.get('/:id', isAuthenticated, productController.getProductById);
router.post('/', isAuthenticated, productValidator, productController.createProduct);
router.put('/:id', isAuthenticated, productValidator, productController.updateProduct);
router.delete('/:id', isAuthenticated, productController.deleteProduct);

// Variant routes
router.post('/:id/variants', isAuthenticated, variantValidator, productController.createVariant);
router.put('/variants/:id', isAuthenticated, variantValidator, productController.updateVariant);
router.delete('/variants/:id', isAuthenticated, productController.deleteVariant);
router.post('/variants/:id/adjust-stock', isAuthenticated, stockAdjustmentValidator, productController.adjustStock);

export default router;

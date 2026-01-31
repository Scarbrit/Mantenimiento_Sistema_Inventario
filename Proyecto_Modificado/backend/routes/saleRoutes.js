import express from 'express';
import * as saleController from '../controllers/saleController.js';
import { isAuthenticated } from '../middleware/auth.js';
import { saleValidator } from '../validators/saleValidators.js';

const router = express.Router();

router.post('/', isAuthenticated, saleValidator, saleController.createSale);
router.get('/', isAuthenticated, saleController.getAllSales);
router.get('/:id', isAuthenticated, saleController.getSaleById);

export default router;

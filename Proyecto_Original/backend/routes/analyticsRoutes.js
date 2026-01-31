import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { isSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/daily', isSuperAdmin, analyticsController.getDailyStats);
router.get('/monthly', isSuperAdmin, analyticsController.getMonthlyStats);
router.get('/inventory-value', isSuperAdmin, analyticsController.getTotalInventoryValue);
router.get('/revenue', isSuperAdmin, analyticsController.getRevenueByDateRange);
router.get('/top-selling', isSuperAdmin, analyticsController.getTopSellingProducts);
router.get('/low-stock', isSuperAdmin, analyticsController.getLowStockItems);
router.get('/profit-by-month', isSuperAdmin, analyticsController.getProfitByMonth);

export default router;

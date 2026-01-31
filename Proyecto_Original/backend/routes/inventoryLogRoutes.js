import express from 'express';
import * as inventoryLogController from '../controllers/inventoryLogController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', isAuthenticated, inventoryLogController.getAllInventoryLogs);

export default router;

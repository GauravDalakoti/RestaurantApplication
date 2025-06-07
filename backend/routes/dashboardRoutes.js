import express from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardMetrics);

export default router;
import express from 'express';
import {
  getAnalytics,
  getMonthlySummary,
  getCategoryAnalytics
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/analytics - Get comprehensive analytics
router.get('/', protect, getAnalytics);

// GET /api/analytics/monthly-summary - Get monthly summary
router.get('/monthly-summary', protect, getMonthlySummary);

// GET /api/analytics/categories - Get category analytics
router.get('/categories', protect, getCategoryAnalytics);

export default router;


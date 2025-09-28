import express from 'express';
import { getAdminOverview } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/overview
router.get('/overview', protect, admin, getAdminOverview);

export default router;


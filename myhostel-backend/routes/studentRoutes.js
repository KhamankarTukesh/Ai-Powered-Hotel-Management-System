import express from 'express';
import { getStudentDashboardSummary } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard Summary Route
router.get('/dashboard-summary', protect, getStudentDashboardSummary);

export default router;
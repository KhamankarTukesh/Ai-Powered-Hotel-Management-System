import express from 'express';
import { getDashboardSummary, exportFeeReport } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, adminOnly, getDashboardSummary);
router.get('/export-fees', protect, adminOnly, exportFeeReport); // Excel Download

export default router;
import express from 'express';
import {getWardenDashboardSummary,getWardenAIInsight} from '../controllers/adminController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard-summary', protect,adminOnly,getWardenDashboardSummary);
router.get('/dashboard-ai-insight',protect,adminOnly, getWardenAIInsight);


export default router;
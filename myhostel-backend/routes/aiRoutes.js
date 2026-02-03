import express from 'express';
import { analyzeHostelComplaints, suggestRoomAI } from '../controllers/aiController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Mess Feedback ka Sentiment Analysis (Warden/Admin ke liye)
// Isme student ke feedbacks ka array jayega aur AI summary dega
router.post('/analyze-feedback', protect, adminOnly, analyzeHostelComplaints);
router.post('/suggest-room',protect,adminOnly, suggestRoomAI);

export default router;


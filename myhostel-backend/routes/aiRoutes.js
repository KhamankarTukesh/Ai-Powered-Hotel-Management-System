import express from 'express';
import { analyzeMessFeedback } from '../controllers/aiController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Mess Feedback ka Sentiment Analysis (Warden/Admin ke liye)
// Isme student ke feedbacks ka array jayega aur AI summary dega
router.post('/analyze-feedback', protect, adminOnly, analyzeMessFeedback);

// 2. Future expansion ke liye (Jaise Maintenance Priority ya Defaulter Prediction)
// router.post('/predict-risk', protect, adminOnly, predictFinancialRisk);

export default router;
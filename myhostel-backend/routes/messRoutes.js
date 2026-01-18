import express from 'express';
import { markMeal, submitFeedback, requestSpecialFood } from '../controllers/messController.js';
import { updateMenu, getTodayMenu } from '../controllers/messMenuController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student Routes
router.post('/mark-meal', protect, markMeal);
router.post('/feedback', protect, submitFeedback);
router.post('/special-request', protect, requestSpecialFood);
router.get('/today-menu', protect, getTodayMenu);

// Warden/Admin Routes
router.post('/update-menu', protect, adminOnly, updateMenu);

export default router;
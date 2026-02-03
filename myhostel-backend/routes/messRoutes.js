import express from 'express';
import { markMeal, submitFeedback, requestSpecialFood ,getMyActivity,getMessAnalytics,getAllActivities,updateRequestStatus} from '../controllers/messController.js';
import { updateMenu, getTodayMenu } from '../controllers/messMenuController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student Routes
router.post('/mark-meal', protect, markMeal);
router.post('/feedback', protect, submitFeedback);
router.post('/special-request', protect, requestSpecialFood);
router.get('/my-activity', protect, getMyActivity);
router.get('/today-menu', protect, getTodayMenu);

// Warden/Admin Routes
router.post('/update-menu', protect, adminOnly, updateMenu);
router.get('/analytics', protect,adminOnly, getMessAnalytics);

router.get('/all-activities', protect, adminOnly, getAllActivities);
router.patch('/update-request', protect, adminOnly, updateRequestStatus);

export default router;
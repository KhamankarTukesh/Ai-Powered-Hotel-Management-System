import express from 'express';
import { updateProfile, getUserProfile,getStudentSummary } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current student profile
router.get('/profile', protect, getUserProfile);

// Update profile (Now handles direct JSON with image URL)
router.put('/profile/update', protect, updateProfile);
router.get('/summary', protect, getStudentSummary);
export default router;
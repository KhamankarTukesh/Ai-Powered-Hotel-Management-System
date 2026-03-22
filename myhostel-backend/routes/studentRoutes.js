import express from 'express';
import { updateProfile, getUserProfile,getStudentSummary ,getAllStudents} from '../controllers/studentController.js';
import { protect , adminOnly } from '../middleware/authMiddleware.js';
const router = express.Router();


// Get current student profile
router.get('/profile', protect, getUserProfile);

// Update profile (Now handles direct JSON with image URL)
router.put('/profile/update', protect, updateProfile);
router.get('/summary', protect, getStudentSummary);
router.get('/all-students', protect, adminOnly, getAllStudents);
export default router;
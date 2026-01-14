import express from 'express';
import { applyLeave, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyLeave); // Student apply karega
router.get('/all', protect, getAllLeaves); // Warden dekhega
router.put('/update/:id', protect, updateLeaveStatus); // Warden approve/reject karega

export default router;
import express from 'express';
import { applyLeave, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect ,adminOnly} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyLeave); // Student apply karega
router.get('/all', protect, adminOnly, getAllLeaves); 
router.put('/update/:id', protect, adminOnly, updateLeaveStatus);

export default router;
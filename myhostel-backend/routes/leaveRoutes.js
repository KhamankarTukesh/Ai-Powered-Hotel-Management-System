import express from 'express';
import { applyLeave, getAllLeaves, updateLeaveStatus ,getMyLeaves} from '../controllers/leaveController.js';
import { protect ,adminOnly} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyLeave); // Student apply karega
router.get('/all', protect, adminOnly, getAllLeaves); 
router.get('/my-leaves', protect, getMyLeaves);
router.put('/update/:id', protect, adminOnly, updateLeaveStatus);

export default router;
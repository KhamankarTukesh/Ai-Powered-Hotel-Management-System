import express from 'express';
import { markAttendance, getMyAttendance ,getDailyReport ,deleteDailyReport} from '../controllers/attendanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Warden attendance mark karega (Protect & Admin Only)
router.post('/mark', protect, adminOnly, markAttendance);


// 2. Student apni attendance summary dekhega

router.get('/daily-report', protect, adminOnly, getDailyReport);
router.get('/my-stats', protect, getMyAttendance);
router.delete('/daily-report', deleteDailyReport);
export default router;
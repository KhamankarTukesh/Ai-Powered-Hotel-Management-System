import express from 'express';
import { 
    getStudentActivities, 
    deleteActivityLog,
    clearStudentHistory
} from '../controllers/activityController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific student ki history (Roll No query se)
router.get('/student', protect,adminOnly, getStudentActivities);
router.delete('/clear-all', protect, adminOnly, clearStudentHistory);
router.delete('/:id', protect, adminOnly, deleteActivityLog);


export default router;
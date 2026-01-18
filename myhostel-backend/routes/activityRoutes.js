import express from 'express';
import { getStudentActivities } from '../controllers/activityController.js';
import { protect} from '../middleware/authMiddleware.js';

const router = express.Router();

// Student apni activity dekh sake aur Admin kisi bhi student ki history dekh sake
router.get('/:studentId', protect,getStudentActivities);

export default router;
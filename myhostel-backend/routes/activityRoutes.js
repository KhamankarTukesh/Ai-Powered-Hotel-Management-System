import express from 'express';
import { getStudentActivities } from '../controllers/activityController.js';
import { protect} from '../middleware/authMiddleware.js';

const router = express.Router();

// router/activityRoutes.js
router.get('/', protect, getStudentActivities);

export default router;
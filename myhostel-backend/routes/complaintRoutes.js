import express from 'express';
import { createComplaint } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sirf logged-in students hi complaint kar sakte hain
router.post('/', protect, createComplaint);

export default router;
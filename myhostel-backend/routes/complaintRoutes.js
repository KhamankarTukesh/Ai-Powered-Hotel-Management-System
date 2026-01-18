import express from 'express';
import { createComplaint, getAllComplaints, updateComplaintStatus, assignComplaint } from '../controllers/complaintController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js'; // Warden/Admin ke liye logic

const router = express.Router();

// Student: Complaint create karega
router.post('/', protect, createComplaint);

// Warden: Saari complaints dekhega
router.get('/all', protect, getAllComplaints);

// Warden: Status update karega
router.put('/:id', protect, updateComplaintStatus);
router.put('/assign', protect, adminOnly, assignComplaint);

export default router;
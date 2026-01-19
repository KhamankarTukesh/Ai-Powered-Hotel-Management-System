import express from 'express';
import { 
    createComplaint, 
    getAllComplaints, 
    updateComplaintStatus, // Ab ye use hoga
    assignComplaint,
    getComplaintById 
} from '../controllers/complaintController.js';
import { protect, adminOnly,staffOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createComplaint);
router.get('/all', protect, staffOnly, getAllComplaints);


router.put('/assign', protect, adminOnly, assignComplaint); 


router.get('/:id', protect, staffOnly, getComplaintById);
router.put('/:id/status', protect, staffOnly, updateComplaintStatus); // Naya route status update ke liye

export default router;
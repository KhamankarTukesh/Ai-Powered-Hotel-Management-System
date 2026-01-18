import express from 'express';
import { 
    createComplaint, 
    getAllComplaints, 
    updateComplaintStatus, // Ab ye use hoga
    assignComplaint,
    getComplaintById 
} from '../controllers/complaintController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createComplaint);
router.get('/all', protect, getAllComplaints);


router.put('/assign', protect, adminOnly, assignComplaint); 


router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, updateComplaintStatus); // Naya route status update ke liye

export default router;
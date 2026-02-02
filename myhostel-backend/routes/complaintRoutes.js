import express from 'express';
import { 
    createComplaint, 
    getAllComplaints, 
    updateComplaintStatus, 
    assignComplaint,
    getComplaintById,
    getMyComplaints,
    deleteResolvedComplaint
} from '../controllers/complaintController.js';
import { protect, adminOnly, staffOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- STUDENT ROUTES ---
// Student apni complaint create kar sakta hai aur apni list dekh sakta hai
router.post('/create', protect, createComplaint);
router.get('/my-complaints', protect, getMyComplaints);

// --- STAFF & ADMIN SHARED ROUTES ---
// Staff aur Admin dono saari complaints dekh sakte hain aur status update kar sakte hain
router.get('/all', protect, staffOnly, getAllComplaints);
router.get('/:id', protect, staffOnly, getComplaintById);
router.put('/:id/status', protect, staffOnly, updateComplaintStatus);
router.delete('/:id', protect, adminOnly,deleteResolvedComplaint);

// --- ADMIN ONLY ROUTES ---
// Sirf Admin (Warden) hi kisi specific staff ko complaint assign kar sakta hai
router.put('/assign', protect, adminOnly, assignComplaint); 

export default router;
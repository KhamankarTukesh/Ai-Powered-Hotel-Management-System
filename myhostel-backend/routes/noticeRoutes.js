import express from 'express';
import { postNotice, deleteNotice,sendEmergencyAlert } from '../controllers/noticeController.js';
import Notice from '../models/Notice.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import multer from 'multer';


const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
router.delete('/delete/:id', protect, adminOnly, deleteNotice);

router.post('/create', protect, adminOnly, upload.single('attachment'), postNotice);

router.post('/emergency', protect, adminOnly, sendEmergencyAlert);

router.get('/all', protect, async (req, res) => {
    const notices = await Notice.find().sort({ createdAt: -1 }).populate('postedBy', 'fullName');
    res.status(200).json(notices);
});

export default router;
import express from 'express';
import { 
    getUnreadCount, 
    getAllNotifications, 
    markAsRead ,
    createAdminRequest
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Get total unread count (For the Red Dot on the Bell)
router.get('/unread-count', protect, getUnreadCount);

// 2. Get all notifications for the student
router.get('/', protect, getAllNotifications);

router.post('/admin-request', protect, createAdminRequest);
// 3. Mark a specific notification as read (When student clicks it)
router.put('/:id/read', protect, markAsRead);

export default router;
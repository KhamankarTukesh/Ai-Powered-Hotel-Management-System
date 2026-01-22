import express from 'express';
import { registerUser, loginUser, createStaff, verifyOTP, forgotPassword, resetPassword, updateProfile , getMe} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import multer from 'multer';

import { storage } from '../config/cloudinary.js'; 

const router = express.Router();


const upload = multer({ storage: storage });



// Registration mein image upload logic
router.post('/register', upload.single('idCardImage'), registerUser);

router.put('/update-profile', protect, upload.single('idCardImage'), updateProfile);

// Baki routes same rahenge...
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/create-staff', protect, adminOnly, createStaff);
router.get('/me', protect,getMe);


export default router;
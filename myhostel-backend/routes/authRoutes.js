import express from 'express';
import { registerUser, loginUser, createStaff, verifyOTP, resendOTP,forgotPassword, resetPassword} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { sendEmail } from '../utils/sendEmail.js'; 

import { storage } from '../config/cloudinary.js'; 

const router = express.Router();


const upload = multer({ storage: storage });



// Registration mein image upload logic
router.post('/register', upload.single('idCardImage'), registerUser);


// Baki routes same rahenge...
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/create-staff', protect, adminOnly, createStaff);


// authRoutes.js mein add karo:
router.get('/test-email', async (req, res) => {
    try {
        await sendEmail(
            'tukeshofficial072@gmail.com',
            'Test from SendGrid',
            'Agar yeh email aaya toh SendGrid kaam kar raha hai!'
        );
        res.json({ success: true, message: 'Email sent!' });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

export default router;
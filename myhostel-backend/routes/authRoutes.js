import express from 'express';
import { registerUser, loginUser, createStaff, verifyOTP } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path'

const router = express.Router();


// --- Multer Configuration (ID Card Upload ke liye) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/id_cards/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error('Only Images or PDFs allowed!'));
    }
});


// --- Auth Routes ---

// 1. Student Registration (With ID Card Upload)
// 'idCardImage' wahi naam hai jo hum Postman ke body mein use karenge
router.post('/register', upload.single('idCardImage'), registerUser);

// 2. OTP Verification
router.post('/verify-otp', verifyOTP);

// 3. Login
router.post('/login', loginUser);

// 4. Create Staff (Only Admin can do this)
router.post('/create-staff', protect, adminOnly, createStaff);

export default router;
import express from 'express';
import { createStaff, loginUser } from '../controllers/authController.js';
import { registerUser } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);

//warden banana ne ka rasta
router.post('/create-staff',protect,adminOnly, createStaff);
export default router;
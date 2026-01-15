import express from 'express';
import { createFeeRecord, payFees } from '../controllers/feeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Warden/Admin student ke liye fee record banayega
router.post('/create', protect, adminOnly, createFeeRecord);

// Student apni fees pay karega
router.post('/pay', protect, payFees);

export default router;
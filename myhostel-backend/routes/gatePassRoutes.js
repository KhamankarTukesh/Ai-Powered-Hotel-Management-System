import express from 'express';
import { applyGatePass, approveGatePass, markMovement, deleteGatePass } from '../controllers/gatePassController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyGatePass);
router.put('/approve/:id', protect, adminOnly, approveGatePass);
router.patch('/movement/:id', protect, markMovement);
router.delete('/delete/:id', protect, adminOnly, deleteGatePass);

export default router;
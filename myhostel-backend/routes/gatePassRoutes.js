import express from 'express';
import { applyGatePass, approveGatePass, markMovement, deleteGatePass, getActivePass ,getPendingPasses} from '../controllers/gatePassController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/apply', protect, applyGatePass);
router.get('/active', protect, getActivePass);
router.put('/approve/:id', protect, adminOnly, approveGatePass);
router.patch('/movement/:id', protect, markMovement);
router.delete('/delete/:id', protect, adminOnly, deleteGatePass);
router.get('/pending',getPendingPasses);
export default router;
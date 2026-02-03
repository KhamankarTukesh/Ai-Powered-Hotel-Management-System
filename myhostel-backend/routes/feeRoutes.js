import express from 'express';
import { 
    createFeeRecord, 
    payFees, 
    verifyPayment, 
    getFeeAnalytics, 
    downloadReceipt, 
    clearOldTransactions,
    applyMessRebate,
    getMyFees,
    exportFeeCSV,
    getPendingVerifications
} from '../controllers/feeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Create Fee (Warden)
router.post('/create', protect, adminOnly, createFeeRecord);

// 2. Submit Payment (Student)
router.post('/pay', protect, payFees);

// 3. Verify Payment (Warden)
router.put('/verify', protect, adminOnly, verifyPayment);

// 4. Analytics & AI Risk (Admin/Warden)
router.get('/analytics', protect, adminOnly, getFeeAnalytics);

// 5. Download PDF Receipt (Student/Admin)
router.get('/my-latest-receipt', protect, downloadReceipt);
router.get('/receipt/:transactionId', protect, downloadReceipt);

router.get('/pending/verification',adminOnly,getPendingVerifications);
router.get('/my-fees', protect, getMyFees);

// 6. Archive Old Transactions (Admin)
router.delete('/clear/:feeId', protect, adminOnly, clearOldTransactions);

router.post('/apply-rebate', protect, adminOnly, applyMessRebate);
router.get('/export-fees', protect, adminOnly,exportFeeCSV); 
export default router;
import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { 
    requestRoomChange, 
    processRoomChange,
    addRoom,
    allocateRoom,
    getAllRooms,
    getPendingRequests
} from '../controllers/roomController.js';

const router = express.Router();

router.post('/',protect, adminOnly,addRoom);

router.get("/",protect, getAllRooms);

router.put("/allocate", protect, adminOnly, allocateRoom);

router.post('/request-change', protect, requestRoomChange);
router.put('/approve-change/:requestId', processRoomChange);
router.get('/requests/pending', getPendingRequests);

export default router
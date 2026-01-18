import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { 
    requestRoomChange, 
    approveRoomChange,
    addRoom,
    allocateRoom,
    getAllRooms
} from '../controllers/roomController.js';

const router = express.Router();

router.post('/',protect, adminOnly,addRoom);

router.get("/",protect, getAllRooms);

router.put("/allocate", protect, adminOnly, allocateRoom);

router.post('/request-change', protect, requestRoomChange);

router.put('/approve-change/:requestId', protect, adminOnly, approveRoomChange);

export default router;

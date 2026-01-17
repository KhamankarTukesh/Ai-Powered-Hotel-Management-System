import express from 'express';
import { 
    requestRoomChange, 
    approveRoomChange,
    addRoom,
    allocateRoom,
    getAllRooms
} from '../controllers/roomController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/',protect, adminOnly,addRoom);

router.get("/",protect, getAllRooms);

router.put("/allocate", protect, allocateRoom);

router.post('/request-change', protect, requestRoomChange);

router.put('/approve-change/:requestId', protect, adminOnly, approveRoomChange);

export default router;

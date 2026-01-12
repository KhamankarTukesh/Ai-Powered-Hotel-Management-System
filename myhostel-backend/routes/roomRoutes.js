import express from 'express';
import { addRoom, allocateRoom, getAllRooms } from '../controllers/roomController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',protect, adminOnly,addRoom);

router.get("/",protect, getAllRooms);

router.put("/allocate", protect, allocateRoom);

export default router;

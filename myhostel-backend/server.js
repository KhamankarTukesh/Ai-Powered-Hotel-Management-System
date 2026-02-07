import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import gateRoutes from './routes/gatePassRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import messRoutes from './routes/messRoutes.js';
import initCronJobs from './utils/cronJobs.js';
import activityRoutes from './routes/activityRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';



const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints',complaintRoutes);
app.use('/api/leaves',leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/ai',aiRoutes);
app.use('/api/warden',adminRoutes);
app.use('/api/notice',noticeRoutes);
app.use('/api/gatepass',gateRoutes);
app.use('/api/fee',feeRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/users', studentRoutes);
app.use('/api/notifications', notificationRoutes);



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully! ✅"))
    .catch((err) => console.log("MongoDB Connection Error: ❌", err));

app.get('/',(req,res) =>{
    res.send('MyHostel Global API is running in ES Module mode 🚀...');
});

initCronJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});
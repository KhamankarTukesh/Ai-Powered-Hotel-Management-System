import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';



const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints',complaintRoutes);
app.use('/api/leaves',leaveRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully! ✅"))
    .catch((err) => console.log("MongoDB Connection Error: ❌", err));

app.get('/',(req,res) =>{
    res.send('MyHostel Global API is running in ES Module mode 🚀...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});
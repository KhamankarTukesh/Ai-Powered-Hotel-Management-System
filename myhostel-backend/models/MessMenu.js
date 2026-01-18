import mongoose from 'mongoose';

const messMenuSchema = new mongoose.Schema({
    day: { 
        type: String, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
        unique: true 
    },
    breakfast: { type: String, required: true },
    lunch: { type: String, required: true },
    snacks: { type: String },
    dinner: { type: String, required: true },
    specialNote: { type: String } // "Special: Festival Sweet" wagera ke liye
}, { timestamps: true });

export default mongoose.model('MessMenu', messMenuSchema);
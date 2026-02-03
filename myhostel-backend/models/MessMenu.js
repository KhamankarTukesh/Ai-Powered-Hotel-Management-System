import mongoose from 'mongoose';

const messMenuSchema = new mongoose.Schema({
    day: { 
        type: String, 
        required: true, 
        unique: true },
    breakfast: { 
        type: String, 
        required: true 
    },
    breakfastTime: { 
        type: String, 
        default: "07:30 - 09:30" 
    }, // New field
    lunch: { 
        type: String, 
        required: true 
    },
    lunchTime: { 
        type: String, 
        default: "12:30 - 14:30" 
    },     // New field
    snacks: { 
        type: String },
    snacksTime: { 
        type: String, 
        default: "16:30 - 17:30" 
    },    // New field
    dinner: { 
        type: String, 
        required: true 
    },
    dinnerTime: { 
        type: String, 
        default: "19:30 - 21:30" 
    },    // New field
    specialNote: { 
        type: String 
    },
    expiresAt: { 
        type: Date, index: { expires: 0 } }
}, { timestamps: true });
export default mongoose.model('MessMenu', messMenuSchema);
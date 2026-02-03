import mongoose from 'mongoose';

const messActivitySchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: "2026-02-03"
    
    meals: {
        breakfast: { checked: Boolean, time: Date },
        lunch: { checked: Boolean, time: Date },
        snacks: { checked: Boolean, time: Date },
        dinner: { checked: Boolean, time: Date }
    },

    specialRequest: {
        item: String,
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Delivered'], default: 'Pending' }
    },

    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'], default: 'Neutral' }
    },

    // 28 DAYS TTL INDEX: Yeh poore record ko 28 din baad auto-delete kar dega
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: '28d' 
    }
}, { timestamps: true });

// Prevent duplicate entries for the same student on the same day
messActivitySchema.index({ student: 1, date: 1 }, { unique: true });

export default mongoose.model('MessActivity', messActivitySchema);
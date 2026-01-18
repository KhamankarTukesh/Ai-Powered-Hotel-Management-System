import mongoose from 'mongoose';

const messActivitySchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: "2026-01-18"
    
    // Meal Tracking
    meals: {
        breakfast: { checked: Boolean, time: Date },
        lunch: { checked: Boolean, time: Date },
        dinner: { checked: Boolean, time: Date }
    },

    // Special Food Request
    specialRequest: {
        item: String, // e.g., "Sick Diet (Khichdi)", "No Onion"
        status: { type: String, enum: ['Pending', 'Approved', 'Delivered'], default: 'Pending' }
    },

    // Feedback System
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'], default: 'Neutral' } // OpenAI update karega
    }
}, { timestamps: true });

messActivitySchema.index({ student: 1, date: 1 }, { unique: true });

export default mongoose.model('MessActivity', messActivitySchema);
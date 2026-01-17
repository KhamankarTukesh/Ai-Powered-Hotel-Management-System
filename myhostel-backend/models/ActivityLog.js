import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User model se link
        required: true
    },
    action: {
        type: String, 
        enum: ['Check-in', 'Check-out', 'Profile-Update', 'Room-Allocated'],
        required: true
    },
    description: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);
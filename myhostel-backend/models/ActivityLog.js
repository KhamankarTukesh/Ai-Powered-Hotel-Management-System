import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String, 
        enum: ['Check-in', 'Check-out', 'Room-Allocated', 'Room-Changed'],
        required: true
    },
    description: String, // e.g., "Shifted from Room 102 to 101"
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ActivityLog', activityLogSchema);
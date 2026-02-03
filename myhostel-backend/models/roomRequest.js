import mongoose from "mongoose";

const roomRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentRoom: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    desiredRoom:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending','Approved','Rejected'],
        default: 'Pending'
    },
    wardenNote: {
        type: String,
        default: ""
    },
    processedAt: { 
        type: Date,
        default: null // Only set this when approved or rejected
    }
}, { timestamps: true });
roomRequestSchema.index({ "processedAt": 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model('RoomRequest',roomRequestSchema);
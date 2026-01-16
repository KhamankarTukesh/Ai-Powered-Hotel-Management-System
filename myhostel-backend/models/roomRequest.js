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
    desireRoom:{
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
    }
}, { timestamps: true });


export default mongoose.model('RoomRequest',roomRequestSchema);
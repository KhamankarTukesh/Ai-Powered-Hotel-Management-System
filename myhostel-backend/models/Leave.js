import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    student: {
        type: String,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    wardenNote: { type: String } // Warden agar kuch comment likhna chahe
}, { timestamps: true });

const Leave = mongoose.model('Leave',leaveSchema);
export default Leave;
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId, // Fixed: ID ref ke liye ObjectId use karein
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
    wardenNote: { type: String },
    // Auto-deletion ke liye expiry field
    expiresAt: {
        type: Date,
        index: { expires: 0 } // TTL Index: Is waqt par record delete ho jayega
    },
    outpassUrl: { type: String } // Outpass link save karne ke liye
}, { timestamps: true });

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
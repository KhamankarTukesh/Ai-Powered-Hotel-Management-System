import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Searching fast hogi
    },
    action: {
        type: String, 
        enum: [
            'Check-in', 'Check-out', 'Profile-Update', 
            'Room-Allocated', 'Mess-Feedback', 'Complaint-Raised', 
            'Fee-Paid', 'AI-Analysis-Run' // Naye actions add kiye
        ],
        required: true
    },
    severity: { // Filter karne ke liye (Low, Medium, High)
        type: String,
        enum: ['Info', 'Warning', 'Critical'],
        default: 'Info'
    },
    description: { type: String, required: true },
    metadata: { // Extra data save karne ke liye (JSON format)
        type: Object,
        default: {}
    },
    ipAddress: String, // Security tracking
}, { 
    timestamps: true // Isse 'createdAt' apne aap 'timestamp' ka kaam karega
});

// Warden ko pichle 30 din ka data dikhane ke liye index
activityLogSchema.index({ createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
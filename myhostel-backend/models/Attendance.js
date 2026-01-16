import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['Present', 'Absent', 'Late', 'Leave'], 
        default: 'Present' 
    },
    markedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

// Ek student ki ek din mein ek hi attendance honi chahiye (Avoid duplicate)
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
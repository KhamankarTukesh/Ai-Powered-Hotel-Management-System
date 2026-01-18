import mongoose from 'mongoose';

const gatePassSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    reason: {
        type: String,
        required: true 
    },
    destination: { 
        type: String, 
        required: true 
    },
    outTime: { 
        type: Date 
    }, 
    expectedInTime: { 
        type: Date, 
        required: true 
    }, 
    actualInTime: { 
        type: Date }, 
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected', 'Out', 'Returned'], 
        default: 'Pending' 
    },
    approvedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

export default mongoose.model('GatePass', gatePassSchema);
import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    category: { 
        type: String, 
        trim: true,
        enum: {
            values: ['General', 'Emergency', 'Event', 'Fee', 'Holiday'],
            message: '{VALUE} is not supported'
        },
        default: 'General'
    },
    attachmentUrl: { type: String },
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    isEmergency: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notice', noticeSchema);
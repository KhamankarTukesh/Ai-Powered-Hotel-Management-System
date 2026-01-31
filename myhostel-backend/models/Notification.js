import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' }, // Kis student ko dikhana hai
    message: { 
        type: String, 
        required: true 
    }, // Kya message hai (e.g. "Password changed!")
    isRead: { 
        type: Boolean, 
        default: false 
    }, // Kya student ne dekh liya?
}, { timestamps: true });

export default mongoose.model('Notification',notificationSchema);
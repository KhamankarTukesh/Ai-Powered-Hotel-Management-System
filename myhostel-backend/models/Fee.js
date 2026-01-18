import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Paid', 'Partially Paid', 'Unpaid','Pending Verification'], 
        default: 'Unpaid' 
    },
    transactions: [{
        amount: Number,
        date: { type: Date, default: Date.now },
        paymentMethod: String, // Online, Cash, UPI
        receiptId: String
    }],
    // AI Insights (Inhe hum AI logic se update karenge)
    paymentRisk: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Low' 
    },
    hostelRent: { type: Number, required: true },
    messCharges: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);
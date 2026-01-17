import mongoose from "mongoose";


const complaintSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Electrical', 'Plumbing', 'Cleaning', 'Mess', 'Other'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    assignedStaff: { type: String, default: "Not Assigned" },
    resolutionTime: { type: String },

}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
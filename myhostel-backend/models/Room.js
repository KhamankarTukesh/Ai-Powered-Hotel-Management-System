import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Single', 'Double', 'Triple'], // Room types
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    occupants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Kaunse students is room mein hain
    }],
    status: {
        type: String,
        enum: ['Available', 'Full', 'Under Maintenance'],
        default: 'Available'
    }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;
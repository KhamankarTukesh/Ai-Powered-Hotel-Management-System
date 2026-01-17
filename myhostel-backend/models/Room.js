import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    // --- Naya Addition: Hostel Structure ---
    block: { 
        type: String, 
        required: true, 
        placeholder: "A Block, B Block" 
    },
    floor: { 
        type: Number, 
        required: true 
    },
    // ---------------------------------------
    type: {
        type: String,
        enum: ['Single', 'Double', 'Triple'],
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
    // --- Naya Addition: Bed-wise Tracking ---
    beds: [{
        bedNumber: { type: String }, // e.g., "A", "B", "C"
        studentId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            default: null 
        },
        isOccupied: { type: Boolean, default: false }
    }],
    // ----------------------------------------
    status: {
        type: String,
        enum: ['Available', 'Full', 'Under Maintenance'],
        default: 'Available'
    }
}, { timestamps: true });


// models/Room.js
roomSchema.pre('save', function (next) {
    if (this.beds) {
        const occupiedBeds = this.beds.filter(bed => bed.isOccupied).length;
        if (occupiedBeds >= this.capacity) {
            this.status = 'Full';
        } else if (this.status !== 'Under Maintenance') {
            this.status = 'Available';
        }
    }
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
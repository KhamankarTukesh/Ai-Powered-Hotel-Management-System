import Room from "../models/Room.js";

// 1. ADD ROOM (Updated with Block, Floor and Auto-Bed Creation)
export const addRoom = async (req, res) => {
    try {
        const { roomNumber, type, capacity, price, block, floor } = req.body;

        const roomExists = await Room.findOne({ roomNumber });
        if (roomExists) return res.status(400).json({ message: "Room already exists" });

        // Logic: Jitni capacity hai, utne beds array mein auto-create kar do
        const beds = Array.from({ length: capacity }, (_, i) => ({
            bedNumber: String.fromCharCode(65 + i), // A, B, C...
            isOccupied: false
        }));

        const newRoom = await Room.create({
            roomNumber,
            type,
            capacity,
            price,
            block,
            floor,
            beds
        });
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2. GET ALL ROOMS (With Populated Student Data)
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate({
            path: 'beds.studentId', // Naya path kyunki beds array ke andar hai
            select: 'fullName email studentDetails.rollNumber studentDetails.department' 
        });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 3. ALLOCATE ROOM (Bed-wise Logic)
export const allocateRoom = async (req, res) => {
    try {
        const { roomId, studentId, bedNumber } = req.body; // BedNumber optional rakhte hain

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room Not found" });

        // Check if student already has any room
        const alreadyAssigned = await Room.findOne({ "beds.studentId": studentId });
        if (alreadyAssigned) {
            return res.status(400).json({ message: "Student already has a room assigned" });
        }

        // Khali bed dhoondo
        let targetBed;
        if (bedNumber) {
            targetBed = room.beds.find(b => b.bedNumber === bedNumber && !b.isOccupied);
        } else {
            targetBed = room.beds.find(b => !b.isOccupied);
        }

        if (!targetBed) return res.status(400).json({ message: "No available beds in this room!" });

        // Bed Assign karo
        targetBed.studentId = studentId;
        targetBed.isOccupied = true;

        await room.save(); // Pre-save hook apne aap status 'Full' kar dega agar capacity bhar gayi
        
        console.log(`Alert: Bed ${targetBed.bedNumber} in Room ${room.roomNumber} allocated!`);
        res.status(200).json({ message: "Room allocated successfully", room });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
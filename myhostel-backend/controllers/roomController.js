import Room from "../models/Room.js";

export const addRoom = async (req, res) => {
    try {
        const { roomNumber, type, capacity, price } = req.body;

        const roomExists = await Room.findOne({ roomNumber });
        if (roomExists) return res.status(400).json({ message: "Room already exists" });

        const newRoom = await Room.create({
            roomNumber,
            type,
            capacity,
            price
        });
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('occupants', 'fullName email');
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


// 3. STUDENT KO ROOM ASSIGN KARNA (Only Warden/Admin)
export const allocateRoom = async (req, res) => {
    try {
        const { roomId, studentId } = req.body;

        // 1. Check karein kya room exists karta hai
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room Not found" });

        // 2. Check capacity (Kya jagah hai?)
        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({ message: "Room is already full!" });
        }

        const alreadyAssigned = await Room.findOne({ occupants: studentId });
        if (alreadyAssigned) {
            return res.status(400).json({ message: "Student already has a room assigned" })
        }


        // 4. Room mein student add karein
        room.occupants.push(studentId);

        //5.Agar Room full ho gaya status badal kr ye kardo
        if (room.occupants.length === room.capacity) {
            room.status = 'Full';
        }

        await room.save();
        res.status(200).json({ message: "Room allocated successfully", room });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
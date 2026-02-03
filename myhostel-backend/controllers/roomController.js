import Room from "../models/Room.js";
import RoomRequest from "../models/roomRequest.js";

export const addRoom = async (req, res) => {
    try {
        const { roomNumber, type, capacity, price, block, floor } = req.body;

        const roomExists = await Room.findOne({ roomNumber });
        if (roomExists) return res.status(400).json({ message: "Room already exists" });

        const beds = Array.from({ length: capacity }, (_, i) => ({
            bedNumber: String.fromCharCode(65 + i), 
            isOccupied: false
        }));

        // Yahan 'create' ki jagah manually instance banayein
        const newRoom = new Room({
            roomNumber,
            type,
            capacity,
            price,
            block,
            floor,
            beds
        });

        await newRoom.save(); 
        
        res.status(201).json(newRoom);
    } catch (error) {
        console.error("DEBUG ERROR:", error); 
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



export const requestRoomChange = async (req, res) => {
    try {
        const { currentRoomNumber, desiredRoomNumber, reason } = req.body;

        // 1. Room Numbers se Database IDs dhoondo
        const currentRoom = await Room.findOne({ roomNumber: currentRoomNumber });
        const desiredRoom = await Room.findOne({ roomNumber: desiredRoomNumber });

        if (!currentRoom || !desiredRoom) {
            return res.status(404).json({ message: "Invalid Room Number(s) provided." });
        }

        // 2. Request create karo IDs use karke
        const newRequest = await RoomRequest.create({
            student: req.user.id,
            currentRoom: currentRoom._id,
            desiredRoom: desiredRoom._id,
            reason
        });

        res.status(201).json({ 
            message: "Request submitted using Room Numbers!", 
            requestId: newRequest._id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const processRoomChange = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { action, wardenNote } = req.body; // action: 'approve' or 'reject'

        const request = await RoomRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });

        // 1. Set Warden Note and Start Timer
        request.wardenNote = wardenNote || "";
        request.processedAt = new Date(); // YAHAN SE 24 HOURS SHURU HOTE HAIN

        if (action === 'approve') {
            const oldRoom = await Room.findById(request.currentRoom);
            const newRoom = await Room.findById(request.desiredRoom);

            const freeBed = newRoom.beds.find(b => !b.isOccupied);
            if (!freeBed) return res.status(400).json({ message: "Desired room is full" });

            // Bed Swap Logic
            const oldBed = oldRoom.beds.find(b => b.studentId?.toString() === request.student.toString());
            if (oldBed) { oldBed.studentId = null; oldBed.isOccupied = false; }
            
            freeBed.studentId = request.student;
            freeBed.isOccupied = true;

            request.status = 'Approved';
            await oldRoom.save();
            await newRoom.save();
        } else {
            // Rejection Logic
            request.status = 'Rejected';
        }

        // 2. Save the request with the timer
        await request.save();

        res.status(200).json({ 
            message: action === 'approve' ? "Room changed! 😊" : "Request rejected." 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getPendingRequests = async (req, res) => {
    try {
        const pending = await RoomRequest.find({ status: 'Pending' })
            .populate('student', 'fullName studentDetails') // Get name and roll no
            .populate('currentRoom', 'roomNumber')         // Get old room number
            .populate('desiredRoom', 'roomNumber')         // Get new room number
            .sort({ createdAt: -1 });                      // Newest first

        res.status(200).json(pending);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
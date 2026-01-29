import axios from 'axios';
import API from '../../api/axios.js'; // Assuming API is an axios instance with baseURL set

const roomService = {
    /**
     * 1. Get All Rooms
     * Used in RoomDetails.jsx to filter and find the student's specific room
     * and list roommates from the 'beds' array.
     */
    getAllRooms: async () => {
        try {
            const response = await API.get('/rooms');
            return response.data; // Returns array of Room objects with populated beds
        } catch (error) {
            console.error("Error fetching rooms:", error);
            throw error.response?.data || "Network Error";
        }
    },

    /**
     * 2. Apply for Room Change
     * Handles the inputs: currentRoomNumber, desiredRoomNumber, and reason.
     * Triggers the orange-themed success toast in the UI.
     */
    applyRoomChange: async (requestData) => {
        try {
            
            const response = await API.post('/rooms/change-request', {
                currentRoomNumber: requestData.currentRoomNumber,
                desiredRoomNumber: requestData.desiredRoomNumber,
                reason: requestData.reason
            });
            return response.data; // Returns { success: true, requestId: "..." }
        } catch (error) {
            console.error("Error submitting room change:", error);
            throw error.response?.data || "Submission Error";
        }
    },

    /**
     * 3. Get Room by Student ID
     * (Alternative helper if your backend has a direct lookup)
     */
    getRoomByStudent: async (studentId) => {
        try {
            const response = await API.get(`/rooms/student/${studentId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching specific student room:", error);
            throw error.response?.data;
        }
    }
};

export default roomService;
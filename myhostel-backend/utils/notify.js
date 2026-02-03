import Notification from "../models/Notification.js";


export const createNotification = async (userId, message) => {
    try {
        await Notification.create({
            recipient: userId,
            message: message
        });
    } catch (err) {
        console.error("Auto-Notification Error:", err);
    }
};
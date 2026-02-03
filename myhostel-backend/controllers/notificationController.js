import Notification from "../models/Notification.js";

// 1. Unread Count (Jo humne pehle baat ki thi)
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ 
            recipient: req.user.id, 
            isRead: false 
        });
        res.status(200).json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get All Notifications (Saari notifications dikhane ke liye)
export const getAllNotifications = async (req, res) => {
    try {
        // Latest notifications pehle dikhengi (.sort)
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 }); 
        
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Mark As Read (Jab student ghanti par click kare)
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id); // Simple delete!
        res.status(200).json({ message: "Notification cleared from database" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createAdminRequest = async (req, res) => {
    try {
        const { type, message } = req.body;
        // Hum ek notification create karenge jiska recipient 'ADMIN' hoga
        const newNotification = await Notification.create({
            recipient: '696489ef607a8df5cc423343', // Admin ki ID yahan aayegi
            message: `Student ${req.user.name} ne request bheji: ${message}`,
            isRead: false
        });
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
import MessMenu from '../models/MessMenu.js';

// Update or Create Menu for a day
export const updateMenu = async (req, res) => {
    try {
        const { day, breakfast, lunch, snacks, dinner } = req.body;
        
        const menu = await MessMenu.findOneAndUpdate(
            { day },
            { breakfast, lunch, snacks, dinner, updatedBy: req.user.id },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: `${day} menu updated! 📋`, menu });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Today's Menu
export const getTodayMenu = async (req, res) => {
    try {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[new Date().getDay()];
        
        const menu = await MessMenu.findOne({ day: todayName });
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
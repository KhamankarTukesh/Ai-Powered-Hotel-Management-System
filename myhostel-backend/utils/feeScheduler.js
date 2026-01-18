import cron from 'node-cron';
import Fee from '../models/Fee.js';

// Roz raat 12 baje chalega
cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    const overdueFees = await Fee.find({ 
        dueDate: { $lt: today }, 
        status: { $ne: 'Paid' } 
    });

    for (let fee of overdueFees) {
        const penalty = 500;
        fee.totalAmount += penalty; 
        await fee.save();
    }
    console.log("Checked for overdue fees and applied penalties! 💸");
});
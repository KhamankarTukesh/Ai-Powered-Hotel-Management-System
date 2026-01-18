import cron from 'node-cron';
import Fee from '../models/Fee.js';

// Roz raat 12 baje chalega
const initCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log("Running Daily Penalty Check... ⏳");
        try {
            const today = new Date();
            // Un paid fees dhundo jinki dueDate nikal chuki hai
            const overdueFees = await Fee.find({ 
                dueDate: { $lt: today }, 
                status: { $in: ['Unpaid', 'Partially Paid', 'Pending Verification'] } 
            });

            for (let fee of overdueFees) {
                const penalty = 500;
                fee.totalAmount += penalty; 
                // Aap chaho toh yahan ek log bhi save kar sakte ho
                await fee.save();
            }
            console.log(`Applied penalty to ${overdueFees.length} accounts! 💸`);
        } catch (error) {
            console.error("Cron Job Error:", error);
        }
    });
};

export default initCronJobs;
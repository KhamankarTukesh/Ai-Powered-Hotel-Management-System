import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Dnyanda Hostel" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions); 
        console.log("✅ Mail Server Response:", info.response); 
        return info;
    } catch (error) {
        console.error("❌ NODEMAILER REAL ERROR:", error.message);
        // Throw the error so the controller's catch block can handle it
        throw new Error(error.message); 
    }
};
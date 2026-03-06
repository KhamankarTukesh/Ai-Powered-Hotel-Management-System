import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Fix 1: Create transporter ONCE (not on every email call — that was causing slowness)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  
    },
    pool: true,         
    maxConnections: 5,  
});


transporter.verify((error) => {
    if (error) {
        console.error("❌ Email transporter config error:", error.message);
        console.error("👉 Check EMAIL_USER and EMAIL_PASS in your .env file");
        console.error("👉 EMAIL_PASS must be a Gmail App Password (not your real password)");
    } else {
        console.log("✅ Email server is ready to send messages");
    }
});

export const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: `"Dnyanda Hostel" <${process.env.EMAIL_USER}>`,
            to,
            subject,
          
            text,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border-radius: 12px; border: 1px solid #ffedd5;">
                    <h2 style="color: #f97415; margin-bottom: 8px;">Dnyanda Hostel</h2>
                    <hr style="border: none; border-top: 1px solid #ffedd5; margin-bottom: 20px;" />
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">${text}</p>
                    <hr style="border: none; border-top: 1px solid #ffedd5; margin-top: 20px;" />
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 12px;">This is an automated message. Please do not reply.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to} | Message ID: ${info.messageId}`);
        return info;

    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error.message);
        throw new Error(error.message);
    }
};
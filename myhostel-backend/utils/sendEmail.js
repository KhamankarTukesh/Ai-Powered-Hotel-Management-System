import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Port 465 use karo — Render pe 587 block hota hai
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // ✅ SSL for port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // ✅ Gmail App Password (16 char)
    }
});

// ✅ Server start pe verify karo
transporter.verify((error) => {
    if (error) {
        console.error('❌ Email config error:', error.message);
    } else {
        console.log('✅ Email server ready!');
    }
});

export const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"Dnyanda Hostel" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:16px;border:1px solid #ffedd5;">
                    <h2 style="color:#f97415;">Dnyanda Hostel 🏠</h2>
                    <hr style="border:none;border-top:1px solid #ffedd5;margin-bottom:20px;"/>
                    <p style="color:#334155;font-size:15px;line-height:1.7;">${text}</p>
                    <hr style="border:none;border-top:1px solid #ffedd5;margin-top:20px;"/>
                    <p style="color:#94a3b8;font-size:11px;">Automated message. Do not reply.</p>
                </div>
            `
        });
        console.log(`✅ Email sent to ${to}`);
        return info;
    } catch (err) {
        console.error('❌ Email failed:', err.message);
        throw err;
    }
};
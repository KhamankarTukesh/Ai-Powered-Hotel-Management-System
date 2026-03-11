import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text) => {
    try {
        await sgMail.send({
            to,
            from: process.env.SENDGRID_FROM,
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
    } catch (err) {
        console.error('❌ SendGrid failed:', err.message);
        throw err;
    }
};
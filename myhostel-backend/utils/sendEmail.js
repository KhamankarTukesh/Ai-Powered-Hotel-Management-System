import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:16px;border:1px solid #ffedd5;">
                    <h2 style="color:#f97415;">Dnyanda Hostel 🏠</h2>
                    <hr style="border:none;border-top:1px solid #ffedd5;"/>
                    <p style="color:#334155;font-size:15px;line-height:1.7;">${text}</p>
                    <hr style="border:none;border-top:1px solid #ffedd5;"/>
                    <p style="color:#94a3b8;font-size:11px;">Automated message. Do not reply.</p>
                </div>
            `
        });

        if (error) throw new Error(error.message);
        console.log(`✅ Email sent to ${to}`);
        return data;

    } catch (err) {
        console.error('❌ Email failed:', err.message);
        throw err;
    }
};
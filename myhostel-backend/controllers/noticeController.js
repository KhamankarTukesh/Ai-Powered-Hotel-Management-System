import Notice from "../models/Notice.js";
import { v2 as cloudinary } from 'cloudinary';

import { uploadPDFToCloudinary } from '../config/cloudinary.js';

export const postNotice = async (req, res) => {
    try {
        const { title, content, isEmergency } = req.body;
        const category = req.body.category ? req.body.category.trim() : 'General';
        let attachmentUrl = "";

        if (req.file) {
            const result = await uploadPDFToCloudinary(req.file.buffer);
            attachmentUrl = result.secure_url;
        }

        const newNotice = await Notice.create({
            title,
            content,
            category,
            isEmergency,
            attachmentUrl,
            postedBy: req.user.id
        });

        res.status(201).json({ message: "Notice posted successfully!", newNotice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;


        const notice = await Notice.findById(id);
        if (!notice) return res.status(404).json({ message: "Notice not found" });

        // 2. Agar notice mein attachment hai, toh Cloudinary se delete karo
        if (notice.attachmentUrl) {
            const publicId = notice.attachmentUrl.split('/').pop().split('.')[0];
            const fullPath = `Hostel_Notices/${publicId}`;

            await cloudinary.uploader.destroy(fullPath, { resource_type: "raw" });
        }


        await Notice.findByIdAndDelete(id);

        res.status(200).json({ message: "Notice and attached file deleted from Cloudinary! 🗑️" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const sendEmergencyAlert = async (req, res) => {
    try {
        const { title, message } = req.body;

        const alert = await Notice.create({
            title: `🚨 EMERGENCY: ${title}`,
            content: message,
            isEmergency: true, // Schema mein ye field add kar dena
            createdBy: req.user.id
        });

        // Yahan aap Nodemailer use karke sabko ek saath Email bhi bhej sakte ho
        res.status(201).json({ message: "Emergency Alert Broadcasted! 📣", alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
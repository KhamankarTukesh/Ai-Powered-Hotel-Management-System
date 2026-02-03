import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ID Cards ke liye storage (Images only)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Hostel_ID_Cards', 
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});


export const uploadPDFToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                resource_type: "auto", 
                folder: "Hostel_Outpasses",
                // 'attachment' flag hatane se browser mein PDF preview hoga
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export { cloudinary, storage };
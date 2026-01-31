import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

const StudentProfile = () => {
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = React.useRef(null);
    const [formData, setFormData] = useState({
        guardianName: '',
        relation: '',
        guardianContact: '',
        altContact: '',
        address: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await API.get('/users/profile');
                setUser(data);

                if (data.parentDetails) {
                    setFormData({
                        guardianName: data.parentDetails.guardianName || '',
                        relation: data.parentDetails.relation || '',
                        guardianContact: data.parentDetails.guardianContact || '',
                        altContact: data.parentDetails.altContact || '',
                        address: data.parentDetails.address || ''
                    });
                }

                // Notification logic: Yeh tabhi chalega jab first time data fetch ho
                if (!data.parentDetails?.guardianName) {
                    toast.error("Please complete your Parent Details to finalize your profile.", {
                        duration: 6000,
                        position: 'top-center',
                        style: {
                            borderRadius: '16px',
                            background: '#fff',
                            color: '#1b140d',
                            border: '1px solid #f09942',
                            padding: '16px'
                        },
                        icon: '⚠️',
                    });
                }
            } catch (error) {
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []); // <--- Dependency array ko empty rakhein
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('upload_preset', 'ml_default');

        const loadingToast = toast.loading("Uploading image...");

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/doge2oezl/image/upload', {
                method: 'POST',
                body: uploadFormData
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error?.message || "Upload failed");

            if (data.secure_url) {
                // Backend ko update bhejna
                await API.put('/users/profile/update', {
                    studentDetails: { idCardImage: data.secure_url }
                });

                setUser(prev => ({
                    ...prev,
                    studentDetails: { ...prev.studentDetails, idCardImage: data.secure_url }
                }));

                toast.success("Image updated successfully!", { id: loadingToast });
            }
        } catch (error) {
            console.error("Upload Error:", error);
            // YE LINE ZAROORI HAI: Isse rotating animation ruk jayegi aur error dikhega
            toast.error(error.message || "Upload failed!", { id: loadingToast });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const toastId = toast.loading("Saving changes...");

        try {
            const payload = {
                parentDetails: { ...formData }
            };

            await API.put('/users/profile/update', payload);

            // Success: Local user state update karein taaki UI sync rahe
            setUser(prev => ({
                ...prev,
                parentDetails: { ...formData }
            }));

            toast.success("Profile updated successfully!", {
                id: toastId,
                duration: 4000
            });

            setIsEditing(false); // Edit mode band
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Failed to save. Please try again.", { id: toastId });
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
            }, 1000);
        }
    };


    const handleImageClick = () => {
        fileInputRef.current.click(); // Camera icon click karne par file selector khulega
    };

    return (

        <div className="bg-[#fffaf5] min-h-screen font-['Inter'] text-[#1b140d]">
            <Toaster position="top-center" reverseOrder={false} />
            <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-10">
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(240,153,66,0.15)] p-6 md:p-10">
                    {/* NAYA OPTIMIZED HEADER CODE */}

                    <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-dashed border-gray-200">
                        <div className="relative group">
                            {/* Profile Image / Initials */}
                            {user?.studentDetails?.idCardImage ? (
                                <img
                                    src={user.studentDetails.idCardImage.replace('/upload/', '/upload/w_400,h_400,c_fill,g_face,q_auto,f_auto/')}
                                    alt="Profile"
                                    className="size-32 md:size-40 rounded-full border-4 border-white shadow-lg object-cover transition-transform group-hover:scale-105 cursor-pointer"
                                    onClick={() => window.open(user.studentDetails.idCardImage, '_blank')}
                                    title="Click to view full image"
                                />
                            ) : (
                                <div className="size-32 md:size-40 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-[#f09942] to-[#d87d2a] flex items-center justify-center text-white text-4xl font-black uppercase">
                                    {user?.fullName?.charAt(0) || 'S'}
                                </div>
                            )}

                            {/* Camera Button: Triggers hidden input */}
                            <div
                                onClick={handleImageClick}
                                className="absolute bottom-2 right-2 bg-white p-2.5 rounded-full shadow-md cursor-pointer hover:bg-orange-50 hover:text-[#f09942] transition-all border border-gray-100 z-10 active:scale-90"
                            >
                                <span className="material-symbols-outlined text-sm font-bold">photo_camera</span>
                            </div>

                            {/* Hidden Input Field */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight">{user?.fullName}</h1>
                                <span className="px-3 py-1 bg-[#f09942]/10 text-[#f09942] text-xs font-bold uppercase rounded-full border border-[#f09942]/20">Student</span>
                            </div>

                            <p className="text-[#9a734c] text-lg font-medium mb-1">
                                {user?.allocatedRoom
                                    ? `Room ${user.allocatedRoom.roomNumber} • ${user.allocatedRoom.block}`
                                    : 'No Room Allocated'} • Hostel Resident
                            </p>

                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <span className="material-symbols-outlined text-base">school</span>
                                <span>{user?.studentDetails?.department} • Year {user?.studentDetails?.currentYear}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
                        {/* Left Column: Academic Details (Read Only) */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="flex items-center gap-2 px-2">
                                <span className="material-symbols-outlined text-gray-400">lock</span>
                                <h2 className="text-xl font-bold">Academic Details</h2>
                            </div>
                            <div className="bg-white/50 rounded-2xl p-6 border border-white space-y-5">
                                <DetailItem label="Roll Number" value={user?.studentDetails?.rollNumber} locked />
                                <DetailItem label="Email Address" value={user?.email} locked />
                                <DetailItem label="Department" value={user?.studentDetails?.department} locked />
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Batch" value={user?.studentDetails?.batch} />
                                    <DetailItem label="Year" value={user?.studentDetails?.currentYear + " Year"} />
                                </div>
                                <p className="text-[10px] text-gray-400 italic text-center pt-4">Admin-managed fields are locked.</p>
                            </div>
                        </div>

                        {/* Right Column: Parent Details (Editable) */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div className="flex items-center gap-2 px-2">
                                <span className="material-symbols-outlined text-[#f09942]">family_restroom</span>
                                <h2 className="text-xl font-bold">Parent / Guardian Details</h2>
                            </div>
                            {/* Parent Details Section */}
                            <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <Input
                                        label="Guardian Name"
                                        value={formData.guardianName}
                                        onChange={(val) => setFormData({ ...formData, guardianName: val })}
                                        disabled={!isEditing}
                                    />
                                    <Input
                                        label="Relationship"
                                        value={formData.relation}
                                        onChange={(val) => setFormData({ ...formData, relation: val })}
                                        disabled={!isEditing}
                                    />
                                    {/* ADD THESE THREE 👇 */}
                                    <Input
                                        label="Contact Number"
                                        value={formData.guardianContact}
                                        onChange={(val) => setFormData({ ...formData, guardianContact: val })}
                                        disabled={!isEditing}
                                    />
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Permanent Home Address"
                                            value={formData.address}
                                            onChange={(val) => setFormData({ ...formData, address: val })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-6 border-t border-gray-50">
                                    {!isEditing ? (
                                        // EDIT BUTTON: Jab user ko edit karna ho
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 font-bold py-3 px-10 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                            Edit Details
                                        </button>
                                    ) : (
<div className="flex justify-end gap-4 pt-6 border-t border-gray-50">
    {!isEditing ? (
        <button
            type="button" // <--- IMPORTANT: Ye form submit nahi karega
            onClick={(e) => {
                e.preventDefault(); // Extra safety
                setIsEditing(true);
            }}
            className="flex items-center gap-2 font-bold py-3 px-10 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all active:scale-95"
        >
            <span className="material-symbols-outlined">edit</span>
            Edit Details
        </button>
    ) : (
        <button
            type="submit" // <--- Sirf ye submit karega
            disabled={isSubmitting}
            className={`flex items-center gap-2 font-bold py-3 px-10 rounded-2xl shadow-lg transition-all 
                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f09942] hover:bg-[#d87d2a] text-white'} active:scale-95`}
        >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
    )}
</div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper Components
const DetailItem = ({ label, value, locked = false }) => (
    <div className="flex flex-col gap-1.5 opacity-80">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <span className="text-gray-700 font-semibold text-sm">{value || 'N/A'}</span>
            {locked && <span className="material-symbols-outlined text-gray-300 text-sm">lock</span>}
        </div>
    </div>
);

const Input = ({ label, placeholder, value, onChange, disabled }) => (
    <label className={`flex flex-col gap-2 ${disabled ? 'opacity-70' : ''}`}>
        <span className="text-sm font-semibold">{label}</span>
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            disabled={disabled} // Native input ko disable karega
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-12 rounded-xl border-gray-200 outline-none px-4 transition-all 
                ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'focus:border-[#f09942] focus:ring-2 focus:ring-[#f09942]/20'}`}
        />
    </label>
);

export default StudentProfile;
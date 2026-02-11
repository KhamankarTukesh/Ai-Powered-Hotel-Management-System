import React, { useState, useEffect, useRef } from 'react';
import API from '../../api/axios';
import { Toaster, toast } from 'react-hot-toast';

const StudentProfile = () => {
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        guardianName: '',
        relation: '',
        guardianContact: '',
        altContact: '',
        address: ''
    });

    // ================= FETCH USER =================
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await API.get('/users/profile');

                setUser(data);

                if (data?.parentDetails) {
                    setFormData({
                        guardianName: data.parentDetails.guardianName || '',
                        relation: data.parentDetails.relation || '',
                        guardianContact: data.parentDetails.guardianContact || '',
                        altContact: data.parentDetails.altContact || '',
                        address: data.parentDetails.address || ''
                    });
                }

                if (!data?.parentDetails?.guardianName) {
                    toast.error("Please complete Parent Details to finalize your profile");
                }

            } catch {
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // ================= IMAGE UPLOAD =================
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith("image/")) {
            return toast.error("Please upload image file");
        }

        if (file.size > 2 * 1024 * 1024) {
            return toast.error("Image must be under 2MB");
        }

        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', 'ml_default');

        const loadingToast = toast.loading("Uploading image...");

        try {
            const res = await fetch(
                'https://api.cloudinary.com/v1_1/doge2oezl/image/upload',
                { method: 'POST', body: form }
            );

            const data = await res.json();
            if (!res.ok) throw new Error("Upload failed");

            await API.put('/users/profile/update', {
                studentDetails: { idCardImage: data.secure_url }
            });

            setUser(prev => ({
                ...prev,
                studentDetails: {
                    ...(prev?.studentDetails || {}),
                    idCardImage: data.secure_url
                }
            }));

            toast.success("Image updated!", { id: loadingToast });

        } catch {
            toast.error("Upload failed!", { id: loadingToast });
        }
    };

    // ================= SAVE =================
    const handleSave = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const toastId = toast.loading("Saving...");

        try {
            await API.put('/users/profile/update', {
                parentDetails: formData
            });

            setUser(prev => ({
                ...prev,
                parentDetails: formData
            }));

            setIsEditing(false);
            toast.success("Profile updated!", { id: toastId });

        } catch {
            toast.error("Save failed", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ================= LOADING UI =================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-500">
                    Loading profile...
                </span>
            </div>
        );
    }

    return (
        <div className="bg-[#fffaf5] min-h-screen text-[#1b140d]">
            <Toaster position="top-center" />

            <main className="max-w-6xl mx-auto px-4 py-10">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-8">

                        {/* PROFILE IMAGE */}
                        <div className="relative">
                            {user?.studentDetails?.idCardImage ? (
                                <img
                                    src={user.studentDetails.idCardImage}
                                    className="w-32 h-32 rounded-full object-cover border"
                                    alt="profile"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-orange-400 flex items-center justify-center text-white text-4xl font-bold">
                                    {user?.fullName?.charAt(0) || "S"}
                                </div>
                            )}

                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow"
                            >
                                📷
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        {/* BASIC INFO */}
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold">
                                {user?.fullName}
                            </h1>

                            <p className="text-gray-500">
                                {user?.allocatedRoom
                                    ? `Room ${user.allocatedRoom.roomNumber}`
                                    : "No Room Allocated"}
                            </p>

                            <p className="text-sm text-gray-400">
                                {user?.studentDetails?.department}
                            </p>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="grid lg:grid-cols-12 gap-8 mt-8">

                        {/* ACADEMIC */}
                        <div className="lg:col-span-4 space-y-4">
                            <h2 className="font-bold">Academic Details</h2>

                            <DetailItem label="Roll Number" value={user?.studentDetails?.rollNumber} />
                            <DetailItem label="Email" value={user?.email} />
                            <DetailItem label="Department" value={user?.studentDetails?.department} />
                        </div>

                        {/* PARENT */}
                        <div className="lg:col-span-8">
                            <form onSubmit={handleSave} className="space-y-6">

                                <h2 className="font-bold text-lg">
                                    Parent Details
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4">

                                    <Input
                                        label="Guardian Name"
                                        value={formData.guardianName}
                                        disabled={!isEditing}
                                        onChange={(v) =>
                                            setFormData({ ...formData, guardianName: v })
                                        }
                                    />

                                    <Input
                                        label="Relationship"
                                        value={formData.relation}
                                        disabled={!isEditing}
                                        onChange={(v) =>
                                            setFormData({ ...formData, relation: v })
                                        }
                                    />

                                    <Input
                                        label="Contact"
                                        value={formData.guardianContact}
                                        disabled={!isEditing}
                                        onChange={(v) =>
                                            setFormData({ ...formData, guardianContact: v })
                                        }
                                    />

                                    <Input
                                        label="Address"
                                        value={formData.address}
                                        disabled={!isEditing}
                                        onChange={(v) =>
                                            setFormData({ ...formData, address: v })
                                        }
                                    />

                                </div>

                                {/* BUTTONS */}
                                <div className="flex justify-end pt-4 border-t">

                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="bg-gray-100 px-6 py-2 rounded-xl font-semibold"
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-orange-400 text-white px-6 py-2 rounded-xl font-semibold"
                                        >
                                            {isSubmitting ? "Saving..." : "Save"}
                                        </button>
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

// ================= HELPER COMPONENTS =================

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-semibold">{value || "N/A"}</p>
    </div>
);

const Input = ({ label, value, onChange, disabled }) => (
    <div>
        <label className="text-sm font-semibold">{label}</label>
        <input
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 mt-1 
            ${disabled ? "bg-gray-100" : "focus:border-orange-400"}`}
        />
    </div>
);

export default StudentProfile;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import { Toaster, toast } from 'react-hot-toast';
import { Pencil, Check, X, Camera } from 'lucide-react';

const StudentProfile = () => {
    const [user, setUser]               = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing]     = useState(false);
    const [loading, setLoading]         = useState(true);
    const fileInputRef                  = useRef(null);

    const [formData, setFormData] = useState({
        guardianName: '', relation: '',
        guardianContact: '', altContact: '', address: ''
    });

    // ── Fetch ──
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await API.get('/users/profile');
                setUser(data);
                if (data?.parentDetails) {
                    setFormData({
                        guardianName:    data.parentDetails.guardianName    || '',
                        relation:        data.parentDetails.relation        || '',
                        guardianContact: data.parentDetails.guardianContact || '',
                        altContact:      data.parentDetails.altContact      || '',
                        address:         data.parentDetails.address         || '',
                    });
                }
                if (!data?.parentDetails?.guardianName)
                    toast.error("Please complete Parent Details");
            } catch {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // ── Image Upload ──
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/'))  return toast.error("Upload an image file");
        if (file.size > 2 * 1024 * 1024)     return toast.error("Image must be under 2MB");

        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', 'ml_default');

        const tid = toast.loading("Uploading...");
        try {
            const res  = await fetch('https://api.cloudinary.com/v1_1/doge2oezl/image/upload', { method: 'POST', body: form });
            const data = await res.json();
            if (!res.ok) throw new Error();

            await API.put('/users/profile/update', { studentDetails: { idCardImage: data.secure_url } });
            setUser(prev => ({ ...prev, studentDetails: { ...(prev?.studentDetails || {}), idCardImage: data.secure_url } }));
            toast.success("Photo updated!", { id: tid });
        } catch {
            toast.error("Upload failed", { id: tid });
        }
    };

    // ── Save ──
    const handleSave = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const tid = toast.loading("Saving...");
        try {
            await API.put('/users/profile/update', { parentDetails: formData });
            setUser(prev => ({ ...prev, parentDetails: formData }));
            setIsEditing(false);
            toast.success("Saved!", { id: tid });
        } catch {
            toast.error("Save failed", { id: tid });
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelEdit = () => {
        if (user?.parentDetails) {
            setFormData({
                guardianName:    user.parentDetails.guardianName    || '',
                relation:        user.parentDetails.relation        || '',
                guardianContact: user.parentDetails.guardianContact || '',
                altContact:      user.parentDetails.altContact      || '',
                address:         user.parentDetails.address         || '',
            });
        }
        setIsEditing(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fffaf5]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-slate-400">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="bg-[#fffaf5] min-h-screen text-slate-800">
            <Toaster position="top-center" />

            <main className="max-w-5xl mx-auto px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                    {/* ── Orange Top Banner ── */}
                    <div className="h-24 bg-gradient-to-r from-orange-500 to-amber-400" />

                    <div className="px-6 md:px-10 pb-10">

                        {/* ── Avatar + Name ── */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-14 mb-8">
                            <div className="relative shrink-0">
                                {user?.studentDetails?.idCardImage ? (
                                    <img src={user.studentDetails.idCardImage} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" alt="profile" />
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-orange-400 flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-lg">
                                        {user?.fullName?.charAt(0) || 'S'}
                                    </div>
                                )}
                                <button onClick={() => fileInputRef.current.click()}
                                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center border border-orange-100 hover:bg-orange-50 transition-all">
                                    <Camera size={14} className="text-orange-500" />
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </div>

                            <div className="text-center sm:text-left pb-1">
                                <h1 className="text-xl font-black text-slate-800">{user?.fullName}</h1>
                                <p className="text-slate-400 text-sm">{user?.allocatedRoom ? `Room ${user.allocatedRoom.roomNumber}` : 'No Room Allocated'} · {user?.studentDetails?.department || ''}</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-8">

                            {/* ── Academic Details ── */}
                            <div className="lg:col-span-4">
                                <h2 className="font-black text-sm uppercase tracking-widest text-orange-500 mb-4">Academic</h2>
                                <div className="space-y-4 bg-orange-50/50 rounded-2xl border border-orange-100 p-5">
                                    <Detail label="Roll Number" value={user?.studentDetails?.rollNumber} />
                                    <Detail label="Email"       value={user?.email} />
                                    <Detail label="Department"  value={user?.studentDetails?.department} />
                                    <Detail label="Phone"       value={user?.phone} />
                                </div>
                            </div>

                            {/* ── Parent Details ── */}
                            <div className="lg:col-span-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-black text-sm uppercase tracking-widest text-orange-500">Parent Details</h2>

                                    {/* Edit / Cancel buttons */}
                                    <AnimatePresence mode="wait">
                                        {!isEditing ? (
                                            <motion.button key="edit"
                                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                type="button" onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition-all">
                                                <Pencil size={13} /> Edit
                                            </motion.button>
                                        ) : (
                                            <motion.div key="actions" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex gap-2">
                                                <button type="button" onClick={cancelEdit}
                                                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
                                                    <X size={13} /> Cancel
                                                </button>
                                                <button type="submit" form="parentForm" disabled={isSubmitting}
                                                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-md shadow-orange-100">
                                                    <Check size={13} /> {isSubmitting ? 'Saving...' : 'Save'}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <form id="parentForm" onSubmit={handleSave}>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Guardian Name',   key: 'guardianName' },
                                            { label: 'Relationship',    key: 'relation' },
                                            { label: 'Contact Number',  key: 'guardianContact' },
                                            { label: 'Alt Contact',     key: 'altContact' },
                                            { label: 'Address',         key: 'address' },
                                        ].map(({ label, key }) => (
                                            <motion.div key={key}
                                                animate={{ opacity: 1 }}
                                                className={key === 'address' ? 'sm:col-span-2' : ''}
                                            >
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">{label}</label>
                                                <AnimatePresence mode="wait">
                                                    {isEditing ? (
                                                        <motion.input key="input"
                                                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                                                            transition={{ duration: 0.15 }}
                                                            value={formData[key]}
                                                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                            className="w-full border border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300/40 bg-white transition-all"
                                                        />
                                                    ) : (
                                                        <motion.div key="value"
                                                            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                                                            transition={{ duration: 0.15 }}
                                                            className="w-full bg-orange-50/50 border border-orange-100 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-[42px]">
                                                            {formData[key] || <span className="text-slate-300">—</span>}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

const Detail = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value || '—'}</p>
    </div>
);

export default StudentProfile;
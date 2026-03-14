import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import { Toaster, toast } from 'react-hot-toast';
import { Pencil, Check, X, Camera, ShieldCheck, Mail, Phone, User, Calendar } from 'lucide-react';

const WardenProfile = () => {
    const [user, setUser]               = useState(null);
    const [loading, setLoading]         = useState(true);
    const [isEditing, setIsEditing]     = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef                  = useRef(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
    });

    // ── Fetch ──
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/users/profile');
                setUser(data);
                setFormData({
                    fullName: data?.fullName || '',
                    phone:    data?.phone    || '',
                });
            } catch {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // ── Image Upload ──
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return toast.error("Upload an image file");
        if (file.size > 2 * 1024 * 1024)    return toast.error("Image must be under 2MB");

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
            await API.put('/users/profile/update', { fullName: formData.fullName, phone: formData.phone });
            setUser(prev => ({ ...prev, fullName: formData.fullName, phone: formData.phone }));
            setIsEditing(false);
            toast.success("Profile updated!", { id: tid });
        } catch {
            toast.error("Save failed", { id: tid });
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelEdit = () => {
        setFormData({ fullName: user?.fullName || '', phone: user?.phone || '' });
        setIsEditing(false);
    };

    const roleBadge = {
        warden: { label: 'Warden',       color: 'bg-orange-100 text-orange-600 border-orange-200' },
        admin:  { label: 'Administrator', color: 'bg-blue-100 text-blue-600 border-blue-200'       },
        staff:  { label: 'Staff',         color: 'bg-green-100 text-green-600 border-green-200'    },
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fffaf5]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-slate-400">Loading profile...</p>
            </div>
        </div>
    );

    const inputCls = "w-full border border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300/40 bg-white transition-all";
    const viewCls  = "w-full bg-orange-50/50 border border-orange-100 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-[42px]";
    const badge    = roleBadge[user?.role] || roleBadge.warden;

    return (
        <div className="bg-[#fffaf5] min-h-screen text-slate-800">
            <Toaster position="top-center" />

            <main className="max-w-3xl mx-auto px-4 py-10">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden">

                    {/* ── Banner ── */}
                    <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-600" />

                    <div className="px-6 md:px-10 pb-10">

                        {/* ── Avatar + Name ── */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-14 mb-8">
                            <div className="relative shrink-0">
                                {user?.studentDetails?.idCardImage ? (
                                    <img src={user.studentDetails.idCardImage}
                                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" alt="profile" />
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-slate-700 flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-lg">
                                        {user?.fullName?.charAt(0) || 'W'}
                                    </div>
                                )}
                                <button onClick={() => fileInputRef.current.click()}
                                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center border border-orange-100 hover:bg-orange-50 transition-all">
                                    <Camera size={14} className="text-orange-500" />
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </div>

                            <div className="text-center sm:text-left pb-1 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                    <h1 className="text-xl font-black text-slate-800">{user?.fullName}</h1>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border w-fit mx-auto sm:mx-0 ${badge.color}`}>
                                        {badge.label}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm">{user?.email}</p>
                            </div>
                        </div>

                        {/* ── Profile Info ── */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-black text-sm uppercase tracking-widest text-orange-500">Profile Information</h2>

                                <AnimatePresence mode="wait">
                                    {!isEditing ? (
                                        <motion.button key="edit"
                                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                            type="button" onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition-all">
                                            <Pencil size={13} /> Edit
                                        </motion.button>
                                    ) : (
                                        <motion.div key="actions"
                                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex gap-2">
                                            <button type="button" onClick={cancelEdit}
                                                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
                                                <X size={13} /> Cancel
                                            </button>
                                            <button type="submit" form="wardenForm" disabled={isSubmitting}
                                                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-md shadow-orange-100">
                                                <Check size={13} /> {isSubmitting ? 'Saving...' : 'Save'}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <form id="wardenForm" onSubmit={handleSave}>
                                <div className="grid sm:grid-cols-2 gap-4">

                                    {/* Full Name */}
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <User size={11} /> Full Name
                                        </label>
                                        {isEditing
                                            ? <input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="Enter full name" className={inputCls} />
                                            : <div className={viewCls}>{user?.fullName || '—'}</div>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <Phone size={11} /> Phone
                                        </label>
                                        {isEditing
                                            ? <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone number" className={inputCls} />
                                            : <div className={viewCls}>{user?.phone || <span className="text-slate-300">—</span>}</div>}
                                    </div>

                                    {/* Email — read only */}
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <Mail size={11} /> Email
                                        </label>
                                        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 min-h-[42px]">
                                            {user?.email || '—'}
                                        </div>
                                    </div>

                                    {/* Role — read only */}
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <ShieldCheck size={11} /> Role
                                        </label>
                                        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 min-h-[42px] capitalize">
                                            {user?.role || '—'}
                                        </div>
                                    </div>

                                    {/* Joined Date — read only */}
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <Calendar size={11} /> Joined
                                        </label>
                                        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 min-h-[42px]">
                                            {user?.createdAt ? new Date(user.createdAt).toDateString() : '—'}
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default WardenProfile;
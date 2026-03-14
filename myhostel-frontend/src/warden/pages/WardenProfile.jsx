import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import { Toaster, toast } from 'react-hot-toast';
import { Pencil, Check, X, Camera, ShieldCheck, Mail, Phone, User, Calendar, Building2 } from 'lucide-react';

const WardenProfile = () => {
    const [user, setUser]                 = useState(null);
    const [loading, setLoading]           = useState(true);
    const [isEditing, setIsEditing]       = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef                    = useRef(null);

    const [formData, setFormData] = useState({ fullName: '', phone: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/users/profile');
                setUser(data);
                setFormData({ fullName: data?.fullName || '', phone: data?.phone || '' });
            } catch {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

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
        } catch { toast.error("Upload failed", { id: tid }); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const tid = toast.loading("Saving...");
        try {
            await API.put('/users/profile/update', { fullName: formData.fullName, phone: formData.phone });
            setUser(prev => ({ ...prev, ...formData }));
            setIsEditing(false);
            toast.success("Profile updated!", { id: tid });
        } catch { toast.error("Save failed", { id: tid }); }
        finally { setIsSubmitting(false); }
    };

    const cancelEdit = () => {
        setFormData({ fullName: user?.fullName || '', phone: user?.phone || '' });
        setIsEditing(false);
    };

    const roleConfig = {
        warden: { label: 'Warden',        bg: 'bg-orange-500',  light: 'bg-orange-100 text-orange-700' },
        admin:  { label: 'Administrator', bg: 'bg-slate-800',   light: 'bg-slate-100 text-slate-700'   },
        staff:  { label: 'Staff',          bg: 'bg-green-600',   light: 'bg-green-100 text-green-700'   },
    };
    const role = roleConfig[user?.role] || roleConfig.warden;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fffaf5]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-slate-400">Loading profile...</p>
            </div>
        </div>
    );

    const inputCls = "w-full border border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300/40 bg-white transition-all";

    return (
        <div className="bg-[#fffaf5] min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');`}</style>
            <Toaster position="top-center" />

            <main className="max-w-4xl mx-auto px-4 py-10 space-y-5">

                {/* ── Hero Card ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden">

                    {/* Top colored strip */}
                    <div className={`h-3 ${role.bg}`} />

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                            {/* Avatar */}
                            <div className="relative shrink-0">
                                {user?.studentDetails?.idCardImage ? (
                                    <img src={user.studentDetails.idCardImage}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-orange-100" alt="profile" />
                                ) : (
                                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${role.bg} flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-xl`}>
                                        {user?.fullName?.charAt(0) || 'W'}
                                    </div>
                                )}
                                <button onClick={() => fileInputRef.current.click()}
                                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center border border-orange-100 hover:bg-orange-50 transition-all">
                                    <Camera size={14} className="text-orange-500" />
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </div>

                            {/* Name + Info — fully visible */}
                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                                        {user?.fullName || 'Warden'}
                                    </h1>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 ${role.light}`}>
                                        {role.label}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm font-medium mb-4">{user?.email}</p>

                                {/* Quick stats row */}
                                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                        <Phone size={12} className="text-orange-400" />
                                        {user?.phone || 'No phone'}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                        <Building2 size={12} className="text-orange-400" />
                                        Dnyanda Hostel
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                        <Calendar size={12} className="text-orange-400" />
                                        Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
                                    </div>
                                </div>
                            </div>

                            {/* Edit button — top right */}
                            <div className="shrink-0">
                                <AnimatePresence mode="wait">
                                    {!isEditing ? (
                                        <motion.button key="edit"
                                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition-all">
                                            <Pencil size={13} /> Edit Profile
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
                        </div>
                    </div>
                </motion.div>

                {/* ── Edit Form Card ── */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-orange-100">
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-5">Edit Information</p>
                            <form id="wardenForm" onSubmit={handleSave}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 block">
                                            <User size={11} /> Full Name
                                        </label>
                                        <input value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Enter full name" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 block">
                                            <Phone size={11} /> Phone
                                        </label>
                                        <input value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Enter phone number" className={inputCls} />
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Details Card ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-5">Account Details</p>
                    <div className="grid sm:grid-cols-2 gap-4">

                        {[
                            { icon: Mail,        label: 'Email',       value: user?.email,    locked: true  },
                            { icon: ShieldCheck, label: 'Role',        value: user?.role,     locked: true  },
                            { icon: User,        label: 'Full Name',   value: user?.fullName, locked: false },
                            { icon: Phone,       label: 'Phone',       value: user?.phone,    locked: false },
                        ].map(({ icon: Icon, label, value, locked }) => (
                            <div key={label} className="flex items-start gap-3 p-4 rounded-2xl bg-orange-50/40 border border-orange-100">
                                <div className="w-8 h-8 rounded-xl bg-white border border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                                    <Icon size={14} className="text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                                    <p className="text-sm font-bold text-slate-700 truncate capitalize">
                                        {value || <span className="text-slate-300 font-normal">—</span>}
                                    </p>
                                </div>
                                {locked && (
                                    <span className="ml-auto text-[9px] font-black text-slate-300 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">LOCKED</span>
                                )}
                            </div>
                        ))}

                        {/* Joined — full width */}
                        <div className="sm:col-span-2 flex items-start gap-3 p-4 rounded-2xl bg-orange-50/40 border border-orange-100">
                            <div className="w-8 h-8 rounded-xl bg-white border border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                                <Calendar size={14} className="text-orange-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Member Since</p>
                                <p className="text-sm font-bold text-slate-700">
                                    {user?.createdAt ? new Date(user.createdAt).toDateString() : '—'}
                                </p>
                            </div>
                            <span className="ml-auto text-[9px] font-black text-slate-300 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">LOCKED</span>
                        </div>

                    </div>
                </motion.div>

            </main>
        </div>
    );
};

export default WardenProfile;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import { Toaster, toast } from 'react-hot-toast';
import { Pencil, Check, X, Camera } from 'lucide-react';

const StudentProfile = () => {
    const [user, setUser]                             = useState(null);
    const [isSubmitting, setIsSubmitting]             = useState(false);
    const [isEditing, setIsEditing]                   = useState(false);
    const [isEditingAcademic, setIsEditingAcademic]   = useState(false);
    const [isSubmittingAcademic, setIsSubmittingAcademic] = useState(false);
    const [loading, setLoading]                       = useState(true);
    const fileInputRef                                = useRef(null);

    const [formData, setFormData] = useState({
        guardianName: '', relation: '',
        guardianContact: '', altContact: '', address: ''
    });

    const [academicData, setAcademicData] = useState({
        rollNumber: '', department: '', phone: '',
        course: '', batch: '', currentYear: ''
    });

    // ── Fetch ──
    useEffect(() => {
        const fetchProfile = async () => {
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

                if (data?.studentDetails) {
                    setAcademicData({
                        rollNumber:  data.studentDetails.rollNumber  || '',
                        department:  data.studentDetails.department  || '',
                        phone:       data.studentDetails.phone       || '',
                        course:      data.studentDetails.course      || '',
                        batch:       data.studentDetails.batch       || '',
                        currentYear: data.studentDetails.currentYear?.toString() || '',
                    });
                }

                // ✅ Google user — incomplete fields toh auto edit open
                const isIncomplete = !data?.studentDetails?.rollNumber || !data?.studentDetails?.department;
                if (isIncomplete) {
                    toast('📝 Complete your academic details!', { duration: 4000, icon: '⚠️' });
                    setIsEditingAcademic(true);
                }

                if (!data?.parentDetails?.guardianName)
                    toast.error("Please complete Parent Details");

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

    // ── Save Academic Details ──
    const handleSaveAcademic = async (e) => {
        e.preventDefault();
        if (isSubmittingAcademic) return;
        setIsSubmittingAcademic(true);
        const tid = toast.loading("Saving...");
        try {
            await API.put('/users/profile/update', { studentDetails: academicData });
            setUser(prev => ({
                ...prev,
                studentDetails: { ...(prev?.studentDetails || {}), ...academicData }
            }));
            setIsEditingAcademic(false);
            toast.success("Academic details saved!", { id: tid });
        } catch {
            toast.error("Save failed", { id: tid });
        } finally {
            setIsSubmittingAcademic(false);
        }
    };

    // ── Save Parent Details ──
    const handleSave = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const tid = toast.loading("Saving...");
        try {
            await API.put('/users/profile/update', { parentDetails: formData });
            setUser(prev => ({ ...prev, parentDetails: formData }));
            setIsEditing(false);
            toast.success("Parent details saved!", { id: tid });
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

    const cancelAcademicEdit = () => {
        if (user?.studentDetails) {
            setAcademicData({
                rollNumber:  user.studentDetails.rollNumber  || '',
                department:  user.studentDetails.department  || '',
                phone:       user.studentDetails.phone       || '',
                course:      user.studentDetails.course      || '',
                batch:       user.studentDetails.batch       || '',
                currentYear: user.studentDetails.currentYear?.toString() || '',
            });
        }
        setIsEditingAcademic(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fffaf5]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-slate-400">Loading profile...</p>
            </div>
        </div>
    );

    // ── Shared input style — same as Register ──
    const inputCls = "w-full border border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300/40 bg-white transition-all";
    const viewCls  = "w-full bg-orange-50/50 border border-orange-100 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-[42px]";

    return (
        <div className="bg-[#fffaf5] min-h-screen text-slate-800">
            <Toaster position="top-center" />

            <main className="max-w-5xl mx-auto px-4 py-10">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden">

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
                                <p className="text-slate-400 text-sm">
                                    {user?.allocatedRoom ? `Room ${user.allocatedRoom.roomNumber}` : 'No Room Allocated'} · {user?.studentDetails?.department || ''}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">

                            {/* ══════════════════════════════
                                ACADEMIC DETAILS — EDITABLE
                            ══════════════════════════════ */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-black text-sm uppercase tracking-widest text-orange-500">Academic Details</h2>
                                    <AnimatePresence mode="wait">
                                        {!isEditingAcademic ? (
                                            <motion.button key="edit-ac"
                                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                type="button" onClick={() => setIsEditingAcademic(true)}
                                                className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 transition-all">
                                                <Pencil size={13} /> Edit
                                            </motion.button>
                                        ) : (
                                            <motion.div key="actions-ac"
                                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex gap-2">
                                                <button type="button" onClick={cancelAcademicEdit}
                                                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
                                                    <X size={13} /> Cancel
                                                </button>
                                                <button type="submit" form="academicForm" disabled={isSubmittingAcademic}
                                                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-md shadow-orange-100">
                                                    <Check size={13} /> {isSubmittingAcademic ? 'Saving...' : 'Save'}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <form id="academicForm" onSubmit={handleSaveAcademic}>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                                        {/* Roll Number */}
                                        <div>
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Roll Number</label>
                                            {isEditingAcademic
                                                ? <input value={academicData.rollNumber} onChange={e => setAcademicData({ ...academicData, rollNumber: e.target.value })} placeholder="Enter Roll Number" className={inputCls} />
                                                : <div className={viewCls}>{academicData.rollNumber || <span className="text-slate-300">—</span>}</div>}
                                        </div>

                                        {/* Department — dropdown like register */}
                                        <div>
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Department</label>
                                            {isEditingAcademic
                                                ? <select value={academicData.department} onChange={e => setAcademicData({ ...academicData, department: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
                                                    <option value="">Select Department</option>
                                                    <option value="Computer Engineering">Computer Science</option>
                                                    <option value="Electrical Engineering">Electrical Eng.</option>
                                                    <option value="Mechanical Engineering">Mechanical Eng.</option>
                                                    <option value="Civil Engineering">Civil Eng.</option>
                                                  </select>
                                                : <div className={viewCls}>{academicData.department || <span className="text-slate-300">—</span>}</div>}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Phone</label>
                                            {isEditingAcademic
                                                ? <input value={academicData.phone} onChange={e => setAcademicData({ ...academicData, phone: e.target.value })} placeholder="Enter Phone Number" className={inputCls} />
                                                : <div className={viewCls}>{academicData.phone || <span className="text-slate-300">—</span>}</div>}
                                        </div>

                                        {/* Course */}
                                        <div>
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Course</label>
                                            {isEditingAcademic
                                                ? <input value={academicData.course} onChange={e => setAcademicData({ ...academicData, course: e.target.value })} placeholder="e.g. B.Tech" className={inputCls} />
                                                : <div className={viewCls}>{academicData.course || <span className="text-slate-300">—</span>}</div>}
                                        </div>

                                        {/* Batch */}
                                        <div>
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Batch</label>
                                            {isEditingAcademic
                                                ? <input value={academicData.batch} onChange={e => setAcademicData({ ...academicData, batch: e.target.value })} placeholder="e.g. 2022-26" className={inputCls} />
                                                : <div className={viewCls}>{academicData.batch || <span className="text-slate-300">—</span>}</div>}
                                        </div>

                                        {/* Current Year — dropdown like register */}
                                        <div>
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Current Year</label>
                                            {isEditingAcademic
                                                ? <select value={academicData.currentYear} onChange={e => setAcademicData({ ...academicData, currentYear: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
                                                    <option value="">Select Year</option>
                                                    <option value="1">1st Year</option>
                                                    <option value="2">2nd Year</option>
                                                    <option value="3">3rd Year</option>
                                                    <option value="4">4th Year</option>
                                                  </select>
                                                : <div className={viewCls}>{academicData.currentYear ? `${academicData.currentYear}${['st','nd','rd','th'][academicData.currentYear - 1] || 'th'} Year` : <span className="text-slate-300">—</span>}</div>}
                                        </div>

                                        {/* Email — always read only */}
                                        <div>
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Email</label>
                                            <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 min-h-[42px]">
                                                {user?.email || '—'}
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </div>

                            {/* ══════════════════════════════
                                PARENT DETAILS
                            ══════════════════════════════ */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-black text-sm uppercase tracking-widest text-orange-500">Parent Details</h2>
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
                                            { label: 'Guardian Name',  key: 'guardianName'    },
                                            { label: 'Relationship',   key: 'relation'        },
                                            { label: 'Contact Number', key: 'guardianContact' },
                                            { label: 'Alt Contact',    key: 'altContact'      },
                                            { label: 'Address',        key: 'address'         },
                                        ].map(({ label, key }) => (
                                            <motion.div key={key} animate={{ opacity: 1 }}
                                                className={key === 'address' ? 'sm:col-span-2' : ''}>
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">{label}</label>
                                                <AnimatePresence mode="wait">
                                                    {isEditing ? (
                                                        <motion.input key="input"
                                                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                                                            transition={{ duration: 0.15 }}
                                                            value={formData[key]}
                                                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                            placeholder={`Enter ${label}`}
                                                            className={inputCls}
                                                        />
                                                    ) : (
                                                        <motion.div key="value"
                                                            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                                                            transition={{ duration: 0.15 }}
                                                            className={viewCls}>
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

export default StudentProfile;
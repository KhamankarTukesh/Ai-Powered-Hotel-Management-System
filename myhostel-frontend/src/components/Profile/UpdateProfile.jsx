import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, BookOpen, MapPin, Upload, Save, Loader2 } from 'lucide-react';
import API from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        department: '',
        course: '',
        batch: '',
        guardianName: '',
        guardianContact: '',
        relation: '',
        address: ''
    });
    const [image, setImage] = useState(null);

    // Profile data fetch karne ke liye (Initial Load)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/auth/me'); // Ek 'me' route hona chahiye profile dikhane ke liye
                setFormData({
                    fullName: data.fullName || '',
                    phone: data.studentDetails?.phone || '',
                    department: data.studentDetails?.department || '',
                    course: data.studentDetails?.course || '',
                    batch: data.studentDetails?.batch || '',
                    guardianName: data.parentDetails?.guardianName || '',
                    guardianContact: data.parentDetails?.guardianContact || '',
                    relation: data.parentDetails?.relation || '',
                    address: data.parentDetails?.address || ''
                });
            } catch (err) {
                toast.error("Failed to load profile data");
                Navigate('/login');
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('phone', formData.phone);
        data.append('department', formData.department);
        data.append('course', formData.course);
        data.append('batch', formData.batch);

        // Parent details nested object backend handle kar raha hai
        data.append('parentDetails[guardianName]', formData.guardianName);
        data.append('parentDetails[guardianContact]', formData.guardianContact);
        data.append('parentDetails[address]', formData.address);
        data.append('parentDetails[relation]', formData.relation);

        if (image) {
            data.append('idCardImage', image); // Backend expects 'idCardImage'
        }

        try {
            const res = await API.put('/auth/update-profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Profile Updated Successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
            <Toaster position="top-right" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-slate-900 p-8 text-white">
                    <h2 className="text-3xl font-black tracking-tight italic">Edit Profile.</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Update your personal & hostel records</p>
                </div>

                <form onSubmit={handleUpdate} className="p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Section: Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 border-b pb-2">Personal Information</h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:border-indigo-600/20 outline-none transition-all"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:border-indigo-600/20 outline-none transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Academic Info */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 border-b pb-2">Academic Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Course</label>
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-bold text-slate-700 outline-none"
                                    value={formData.course}
                                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Batch</label>
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-bold text-slate-700 outline-none"
                                    value={formData.batch}
                                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: ID Upload */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 border-b pb-2">Documents (ID Card)</h3>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                        {image ? image.name : "Click to upload New ID Card Image"}
                                    </p>
                                </div>
                                <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                            </label>
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-6 mt-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 border-b pb-2">
                            Emergency / Parent Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Guardian Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Guardian Name</label>
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-rose-200 transition-all"
                                    value={formData.guardianName}
                                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                                    placeholder="Father/Mother Name"
                                />
                            </div>

                            {/* Guardian Contact */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Guardian Phone</label>
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-rose-200 transition-all"
                                    value={formData.guardianContact}
                                    onChange={(e) => setFormData({ ...formData, guardianContact: e.target.value })}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            {/* Relation */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Relation</label>
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-rose-200 transition-all"
                                    value={formData.relation}
                                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                                    placeholder="e.g. Father"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Home Address</label>
                                <textarea
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-rose-200 transition-all min-h-[100px]"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Full Permanent Address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdateProfile;
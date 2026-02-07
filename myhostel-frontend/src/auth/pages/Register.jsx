import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Lock, Phone, Hash, BookOpen,
    Calendar, GraduationCap, Camera, ArrowRight, Layers, BadgeCheck, School, UploadCloud
} from 'lucide-react';
import { register } from '../services/auth.services.js';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '',
        rollNumber: '', department: '', phone: '',
        course: '', batch: '', currentYear: '',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });



const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start Loading
    const data = new FormData();

    // Direct fields
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('password', formData.password);
    
    // Nested fields (consistent with your controller)
    data.append('studentDetails[rollNumber]', formData.rollNumber);
    data.append('studentDetails[department]', formData.department);
    data.append('studentDetails[phone]', formData.phone);
    data.append('studentDetails[course]', formData.course);
    data.append('studentDetails[batch]', formData.batch);
    data.append('studentDetails[currentYear]', formData.currentYear);

    if (image) data.append('idCardImage', image);

    try {
        await register(data);
        toast.success('Registration Successful! Check your email for OTP.');
        navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
        // Clearer error handling
        const errorMsg = err.response?.data?.message || 'Registration Failed. Please try again.';
        toast.error(errorMsg);
    } finally {
        setLoading(false); // Stop Loading
    }
};

    return (
        <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-6 font-['Inter']">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-xl shadow-[#00000008] rounded-[2rem] w-full max-w-5xl p-8 md:p-12 border border-[#f0f0f0]"
            >
                <div className="text-center md:text-left mb-10">
                    <h1 className="text-4xl font-black text-[#181411] tracking-tight">Student Registration</h1>
                    <p className="text-[#8c725f] mt-2">Join the HostelHub community by filling out the details below.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-10">
                    {/* Section 1: Personal Information */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-[#181411] flex items-center gap-2">
                            <User className="text-[#f97415]" size={20} /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]/70" size={18} />
                                <input type="text" name="fullName" placeholder="Full Name" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#ffedd5] bg-white focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] outline-none transition-all placeholder:text-[#8c725f]/50" onChange={handleChange} required />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]/70" size={18} />
                                <input type="email" name="email" placeholder="Email Address" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#ffedd5] bg-white focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] outline-none transition-all placeholder:text-[#8c725f]/50" onChange={handleChange} required />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]/70" size={18} />
                                <input type="password" name="password" placeholder="Password" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#ffedd5] bg-white focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] outline-none transition-all placeholder:text-[#8c725f]/50" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#f5f2f0]"></div>

                    {/* Section 2: Academic Details */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-[#181411] flex items-center gap-2">
                            <School className="text-[#f97415]" size={20} /> Contact & Academic Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]/70" size={18} />
                                <input type="text" name="rollNumber" placeholder="Roll Number" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#ffedd5] bg-white focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] outline-none transition-all placeholder:text-[#8c725f]/50" onChange={handleChange} required />
                            </div>
                            <div className="relative">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]/70" size={18} />
                                <input type="text" name="course" placeholder="Course (e.g. B.Tech)" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#ffedd5] bg-white focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] outline-none transition-all placeholder:text-[#8c725f]/50" onChange={handleChange} required />
                            </div>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]/70" size={18} />
                                <select name="department" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#ffedd5] bg-white focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] outline-none transition-all appearance-none cursor-pointer text-[#181411]" onChange={handleChange} required>
                                    <option value="">Select Department</option>
                                    <option value="Computer Engineering">Computer Science</option>
                                    <option value="Electrical Engineering">Electrical Eng.</option>
                                    <option value="Mechanical Engineering">Mechanical Eng.</option>
                                    <option value="Civil Engineering">Civil Eng.</option>
                                </select>
                            </div>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]/70" size={18} />
                                <input type="text" name="batch" placeholder="Batch (e.g. 2022-26)" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#ffedd5] bg-white focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] outline-none transition-all placeholder:text-[#8c725f]/50" onChange={handleChange} required />
                            </div>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]/70" size={18} />
                                <select
                                    name="currentYear"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#ffedd5] bg-white focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] outline-none transition-all text-[#8c725f] appearance-none cursor-pointer"
                                    onChange={handleChange}
                                    required
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Current Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                                {/* Dropdown arrow icon */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#f97415]/70">
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                </div>
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]/70" size={18} />
                                <input type="text" name="phone" placeholder="Phone Number" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#ffedd5] bg-white focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] outline-none transition-all placeholder:text-[#8c725f]/50" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#f5f2f0]"></div>

                    {/* Section 3: Identity Verification */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-[#181411] flex items-center gap-2">
                            <UploadCloud className="text-[#f97415]" size={20} /> Identity Verification
                        </h3>
                        <div className="w-full h-44 border-2 border-dashed border-[#f97415]/30 rounded-2xl bg-[#fff7ed] hover:bg-[#ffedd5]/40 transition-all cursor-pointer group flex flex-col items-center justify-center">
                            <input type="file" id="id" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                            <label htmlFor="id" className="cursor-pointer flex flex-col items-center">
                                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-all duration-300">
                                    <Camera className="w-6 h-6 text-[#f97415]" />
                                </div>
                                <p className="text-sm font-semibold text-[#181411]">
                                    <span className="text-[#f97415]">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-[#8c725f] mt-1">
                                    {image ? image.name : "Student ID Card or Aadhar Card (PDF, JPG, PNG)"}
                                </p>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-5 pt-4">
                   <button 
    type="submit" 
    disabled={loading}
    className={`w-full max-w-[400px] h-14 rounded-full text-lg font-bold flex items-center justify-center gap-2 transition-all ${loading ? 'bg-slate-400' : 'bg-[#f97415] hover:bg-[#ea580c] shadow-lg shadow-orange-100'}`}
>
    {loading ? 'Processing...' : (
        <>Create Account <ArrowRight size={20} /></>
    )}
</button>

                        <p className="text-[#8c725f] text-sm">
                            Already have an account? <Link to="/login" className="text-[#f97415] font-bold hover:underline">Login here</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
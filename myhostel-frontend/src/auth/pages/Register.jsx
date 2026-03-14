import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Lock, Phone, Hash, BookOpen,
    Calendar, GraduationCap, Camera, ArrowRight,
    Layers, School, UploadCloud, Loader2, CheckCircle2
} from 'lucide-react';
import { register } from '../services/auth.services.js';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import API from '../../api/axios';

const inputBase =
    "w-full pl-11 pr-4 py-3 rounded-xl border border-orange-100 bg-white/80 focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 outline-none transition-all text-slate-800 placeholder:text-slate-400 text-sm font-medium";

const InputField = ({ icon: Icon, children }) => (
    <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" size={16} />
        {children}
    </div>
);

const SectionHeading = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-50">
            <Icon size={13} className="text-orange-500" />
        </div>
        <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.18em]">{label}</span>
        <div className="flex-1 h-px bg-orange-100 ml-1" />
    </div>
);

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [gLoading, setGLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '',
        rollNumber: '', department: '', phone: '',
        course: '', batch: '', currentYear: '',
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();

        data.append('fullName', formData.fullName);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('studentDetails[rollNumber]', formData.rollNumber);
        data.append('studentDetails[department]', formData.department);
        data.append('studentDetails[phone]', formData.phone);
        data.append('studentDetails[course]', formData.course);
        data.append('studentDetails[batch]', formData.batch);
        data.append('studentDetails[currentYear]', formData.currentYear);
        if (image) data.append('idCardImage', image);

        try {
            await register(data);
            toast.success('Registration successful! Check your email for OTP.');
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Google Register
    const handleGoogleRegister = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGLoading(true);
            const gToast = toast.loading('Signing up with Google...');
            try {
                const { data: googleUser } = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );

                const res = await API.post('/auth/google', {
                    email: googleUser.email,
                    name: googleUser.name,
                });

                localStorage.clear();
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('role', res.data.user.role.toLowerCase());

                toast.success(`Welcome, ${googleUser.name.split(' ')[0]}! 🎉`, { id: gToast });

                // ⚠️ Remind to complete profile
                setTimeout(() => {
                    toast('📝 Please complete your profile — add roll number, department & guardian details.', {
                        duration: 5000, icon: '⚠️',
                    });
                }, 1500);

                navigate('/student/dashboard', { replace: true });

            } catch (err) {
                toast.error(err.response?.data?.message || 'Google Signup Failed', { id: gToast });
            } finally {
                setGLoading(false);
            }
        },
        onError: () => toast.error('Google Signup Failed'),
    });

    return (
        <div className="min-h-screen w-full bg-[#fdf9f6] flex flex-col items-center justify-start md:justify-center px-4 py-8 md:py-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&display=swap');`}</style>

            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                <div className="absolute -top-40 -right-40 w-[480px] h-[480px] bg-orange-100/50 rounded-full blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[100px]" />
            </div>

            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-xl">

                {/* Brand Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-200 mb-3">
                        <School size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-[1.75rem] font-black text-slate-800 tracking-tight text-center leading-tight">
                        Create Your Account
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 text-center">
                        Join <span className="text-orange-500 font-bold">Dnyanda Hostel</span>
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/90 backdrop-blur-sm border border-orange-100 rounded-3xl shadow-xl shadow-orange-50/60 p-5 sm:p-7">

                    {/* ✅ Google Button — form ke upar */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => handleGoogleRegister()}
                            disabled={gLoading}
                            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-sm text-slate-700 shadow-sm active:scale-95 disabled:opacity-60"
                        >
                            {gLoading
                                ? <Loader2 className="animate-spin text-orange-500" size={18} />
                                : <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                            }
                            {gLoading ? 'Creating account...' : 'Continue with Google'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex-1 h-px bg-orange-100" />
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">or register manually</span>
                            <div className="flex-1 h-px bg-orange-100" />
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">

                        {/* ── Personal Info ── */}
                        <div>
                            <SectionHeading icon={User} label="Personal Information" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="sm:col-span-2">
                                    <InputField icon={User}>
                                        <input type="text" name="fullName" placeholder="Full Name"
                                            className={inputBase} onChange={handleChange} required />
                                    </InputField>
                                </div>
                                <InputField icon={Mail}>
                                    <input type="email" name="email" placeholder="Email Address"
                                        className={inputBase} onChange={handleChange} required />
                                </InputField>
                                <InputField icon={Lock}>
                                    <input type="password" name="password" placeholder="Password"
                                        className={inputBase} onChange={handleChange} required />
                                </InputField>
                            </div>
                        </div>

                        <div className="border-t border-orange-50" />

                        {/* ── Academic & Contact ── */}
                        <div>
                            <SectionHeading icon={BookOpen} label="Academic & Contact" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InputField icon={Hash}>
                                    <input type="text" name="rollNumber" placeholder="Roll Number"
                                        className={inputBase} onChange={handleChange} required />
                                </InputField>
                                <InputField icon={Layers}>
                                    <input type="text" name="course" placeholder="Course (e.g. B.Tech)"
                                        className={inputBase} onChange={handleChange} required />
                                </InputField>
                                <InputField icon={BookOpen}>
                                    <select name="department" className={inputBase + " appearance-none cursor-pointer"}
                                        onChange={handleChange} required>
                                        <option value="">Select Department</option>
                                        <option value="Computer Engineering">Computer Science</option>
                                        <option value="Electrical Engineering">Electrical Eng.</option>
                                        <option value="Mechanical Engineering">Mechanical Eng.</option>
                                        <option value="Civil Engineering">Civil Eng.</option>
                                    </select>
                                </InputField>
                                <InputField icon={Calendar}>
                                    <input type="text" name="batch" placeholder="Batch (e.g. 2022-26)"
                                        className={inputBase} onChange={handleChange} required />
                                </InputField>
                                <InputField icon={GraduationCap}>
                                    <select name="currentYear" className={inputBase + " appearance-none cursor-pointer"}
                                        onChange={handleChange} required defaultValue="">
                                        <option value="" disabled>Current Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </InputField>
                                <InputField icon={Phone}>
                                    <input type="text" name="phone" placeholder="Phone Number"
                                        className={inputBase} onChange={handleChange} required />
                                </InputField>
                            </div>
                        </div>

                        <div className="border-t border-orange-50" />

                        {/* ── ID Upload ── */}
                        <div>
                            <SectionHeading icon={UploadCloud} label="Identity Verification" />
                            <label htmlFor="idUpload"
                                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer group">
                                <input type="file" id="idUpload" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setImage(e.target.files[0])} />
                                <div className="shrink-0 w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                                    {image ? <CheckCircle2 size={18} className="text-green-500" /> : <Camera size={18} className="text-orange-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 truncate">
                                        {image ? image.name : 'Upload Student ID / Aadhar Card'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        {image ? 'File selected ✓' : 'PDF, JPG or PNG · Max 5MB'}
                                    </p>
                                </div>
                                {!image && (
                                    <span className="shrink-0 text-[11px] font-bold text-orange-500 border border-orange-200 bg-white rounded-lg px-3 py-1.5 group-hover:bg-orange-500 group-hover:text-white transition-all whitespace-nowrap">
                                        Browse
                                    </span>
                                )}
                            </label>
                        </div>

                        {/* ── Submit ── */}
                        <div className="space-y-3 pt-1">
                            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                                className="w-full py-3.5 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-200 active:scale-95">
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin" /> Creating Account...
                                        </motion.span>
                                    ) : (
                                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            Create Account <ArrowRight size={16} />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            <p className="text-center text-xs text-slate-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-orange-500 font-bold hover:underline">Sign in here</Link>
                            </p>
                        </div>

                    </form>
                </div>

                <p className="text-center text-[11px] text-slate-300 mt-4">
                    By registering, you agree to Dnyanda Hostel terms of use.
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
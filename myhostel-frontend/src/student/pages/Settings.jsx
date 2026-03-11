import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Phone, KeyRound, MailCheck, Trash2, FileText } from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const user  = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user?.email;

    const handleResetRequest = async () => {
        try {
            if (!email) return toast.error("Please login again!");
            setLoading(true);
            const res = await API.post('/auth/forgot-password', { email });
            if (res.status === 200) {
                toast.success("OTP sent! Redirecting...");
                setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally { setLoading(false); }
    };

    const handleVerifyRequest = async () => {
        try {
            setLoading(true);
            const res = await API.post('/auth/resend-otp', { email });
            if (res.status === 200) {
                toast.success("Verification OTP sent!");
                navigate('/verify-account', { state: { email } });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Verification failed");
        } finally { setLoading(false); }
    };

    // ✅ No delete route — sends warden notification only
    const handleDeleteRequest = async () => {
        if (!window.confirm("This will send a deletion request to the warden. Continue?")) return;
        try {
            await API.post('/notifications/admin-request', {
                type: 'DELETE_ACCOUNT',
                message: `${user?.fullName || 'Student'} (${email}) has requested account deletion.`
            });
            toast.success("Request sent to warden.");
        } catch {
            toast.error("Failed. Please contact warden directly.");
        }
    };

    return (
        <div className="min-h-screen bg-[#fdf9f6] px-4 sm:px-6 pb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');`}</style>

            <div className="max-w-3xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-md shadow-orange-200">
                        <ShieldCheck size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 leading-none">Settings</h1>
                        <p className="text-xs text-slate-400 font-medium">Account & preferences</p>
                    </div>
                </div>

                {/* Top Cards */}
                <div className="grid sm:grid-cols-2 gap-4">

                    {/* Policy */}
                    <div className="bg-white rounded-3xl border border-orange-100 p-6 flex flex-col justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Hostel Policy</p>
                            <p className="text-sm text-slate-500">Download the latest rules & regulations PDF.</p>
                        </div>
                        <a href="/hostel-details.pdf"
                            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 transition-all shadow-md shadow-orange-100">
                            <FileText size={15} /> View Hostel Details
                        </a>
                    </div>

                    {/* Support */}
                    <div className="bg-white rounded-3xl border border-orange-100 p-6 flex flex-col justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Warden Support</p>
                            <p className="text-sm text-slate-500 mb-3">Direct contact for emergencies.</p>
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-3 py-1.5 rounded-xl border border-green-100">
                                <Phone size={13} />
                                <span className="text-xs font-black">+91 98765 43210</span>
                            </div>
                        </div>
                        <a href="tel:+919876543210"
                            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500 text-white font-black text-sm hover:bg-green-600 transition-all shadow-md shadow-green-100">
                            <Phone size={15} /> Contact Warden
                        </a>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-3xl border border-orange-100 p-6">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Security & Authentication</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <button onClick={handleResetRequest} disabled={loading}
                            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 font-black text-sm hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50">
                            <KeyRound size={15} /> {loading ? "Sending OTP..." : "Change Password"}
                        </button>
                        <button onClick={handleVerifyRequest} disabled={loading}
                            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 font-black text-sm hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50">
                            <MailCheck size={15} /> Verify Email
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50/40 rounded-3xl border border-red-100 p-6">
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4">Danger Zone</p>
                    <div className="bg-white rounded-2xl border border-red-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold text-slate-700">Request Account Deletion</p>
                            <p className="text-xs text-slate-400 mt-0.5">Sends a request to warden — account is not deleted immediately.</p>
                        </div>
                        <button onClick={handleDeleteRequest}
                            className="shrink-0 flex items-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 font-black text-sm rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 size={15} /> Delete Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // LocalStorage se user data nikalna
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email;

    // 1. Password Reset Request (Redirects to ResetPassword Page)
    const handleResetRequest = async () => {
        try {
            if (!email) return toast.error("Please login again!");
            setLoading(true);
            
            // Step 1: Backend OTP bhejega
            const response = await API.post('/auth/forgot-password', { email });
            
            if (response.status === 200) {
                toast.success("OTP sent! Redirecting...");
                // Step 2: Dedicated page par bhejo, email state mein pass karke
                setTimeout(() => {
                    navigate('/reset-password', { state: { email } });
                }, 1500);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset request failed");
        } finally {
            setLoading(false);
        }
    };

    // 2. Account Verification Request (Redirects to Verify Page)
    const handleVerifyRequest = async () => {
        try {
            setLoading(true);
            const response = await API.post('/auth/resend-otp', { email });
            
            if (response.status === 200) {
                toast.success("Verification OTP sent!");
                // Agar aapke paas VerifyAccount.jsx hai toh wahan redirect karo
                navigate('/verify-account', { state: { email } });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // 3. Delete Account Request (Admin Notification)
    const handleDeleteRequest = async () => {
        const confirmDelete = window.confirm("Are you sure you want to request account deletion? This will alert the warden.");
        
        if (!confirmDelete) return;

        try {
            await API.post('/notifications/admin-request', {
                type: 'DELETE_ACCOUNT',
                message: `${user?.fullName || 'Student'} (${email}) has requested account deletion.`
            });
            toast.success("Deletion request sent to Admin.");
        } catch (err) {
            toast.error("Request failed. Please contact the warden directly.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 px-4 pb-10 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-4 px-2">
                    <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <span className="material-symbols-outlined text-white text-3xl">settings</span>
                    </div>
                    <h1 className="text-3xl font-[1000] text-slate-800 tracking-tight">SETTINGS</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hostel Rules Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Hostel Policy</h2>
                            <p className="text-xs text-slate-500">Download the latest rules & regulations PDF.</p>
                        </div>
                        <a href="/hostel-details.pdf" className="flex items-center justify-center gap-3 p-4 rounded-3xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all">
                             SEE HOSTEL DETAILS
                        </a>
                    </div>

                    {/* Support Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Warden Support</h2>
                            <p className="text-xs text-slate-500 mb-3">Direct contact for emergencies.</p>
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-4 py-2 rounded-2xl border border-green-100">
                                <span className="material-symbols-outlined text-sm">call</span>
                                <span className="text-sm font-[1000] tracking-wider">+91 98765 43210</span>
                            </div>
                        </div>
                        <a href="tel:+919876543210" className="flex items-center justify-center gap-3 p-4 rounded-3xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100">
                            CONTACT WARDEN
                        </a>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Security & Authentication</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            onClick={handleResetRequest} 
                            disabled={loading}
                            className="p-5 bg-orange-50 border border-orange-100 rounded-[2rem] text-orange-700 font-[1000] hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50"
                        >
                            {loading ? "SENDING OTP..." : "CHANGE PASSWORD"}
                        </button>
                        <button 
                            onClick={handleVerifyRequest}
                            className="p-5 bg-indigo-50 border border-indigo-100 rounded-[2rem] text-indigo-700 font-[1000] hover:bg-indigo-600 hover:text-white transition-all"
                        >
                            VERIFY EMAIL
                        </button>
                    </div>
                </div>

                {/* Account Actions (Danger Zone) */}
                <div className="bg-red-50/40 rounded-[2.5rem] p-8 border border-red-100">
                    <h2 className="text-lg font-bold text-red-800 mb-4 tracking-tight">DANGER ZONE</h2>
                    <div className="bg-white p-6 rounded-[2rem] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500 font-medium">Request the warden to permanently remove your hostel account.</p>
                        <button 
                            onClick={handleDeleteRequest}
                            className="w-full md:w-auto px-8 py-4 border-2 border-red-600 text-red-600 font-[1000] rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                        >
                            DELETE ACCOUNT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
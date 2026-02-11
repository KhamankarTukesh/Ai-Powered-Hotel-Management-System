import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email;

    const handleResetRequest = async () => {
        try {
            if (!email) return toast.error("Please login again!");
            setLoading(true);

            const response = await API.post('/auth/forgot-password', { email });

            if (response.status === 200) {
                toast.success("OTP sent! Redirecting...");
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

    const handleVerifyRequest = async () => {
        try {
            setLoading(true);

            const response = await API.post('/auth/resend-otp', { email });

            if (response.status === 200) {
                toast.success("Verification OTP sent!");
                navigate('/verify-account', { state: { email } });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to request account deletion? This will alert the warden."
        );

        if (!confirmDelete) return;

        try {
            await API.post('/notifications/admin-request', {
                type: 'DELETE_ACCOUNT',
                message: `${user?.fullName || 'Student'} (${email}) has requested account deletion.`
            });

            toast.success("Deletion request sent to Admin.");
        } catch {
            toast.error("Request failed. Please contact the warden directly.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 px-4 sm:px-6 pb-10 font-sans">

            <div className="max-w-5xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex items-center gap-3 sm:gap-4 px-1 sm:px-2">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <span className="material-symbols-outlined text-white text-2xl sm:text-3xl">
                            settings
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                        SETTINGS
                    </h1>
                </div>

                {/* TOP CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* POLICY CARD */}
                    <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">

                        <div className="mb-6">
                            <h2 className="text-base sm:text-lg font-bold text-slate-800">
                                Hostel Policy
                            </h2>

                            <p className="text-xs text-slate-500">
                                Download the latest rules & regulations PDF.
                            </p>
                        </div>

                        <a
                            href="/hostel-details.pdf"
                            className="flex items-center justify-center gap-3 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
                        >
                            SEE HOSTEL DETAILS
                        </a>

                    </div>

                    {/* SUPPORT CARD */}
                    <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">

                        <div className="mb-6">
                            <h2 className="text-base sm:text-lg font-bold text-slate-800">
                                Warden Support
                            </h2>

                            <p className="text-xs text-slate-500 mb-3">
                                Direct contact for emergencies.
                            </p>

                            <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border border-green-100">
                                <span className="material-symbols-outlined text-sm">
                                    call
                                </span>

                                <span className="text-sm font-black tracking-wider">
                                    +91 98765 43210
                                </span>
                            </div>
                        </div>

                        <a
                            href="tel:+919876543210"
                            className="flex items-center justify-center gap-3 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100"
                        >
                            CONTACT WARDEN
                        </a>

                    </div>
                </div>

                {/* SECURITY SECTION */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm">

                    <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-6">
                        Security & Authentication
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <button
                            onClick={handleResetRequest}
                            disabled={loading}
                            className="p-4 sm:p-5 bg-orange-50 border border-orange-100 rounded-2xl sm:rounded-[2rem] text-orange-700 font-black hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50"
                        >
                            {loading ? "SENDING OTP..." : "CHANGE PASSWORD"}
                        </button>

                        <button
                            onClick={handleVerifyRequest}
                            className="p-4 sm:p-5 bg-indigo-50 border border-indigo-100 rounded-2xl sm:rounded-[2rem] text-indigo-700 font-black hover:bg-indigo-600 hover:text-white transition-all"
                        >
                            VERIFY EMAIL
                        </button>

                    </div>
                </div>

                {/* DANGER ZONE */}
                <div className="bg-red-50/40 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-red-100">

                    <h2 className="text-base sm:text-lg font-bold text-red-800 mb-4">
                        DANGER ZONE
                    </h2>

                    <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4">

                        <p className="text-xs text-slate-500 font-medium text-center md:text-left">
                            Request the warden to permanently remove your hostel account.
                        </p>

                        <button
                            onClick={handleDeleteRequest}
                            className="w-full md:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-red-600 text-red-600 font-black rounded-xl sm:rounded-2xl hover:bg-red-600 hover:text-white transition-all"
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

import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

const GatePassManager = () => {
    const [formData, setFormData] = useState({
        destination: '',
        reason: '',
        expectedInTime: ''
    });

    const [activePass, setActivePass] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Real-time clock to trigger UI changes for late status
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const checkActivePass = async () => {
        try {
            const { data } = await API.get('/gatepass/active');
            if (data.active) {
                setActivePass(data.pass);
            } else {
                setActivePass(null); // Row reset ho jayegi
            }
        } catch (error) {
            console.error("Session Sync Error");
        }
    };
    useEffect(() => {
        checkActivePass();
    }, []);
    const handleApply = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await API.post('/gatepass/apply', formData);

            // --- 🧪 TESTING LOGS ---
            console.log("----------------------------");
            console.log("🚀 PASS APPLIED SUCCESSFULLY");
            console.log("🆔 PASS ID:", data.newPass._id);
            console.log("⏳ EXPECTED RETURN:", data.newPass.expectedInTime);
            console.log("----------------------------");

            toast.success(`Pass Requested! ID: ${data.newPass._id.slice(-6)}`);

            setFormData({ destination: '', reason: '', expectedInTime: '' });
            checkActivePass();
        } catch (error) {
            console.error("❌ Error applying pass:", error);
            toast.error(error.response?.data?.error || "Failed");
        } finally {
            setLoading(false);
        }
    };
    const handleMovement = async (type) => {
        if (!activePass) return;
        try {
            setLoading(true);
            const { data } = await API.patch(`/gatepass/movement/${activePass._id}`, { type });

            if (type === 'in') {
                toast.success("Welcome back! Data cleared.");
                setActivePass(null); // Pure reset
            } else {
                toast.success("Departure Marked!");
                checkActivePass(); // Sync status 'Out'
            }
        } catch (error) {
            toast.error("Movement failed");
        } finally {
            setLoading(false);
        }
    };
    // Helper: Check if late
    const isLate = activePass?.status === 'Out' && currentTime > new Date(activePass.expectedInTime);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: FORM */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6a00] to-[#ff9d5c]"></div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-[#ff6a00]">add_circle</span>
                                New Pass Request
                            </h3>
                            <form onSubmit={handleApply} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Destination</label>
                                    <input
                                        type="text" required placeholder="e.g. City Mall"
                                        className="w-full p-3 rounded-xl bg-gray-50 border-none mt-1 outline-orange-500 text-sm"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Reason</label>
                                    <textarea
                                        rows="3" required placeholder="Detailed reason..."
                                        className="w-full p-3 rounded-xl bg-gray-50 border-none mt-1 outline-orange-500 text-sm resize-none"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expected Return Date & Time</label>
                                    <div className="relative mt-1">
                                        <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">calendar_month</span>
                                        <input
                                            type="datetime-local" // <--- Change this from "time" to "datetime-local"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-orange-500 text-sm font-medium"
                                            value={formData.expectedInTime}
                                            onChange={(e) => setFormData({ ...formData, expectedInTime: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 ml-1 font-medium">Please select the exact date and time of your return.</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || activePass}
                                    className={`w-full text-white font-bold py-4 rounded-xl shadow-lg mt-2 transition-all 
        ${activePass
                                            ? 'bg-gray-300 cursor-not-allowed opacity-70'
                                            : 'bg-[#ff6a00] hover:bg-orange-600 active:scale-[0.98]'
                                        }`}
                                >
                                    {activePass ? "Pass Already Active" : loading ? "Processing..." : "Request Gate Pass"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* RIGHT: TRACKER & TABLE */}
                <div className="lg:col-span-8 space-y-6">

                    {/* LATE WARNING */}
                    {activePass?.status === 'Out' && isLate && (
                        <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-600">warning</span>
                                <div>
                                    <p className="text-red-700 font-bold text-sm uppercase">Late Entry Warning</p>
                                    <p className="text-red-600 text-xs font-medium">You are overdue. Please return to hostel immediately!</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LIVE TRACKER CARD */}
                    {activePass ? (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="size-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="material-symbols-outlined text-white text-3xl">directions_walk</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">STATUS: {activePass.status.toUpperCase()}</h2>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">ID: #GP-{activePass._id?.slice(-5)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 bg-gray-50 rounded-2xl p-6 text-center">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Logged Out</p>
                                    <p className="text-2xl font-black text-gray-800">
                                        {activePass.outTime ? new Date(activePass.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-gray-300">arrow_forward</span>
                                <div className={`flex-1 rounded-2xl p-6 text-center border-2 ${isLate ? 'border-red-500 bg-red-50' : 'border-orange-100 bg-orange-50/30'}`}>
                                    <p className="text-[10px] font-bold text-orange-400 uppercase mb-1">Target In</p>
                                    <p className={`text-2xl font-black ${isLate ? 'text-red-600' : 'text-orange-500'}`}>
                                        {new Date(activePass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                {activePass.status === 'Approved' && (
                                    <button onClick={() => handleMovement('out')} className="w-full bg-black text-white py-4 rounded-xl font-bold">MARK DEPARTURE</button>
                                )}
                                {activePass.status === 'Out' && (
                                    <button onClick={() => handleMovement('in')} className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200">MARK ARRIVAL</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-20 text-center text-gray-400 font-medium">
                            No Active Movement Found
                        </div>
                    )}

                    {/* HISTORY TABLE (Current Pass Only) */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Destination</th>
                                    <th className="p-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activePass ? (
                                    <tr className={`text-sm border-t transition-colors ${isLate ? 'bg-red-50' : 'bg-white'}`}>
                                        <td className="p-4 font-bold">
                                            {new Date(activePass.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">{activePass.destination}</td>
                                        <td className="p-4 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${isLate ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-green-50 text-green-700'}`}>
                                                {isLate ? 'LATE WARNING' : activePass.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-10 text-center text-gray-300 italic font-medium">
                                            No active data. Your history is empty.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default GatePassManager;
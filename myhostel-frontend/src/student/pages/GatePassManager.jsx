import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const GatePassManager = () => {
    const [formData, setFormData] = useState({
        destination: '',
        reason: '',
        expectedInTime: ''
    });

    const [activePass, setActivePass] = useState(null);
const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(false);
const fetchPassHistory = async () => {
    try {
        const { data } = await axios.get('/api/gatepass/my-passes');
        console.log("Full API Response:", data);
        
        // 1. Array extract karein (Backend usually { passes: [] } ya direct [] bhejta hai)
        const allPasses = data.passes || (Array.isArray(data) ? data : []);
        setPasses(allPasses);

        // 2. IMPORTANT: Active pass filter karein (Jo abhi chal raha hai)
        // Hum wo pass dhoond rahe hain jo abhi tak 'Returned' ya 'Rejected' nahi hua
        const active = allPasses.find(p => p.status === 'Out' || p.status === 'Approved' || p.status === 'OUT');
        
        if (active) {
            setActivePass(active);
        } else {
            setActivePass(null);
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load pass history");
    }
};
const handleApply = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const { data } = await axios.post('/api/gatepass/apply', formData);
        toast.success(data.message);
        fetchPassHistory(); // <--- Ye line add karein
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed");
    } finally {
        setLoading(false);
    }
};
const handleMovement = async (type) => {
    try {
        setLoading(true);
        // Backend endpoint assumed: /api/gatepass/movement/:id
        const { data } = await axios.patch(`/api/gatepass/movement/${activePass._id}`, { type });
        toast.success(`Marked ${type} successfully!`);
        fetchPassHistory(); // Refresh data to update status
    } catch (error) {
        toast.error(error.response?.data?.error || "Movement failed");
    } finally {
        setLoading(false);
    }
};
    useEffect(() => {
    fetchPassHistory();
    const interval = setInterval(() => {
        // Sirf state update trigger karne ke liye taaki new Date() re-evaluate ho
        fetchPassHistory(); 
    }, 60000); // Har 1 min mein check karega
    return () => clearInterval(interval);
}, []);
    
    return (
        // Main Background: Light Greyish/Cream (#f8f7f5)
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#f8f7f5] font-sans">
            <div className="mx-auto max-w-6xl flex flex-col gap-8">
                
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-[#8d715e] font-medium">
                        <span>Dashboard</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-[#181410] font-semibold">Gate Pass Manager</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#181410]">Gate Pass Manager</h1>
                            <p className="text-[#8d715e] text-base">Request new passes and track your live movement history securely.</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold bg-green-100 text-green-800 px-4 py-2 rounded-full shadow-sm">
                            <span className="material-symbols-outlined text-base">verified_user</span>
                            <span>Identity Verified</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Request Form (Pure White Card) */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden relative">
                            {/* Orange Top Accent Line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6a00] to-[#ff9d5c]"></div>
                            
                            <div className="p-6 flex flex-col gap-6">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold text-[#181410] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#ff6a00]">add_circle</span>
                                        New Pass Request
                                    </h3>
                                    <p className="text-sm text-gray-500">Fill details to generate a digital gate pass.</p>
                                </div>

                                <form onSubmit={handleApply} className="flex flex-col gap-5">
                                    {/* Destination Input */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[#181410]">Destination</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 group-focus-within:text-[#ff6a00] transition-colors">location_on</span>
                                            <input 
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-[#fbfaf8] focus:ring-2 focus:ring-[#ff6a00]/10 focus:border-[#ff6a00] transition-all outline-none text-sm"
                                                placeholder="e.g. City Mall, Home"
                                                value={formData.destination}
                                                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Reason Select */}
<div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-[#181410]">Reason for Leaving</label>
    <div className="relative">
        {/* Icon ko top-3 par fix kiya taaki text ke sath match kare */}
        <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
            info
        </span>
        <textarea 
            rows="3"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-[#fbfaf8] focus:ring-2 focus:ring-[#ff6a00]/10 focus:border-[#ff6a00] transition-all outline-none text-sm resize-none"
            placeholder="Please provide a detailed reason..."
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            required
        ></textarea>
    </div>
</div>

                                    {/* Expected Time */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[#181410]">Expected In Time</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">schedule</span>
                                            <input 
                                                type="time"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-[#fbfaf8] focus:border-[#ff6a00] outline-none text-sm"
                                                value={formData.expectedInTime}
                                                onChange={(e) => setFormData({...formData, expectedInTime: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        disabled={loading}
                                        className="w-full bg-[#ff6a00] hover:bg-[#e65f00] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                                    >
                                        <span>{loading ? "Processing..." : "Request Gate Pass"}</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Live Tracker (White & Orange) */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#181410]">Live Movement Tracker</h3>
                            <button className="text-sm text-[#ff6a00] font-bold hover:underline">Refresh Status</button>
                        </div>
{/* Overdue Check - Logic updated for accuracy */}
{activePass && (activePass.status === 'Out' || activePass.status === 'OUT') && (
    <div className={`flex-1 bg-white border-2 p-5 rounded-2xl shadow-sm text-center relative overflow-hidden ${
        new Date() > new Date(activePass.expectedInTime) ? 'border-red-200' : 'border-[#ff6a00]/30'
    }`}>
        <div className="absolute top-0 right-0 bg-[#ff6a00] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl">TARGET</div>
        <p className="text-[10px] font-bold text-[#ff6a00] uppercase tracking-widest mb-1">Expected In</p>
        <p className="text-2xl font-bold text-[#ff6a00]">
            {activePass.expectedInTime ? new Date(activePass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
        </p>
        
        {/* Real-time Overdue Text */}
        {new Date() > new Date(activePass.expectedInTime) && (
            <p className="text-[10px] text-red-500 font-bold mt-1 uppercase animate-pulse">
                Overdue: {Math.floor((new Date() - new Date(activePass.expectedInTime)) / 60000)} mins
            </p>
        )}
    </div>
)}

                        {/* Active Status Card (The "OUT" Card) */}
{activePass ? (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
            <div className="flex items-center gap-5">
                <div className="relative size-16">
                    {/* Pulsing effect tabhi jab student bahar ho */}
                    {(activePass.status === 'Out' || activePass.status === 'OUT') && (
                        <div className="absolute inset-0 bg-[#ff6a00]/10 rounded-full animate-ping"></div>
                    )}
                    <div className="relative size-16 bg-[#ff6a00] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40">
                        <span className="material-symbols-outlined text-white text-3xl">directions_walk</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#181410] tracking-tight uppercase">
                        STATUS: {activePass.status} 
                        <span className={`inline-block size-2 rounded-full ml-1 ${activePass.status === 'Out' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                    </h2>
                    <p className="text-[#8d715e] text-sm font-medium">Pass ID: #{activePass._id?.slice(-4).toUpperCase()}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 p-2 pr-4 rounded-full border border-gray-100">
                <div className="size-10 rounded-full bg-orange-100 border-2 border-white overflow-hidden">
                    <img src={activePass.studentPhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"} alt="avatar" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-400 font-bold">Student</span>
                    <span className="text-sm font-bold text-[#181410]">{activePass.studentName || 'User'}</span>
                </div>
            </div>
        </div>

        {/* Timeline Visualization */}
        <div className="flex flex-col md:flex-row gap-4 items-center relative z-10">
            <div className="flex-1 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Logged Out</p>
                <p className="text-2xl font-bold text-[#181410]">
                    {activePass.outTime ? new Date(activePass.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </p>
                <p className="text-[10px] text-green-600 font-bold mt-1 bg-green-50 py-1 rounded-full uppercase">
                    {activePass.outTime ? "Verified at Gate" : "Waiting for Departure"}
                </p>
            </div>
            
            <div className="size-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-300">arrow_forward</span>
            </div>

            <div className={`flex-1 bg-white border-2 p-5 rounded-2xl shadow-sm text-center relative overflow-hidden ${new Date() > new Date(activePass.expectedInTime) ? 'border-red-200' : 'border-[#ff6a00]/30'}`}>
                <div className="absolute top-0 right-0 bg-[#ff6a00] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl">TARGET</div>
                <p className="text-[10px] font-bold text-[#ff6a00] uppercase tracking-widest mb-1">Expected In</p>
                <p className="text-2xl font-bold text-[#ff6a00]">
                    {new Date(activePass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {new Date() > new Date(activePass.expectedInTime) && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 uppercase animate-pulse">
                        Overdue: {Math.floor((new Date() - new Date(activePass.expectedInTime)) / 60000)} mins
                    </p>
                )}
            </div>
        </div>

        {/* Movement Buttons - Linked with activePass._id */}
        <div className="flex gap-4 mt-8 relative z-10">
            {activePass.status === 'Approved' && (
                <button 
                    onClick={() => handleMovement('out')}
                    className="flex-1 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                >
                    <span className="material-symbols-outlined">logout</span> Mark Departure
                </button>
            )}
            
            {(activePass.status === 'Out' || activePass.status === 'OUT') && (
                <button 
                    onClick={() => handleMovement('in')}
                    className="flex-1 bg-[#ff6a00] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e65f00] shadow-lg shadow-orange-500/20 transition-all"
                >
                    <span className="material-symbols-outlined">login</span> Mark Arrival
                </button>
            )}
        </div>
    </div>
) : (
    /* Empty State */
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-12 text-center">
        <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-gray-300 text-3xl">confirmation_number</span>
        </div>
        <p className="text-gray-500 font-medium">No active Gate Pass found.</p>
        <p className="text-gray-400 text-xs">Apply for a new pass from the sidebar.</p>
    </div>
)}

                        {/* Recent History Table */}
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-2">
    <table className="w-full text-left">
        <thead className="bg-[#fbfaf8] border-b border-gray-50">
            <tr className="text-[10px] font-bold uppercase text-gray-400">
                <th className="p-5">Date</th>
                <th className="p-5">Destination</th>
                <th className="p-5">Out / In</th>
                <th className="p-5 text-right">Status</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
            {passes.length > 0 ? (
                passes.map((pass) => (
                    <tr key={pass._id} className="text-sm text-[#181410] hover:bg-gray-50 transition-colors">
                        <td className="p-5">
                            <div className="font-semibold">
                                {new Date(pass.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short'
                                })}
                            </div>
                            <div className="text-[10px] text-gray-400 uppercase">
                                {new Date(pass.createdAt).toLocaleDateString('en-GB', { weekday: 'short' })}
                            </div>
                        </td>
                        <td className="p-5">
                            <div className="text-gray-600 font-medium">{pass.destination}</div>
                            <div className="text-[10px] text-gray-400 italic truncate max-w-[150px]">{pass.reason}</div>
                        </td>
                        <td className="p-5 text-gray-500">
                            <div className="flex flex-col">
                                <span>{pass.outTime ? new Date(pass.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}</span>
                                <span className="text-[10px] text-gray-300">to</span>
                                <span>{pass.actualInTime ? new Date(pass.actualInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}</span>
                            </div>
                        </td>
                        <td className="p-5 text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                pass.status === 'Returned' ? 'bg-green-50 text-green-700 border-green-100' :
                                pass.status === 'Out' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                pass.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                'bg-orange-50 text-orange-700 border-orange-100'
                            }`}>
                                {pass.status}
                            </span>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400 italic">
                        No history records found.
                    </td>
                </tr>
            )}
        </tbody>
    </table>
</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GatePassManager;
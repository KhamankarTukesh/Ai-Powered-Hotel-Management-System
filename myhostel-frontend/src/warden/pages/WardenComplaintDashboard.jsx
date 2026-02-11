import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';

const WardenComplaintDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiInsight, setAiInsight] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

    // Fetch Complaints and Stats
    const fetchComplaints = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await API.get(`/complaints/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const complaintsList = Array.isArray(data) ? data : [];
            setComplaints(complaintsList);
            setStats({
                total: complaintsList.length,
                pending: complaintsList.filter(c => c.status === 'Pending').length,
                resolved: complaintsList.filter(c => c.status === 'Resolved').length
            });
        } catch (error) {
            toast.error("Failed to sync complaints");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

    // Update Complaint
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            setIsUpdating(true);
            const token = localStorage.getItem('token');
            await API.put(`/complaints/${selectedComplaint._id}/status`,
                { status: formData.get('status'), assignedStaff: formData.get('assignedStaff') },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Updated!");
            setSelectedComplaint(null);
            fetchComplaints();
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    // Delete Complaint
    const handleDelete = async (id) => {
        if (!window.confirm("Permanently delete this resolved complaint record?")) return;
        try {
            const token = localStorage.getItem('token');
            await API.delete(`/complaints/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Record removed");
            fetchComplaints(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    // AI Analysis
    const analyzeWithAI = async () => {
        if (complaints.length === 0) return toast.error("No complaints to analyze!");
        try {
            setIsAnalyzing(true);
            setAiInsight(""); 
            const feedbackList = complaints.map(c => `${c.title}: ${c.description}`);
            const { data } = await API.post('/ai/analyze-feedback', { feedbackList, type: 'Maintenance' });
            setAiInsight(data.aiInsight);
            toast.success("AI Analysis Complete!");
        } catch (error) {
            toast.error("AI Analysis failed.");
        } finally { setIsAnalyzing(false); }
    };

    // Filter Complaints
    const filteredComplaints = complaints.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === "" || item.priority.toLowerCase() === filterPriority.toLowerCase();
        return matchesSearch && matchesPriority;
    });

    return (
        <div className="bg-[#fdfbf9] font-sans text-[#1a202c] antialiased min-h-screen p-4 lg:p-12 flex flex-col items-center">
            <main className="w-full max-w-[1400px] grid grid-cols-1 gap-8">

                {/* Header */}
                <div className="col-span-1 mb-4 flex flex-col gap-2">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a202c] tracking-tight">
                        Welcome back, <span className="text-[#ff6b00]">Warden Sharma</span> ✨
                    </h1>
                    <p className="text-lg sm:text-xl italic text-gray-500 mt-1 sm:mt-2">
                        Hostel management, <span className="text-[#ff6b00] font-semibold">simplified.</span>
                    </p>
                    <button 
                        onClick={analyzeWithAI}
                        disabled={isAnalyzing}
                        className="mt-4 bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-[#ff6b00] transition-all disabled:opacity-50 w-fit"
                    >
                        {isAnalyzing ? "⌛ ANALYZING..." : "✨ GET AI INSIGHTS"}
                    </button>
                </div>

                {/* AI Insight */}
                {aiInsight && (
                    <div className="col-span-1 bg-orange-50 border-2 border-orange-200 rounded-[2rem] p-4 sm:p-6 mb-4 relative shadow-inner">
                        <button onClick={() => setAiInsight("")} className="absolute top-3 right-3 font-bold text-orange-400">✕</button>
                        <h2 className="text-orange-600 font-black italic mb-2 uppercase text-xs sm:text-sm tracking-widest flex items-center gap-2">
                            <span>✨</span> AI Warden Summary
                        </h2>
                        <p className="text-gray-700 font-medium whitespace-pre-line leading-relaxed italic text-sm sm:text-base">
                            {aiInsight}
                        </p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex justify-center items-center bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex-col gap-2 w-full">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#ff6b00]">
                            <span className="material-symbols-outlined">assignment</span>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total Active</p>
                            <h3 className="text-3xl sm:text-5xl font-black">{stats.total}</h3>
                        </div>
                    </div>

                    <div className="flex justify-center items-center bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex-col gap-2 w-full">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Pending</p>
                            <h3 className="text-3xl sm:text-5xl font-black">{stats.pending}</h3>
                        </div>
                    </div>

                    <div className="flex justify-center items-center bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex-col gap-2 w-full">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Resolved</p>
                            <h3 className="text-3xl sm:text-5xl font-black">{stats.resolved}</h3>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 bg-white p-3 sm:p-4 rounded-3xl shadow-sm w-full">
                    <div className="relative flex-1">
                        <span className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 sm:h-14 pl-10 sm:pl-14 pr-4 rounded-2xl bg-[#f8f9fa] border-none focus:ring-2 focus:ring-[#ff6b00]/20 text-sm sm:text-lg"
                            placeholder="Search by complaint title..." type="text"
                        />
                    </div>
                    <select 
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="h-12 sm:h-14 px-4 sm:px-6 rounded-2xl bg-[#f8f9fa] border-none font-bold text-gray-600 cursor-pointer text-sm sm:text-base"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="w-full text-left min-w-[600px] sm:min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="py-4 px-4 sm:px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Details</th>
                                <th className="py-4 px-4 sm:px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Priority</th>
                                <th className="py-4 px-4 sm:px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="py-4 px-4 sm:px-8 text-xs font-black text-gray-400 uppercase tracking-widest text-right min-w-max">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredComplaints.map((item) => (
                                <tr key={item._id} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="py-4 px-4 sm:px-8">
                                        <span className="text-sm sm:text-lg font-bold block truncate">{item.title}</span>
                                        <span className="text-xs text-gray-400 truncate">{item.student?.fullName || "Student"}</span>
                                    </td>
                                    <td className="py-4 px-4 sm:px-8">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                                            item.priority === 'Urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-[#ff6b00] border-orange-100'
                                        }`}>
                                            {item.priority}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 sm:px-8 font-black text-sm text-gray-700">
                                        <span className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${item.status === 'Resolved' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 sm:px-8 text-right flex justify-end items-center gap-2 md:gap-3 min-w-max flex-wrap">
                                        <button 
                                            onClick={() => setSelectedComplaint(item)}
                                            className="px-3 sm:px-6 py-1.5 sm:py-2 rounded-full bg-[#1a202c] text-white text-[9px] sm:text-xs font-bold hover:bg-[#ff6b00] transition-all whitespace-nowrap"
                                        >
                                            <span className="md:hidden">VIEW</span>
                                            <span className="hidden md:inline">VIEW DETAILS</span>
                                        </button>
                                        {item.status === 'Resolved' && (
                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 transition-all shadow-sm"
                                                title="Delete Resolved Record"
                                            >
                                                <span className="material-symbols-outlined text-[16px] sm:text-[20px]">delete</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modal Update */}
            {selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
                    <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-6 sm:p-10 relative animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                        <button 
                            onClick={() => setSelectedComplaint(null)} 
                            className="absolute top-4 sm:top-8 right-4 sm:right-8 text-gray-400 hover:text-black transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h2 className="text-2xl sm:text-3xl font-black mb-2 text-[#1a202c] truncate">{selectedComplaint.title}</h2>
                        <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 leading-relaxed">{selectedComplaint.description}</p>
                        
                        <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Set Status</label>
                                    <select 
                                        name="status" 
                                        defaultValue={selectedComplaint.status} 
                                        className="h-10 sm:h-12 rounded-2xl bg-gray-50 border-none px-3 sm:px-4 font-bold text-gray-700 focus:ring-2 focus:ring-orange-100"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Assigned To</label>
                                    <input 
                                        name="assignedStaff" 
                                        defaultValue={selectedComplaint.assignedStaff !== "Not Assigned" ? selectedComplaint.assignedStaff : ""}
                                        placeholder="e.g. Electrician" 
                                        className="h-10 sm:h-12 rounded-2xl bg-gray-50 border-none px-3 sm:px-4 font-bold text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-orange-100" 
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isUpdating}
                                className="w-full h-12 sm:h-14 bg-[#ff6b00] text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        UPDATING...
                                    </>
                                ) : (
                                    'SYNC CHANGES'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardenComplaintDashboard;

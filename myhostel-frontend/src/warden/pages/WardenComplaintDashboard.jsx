import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';

const WardenComplaintDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

    // 1. Fetch Data and Sync Stats
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

    // 2. Handle Status/Staff Update
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

    // 3. Handle Permanent Deletion
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

    // 4. Client-side Search & Filter
    const filteredComplaints = complaints.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === "" || item.priority.toLowerCase() === filterPriority.toLowerCase();
        return matchesSearch && matchesPriority;
    });

    return (
        <div className="bg-[#fdfbf9] font-sans text-[#1a202c] antialiased min-h-screen p-6 lg:p-12 flex flex-col items-center">
            <main className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-8">
                
{/* Header Section */}
<div className="col-span-1 md:col-span-12 mb-4">
  <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a202c] tracking-tight">
    Welcome back, <span className="text-[#ff6b00]">Warden Sharma</span> ✨
  </h1>
  <p className="text-xl italic text-gray-500 mt-2">
    Hostel management, <span className="text-[#ff6b00] font-semibold">simplified.</span>
  </p>
</div>


                {/* Stats Cards */}
<div className="col-span-1 md:col-span-4 flex justify-center items-center bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 w-full">
  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#ff6b00]">
    <span className="material-symbols-outlined">assignment</span>
  </div>
  <div>
    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
      Total Active
    </p>
    <h3 className="text-5xl font-black ml-10">{stats.total}</h3>
  </div>
</div>

<div className="col-span-1 md:col-span-4 flex justify-center items-center bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 w-full">
  <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600">
    <span className="material-symbols-outlined">pending_actions</span>
  </div>
  <div>
    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
      Pending
    </p>
    <h3 className="text-5xl font-black ml-5">{stats.pending}</h3>
  </div>
</div>

<div className="col-span-1 md:col-span-4 flex justify-center items-center bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 w-full">
  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
    <span className="material-symbols-outlined">verified</span>
  </div>
  <div>
    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
      Resolved
    </p>
    <h3 className="text-5xl font-black ml-6">{stats.resolved}</h3>
  </div>
</div>


                {/* Search & Filter */}
                <div className="col-span-1 md:col-span-12 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl shadow-sm">
                    <div className="relative flex-1">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-[#f8f9fa] border-none focus:ring-2 focus:ring-[#ff6b00]/20 text-lg" 
                            placeholder="Search by complaint title..." type="text"
                        />
                    </div>
                    <select 
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="h-14 px-6 rounded-2xl bg-[#f8f9fa] border-none font-bold text-gray-600 cursor-pointer"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                {/* Table Section */}
                <div className="col-span-1 md:col-span-12 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="py-6 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Details</th>
                                <th className="py-6 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Priority</th>
                                <th className="py-6 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="py-6 px-8 text-xs font-black text-gray-400 uppercase tracking-widest text-right min-w-max">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredComplaints.map((item) => (
                                <tr key={item._id} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="py-6 px-8">
                                        <span className="text-lg font-bold block">{item.title}</span>
                                        <span className="text-sm text-gray-400">{item.student?.fullName || "Student"}</span>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                                            item.priority === 'Urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-[#ff6b00] border-orange-100'
                                        }`}>
                                            {item.priority}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 font-black text-sm text-gray-700">
                                        <span className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${item.status === 'Resolved' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                                            {item.status}
                                        </span>
                                    </td>
<td className="py-6 px-4 md:px-8 text-right flex justify-end items-center gap-2 md:gap-3 min-w-max">
    {/* VIEW BUTTON - Responsive text: shorter on mobile */}
    <button 
        onClick={() => setSelectedComplaint(item)}
        className="px-4 md:px-6 py-2 rounded-full bg-[#1a202c] text-white text-[10px] md:text-xs font-bold hover:bg-[#ff6b00] transition-all whitespace-nowrap"
    >
        <span className="md:hidden">VIEW</span>
        <span className="hidden md:inline">VIEW DETAILS</span>
    </button>
    
    {/* DELETE BUTTON - Only visible if Resolved */}
    {item.status === 'Resolved' && (
        <button 
            onClick={() => handleDelete(item._id)}
            className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 transition-all shadow-sm"
            title="Delete Resolved Record"
        >
            <span className="material-symbols-outlined text-[18px] md:text-[20px]">delete</span>
        </button>
    )}
</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modal Update Section */}
            {selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
                    <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-10 relative animate-in zoom-in duration-200">
                        <button 
                            onClick={() => setSelectedComplaint(null)} 
                            className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h2 className="text-3xl font-black mb-2 text-[#1a202c]">{selectedComplaint.title}</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">{selectedComplaint.description}</p>
                        
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Set Status</label>
                                    <select 
                                        name="status" 
                                        defaultValue={selectedComplaint.status} 
                                        className="h-12 rounded-2xl bg-gray-50 border-none px-4 font-bold text-gray-700 focus:ring-2 focus:ring-orange-100"
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
                                        className="h-12 rounded-2xl bg-gray-50 border-none px-4 font-bold text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-orange-100" 
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isUpdating}
                                className="w-full h-14 bg-[#ff6b00] text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
import React, { useState, useEffect } from 'react';
import { Search, User, Hash, MapPin, Trash2, Loader2, Sparkles, X } from 'lucide-react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

const StudentActivity = () => {
    const [allStudents, setAllStudents] = useState([]); 
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null); // <-- Aapka main variable
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await API.get("/fee/analytics");
                setAllStudents(data);
            } catch (err) { console.error("Failed to load students list"); }
        };
        fetchStudents();
    }, []);

    const filteredStudents = allStudents.filter((item) => {
        const roll = item.student?.studentDetails?.rollNumber?.toLowerCase() || "";
        const name = item.student?.fullName?.toLowerCase() || "";
        const query = searchQuery.trim().toLowerCase();
        return query === "" ? false : (roll.includes(query) || name.includes(query));
    });

    const handleSelect = async (studentObj) => {
        setSelectedStudent(studentObj); // Yahan set ho raha hai
        setSearchQuery(`${studentObj.fullName} (${studentObj.studentDetails?.rollNumber})`);
        fetchActivities(studentObj.studentDetails?.rollNumber);
    };

    const fetchActivities = async (roll) => {
        setLoading(true);
        try {
            const { data } = await API.get(`/activity/student?rollNumber=${roll}`);
            setActivities(data);
        } catch (err) { toast.error("Logs not found"); }
        finally { setLoading(false); }
    };

    const handleDelete = async (logId) => {
        if (!window.confirm("Delete this log permanently?")) return;
        try {
            await API.delete(`/activity/${logId}`);
            setActivities(activities.filter(log => log._id !== logId));
            toast.success("Log removed");
        } catch (err) { toast.error("Delete failed"); }
    };

// --- UPDATED BULK DELETE LOGIC ---
const handleClearAll = async () => {
    if(!selectedStudent) return;
    
    
    const confirmMsg = `Are you sure you want to delete the entire history for ${selectedStudent.fullName}?`;
    if(!window.confirm(confirmMsg)) return;

    try {
        await API.delete(`/activity/clear-all?rollNumber=${selectedStudent.studentDetails.rollNumber}`);
        setActivities([]);
        toast.success("History cleared successfully!"); // Updated to English
    } catch (err) { 
        toast.error(err.response?.data?.error || "Failed to clear history"); 
    }
};

    return (
        <div className="min-h-screen bg-[#fffaf5] p-6 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-4xl font-black text-slate-900 italic">ACTIVITY <span className="text-[#ff6b00]">LOGS</span></h1>
                    <p className="text-orange-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"><Sparkles size={12}/> Search & Manage Movement</p>
                </header>

                <div className="relative">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search Name or Roll Number..."
                            className="w-full pl-14 pr-12 py-5 bg-white border-2 border-orange-100 rounded-[2rem] font-bold shadow-lg outline-none focus:border-[#ff6b00] transition-all"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if(selectedStudent) { setSelectedStudent(null); setActivities([]); }
                            }}
                        />
                        {searchQuery && (
                            <button onClick={() => {setSearchQuery(""); setSelectedStudent(null); setActivities([])}} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
                                <X size={20}/>
                            </button>
                        )}
                    </div>

                    {searchQuery.length > 0 && !selectedStudent && (
                        <div className="absolute w-full mt-2 bg-white border border-orange-100 rounded-[2rem] shadow-2xl z-50 max-h-60 overflow-y-auto p-2">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((item) => (
                                    <div key={item.student._id} onClick={() => handleSelect(item.student)} className="p-4 hover:bg-orange-50 cursor-pointer rounded-2xl flex justify-between items-center transition-colors">
                                        <div>
                                            <p className="font-black text-slate-800">{item.student.fullName}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase">{item.student.studentDetails?.rollNumber}</p>
                                        </div>
                                        <span className="text-[10px] bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-black">VIEW LOGS</span>
                                    </div>
                                ))
                            ) : <p className="p-4 text-center text-slate-400 font-bold italic">No students found</p>}
                        </div>
                    )}
                </div>

                {/* --- FIXED CLEAR ALL BUTTON --- */}
                {activities.length > 0 && selectedStudent && (
                    <button 
                        onClick={handleClearAll}
                        className="mt-4 w-full py-4 bg-red-50 text-red-600 border-2 border-dashed border-red-200 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Trash2 size={16} /> Delete Entire Activity History
                    </button>
                )}

                <div className="space-y-4">
                    {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#ff6b00]" size={40}/></div> : (
                        activities.map((log) => (
                            <div key={log._id} className="group relative bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${log.action === 'Check-out' || log.action === 'Check-in' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-600'}`}>
                                            {log.action}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-300 italic">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="font-bold text-slate-700">{log.description}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                        <MapPin size={12} className="text-orange-400"/> 
                                        Room: {log.student?.roomNumber || "Waiting for Allocation"}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleDelete(log._id)}
                                    className="md:opacity-0 group-hover:opacity-100 p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all self-center md:self-auto"
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        ))
                    )}
                    {!loading && selectedStudent && activities.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-[3rem] border-2 border-dashed border-orange-100">
                             <p className="font-bold text-slate-400 italic uppercase text-xs tracking-widest">No history records found for this student.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentActivity;
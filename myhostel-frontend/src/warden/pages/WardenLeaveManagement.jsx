import React, { useState, useEffect } from "react";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  MessageSquare, 
  UserCircle 
} from "lucide-react";
import API from "../../api/axios";

const WardenLeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Stores ID of leave being processed
  const [wardenNote, setWardenNote] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/leaves/all");
      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leaveId, status) => {
    if (!wardenNote && status === "Approved") {
      alert("Please add a note for the outpass.");
      return;
    }

    setActionLoading(leaveId);
    try {
      const response = await API.put(`/leaves/update/${leaveId}`, {
        status,
        wardenNote
      });

      if (response.data.outpassUrl) {
        window.open(response.data.outpassUrl, "_blank");
      }

      alert(response.data.message);
      setWardenNote("");
      fetchLeaves(); // Refresh list
    } catch (err) {
      alert("Update failed");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter by Name or Roll Number
  const filteredLeaves = leaves.filter(
    leave =>
      leave.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.student.studentDetails.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fffaf5]">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] p-4 md:p-10 font-display">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Leave Requests</h1>
            <p className="text-orange-600 font-bold text-xs uppercase tracking-widest">Warden Approval Portal</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search Name or Roll Number..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave) => (
              <div key={leave._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center transition-all hover:shadow-md">
                
                {/* Student Info */}
                <div className="flex items-center gap-4 min-w-[250px]">
                  <div className="bg-slate-100 p-3 rounded-2xl text-slate-600">
                    <UserCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg leading-tight">{leave.student.fullName}</h3>
                    <p className="text-orange-500 font-bold text-xs">{leave.student.studentDetails.rollNumber}</p>
                  </div>
                </div>

                {/* Journey Details */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 border-l border-r border-slate-50 px-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Reason</p>
                    <p className="text-sm font-bold text-slate-700 italic">"{leave.reason}"</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Duration</p>
                    <p className="text-sm font-black text-slate-800">
                      {new Date(leave.startDate).toLocaleDateString('en-GB')} - {new Date(leave.endDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {leave.status === 'Approved' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                      {leave.status}
                    </span>
                  </div>
                </div>

                {/* Action Area */}
                <div className="flex flex-col gap-3 min-w-[300px]">
                  {leave.status === "Pending" ? (
                    <>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 text-slate-300" size={16} />
                        <textarea 
                          placeholder="Add warden note for outpass..."
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 ring-orange-200 outline-none resize-none h-12"
                          onChange={(e) => setWardenNote(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(leave._id, "Approved")}
                          disabled={actionLoading === leave._id}
                          className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                          {actionLoading === leave._id ? <Loader2 className="animate-spin" size={14}/> : "Approve & Generate"}
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(leave._id, "Rejected")}
                          className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-green-600 uppercase">Note Added</p>
                        <p className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{leave.wardenNote}</p>
                      </div>
                      <CheckCircle className="text-green-500" size={20} />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No matching leave requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardenLeaveManagement;

import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  ArrowLeftRight, CheckCircle2, XCircle, Loader2, 
  AlertCircle, ChevronLeft, MessageSquare 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WardenRoomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [wardenNotes, setWardenNotes] = useState({});
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/rooms/requests/pending');
      setRequests(data);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleProcess = async (requestId, action) => {
    setActionLoading(requestId);
    try {
      const { data } = await API.put(`/rooms/approve-change/${requestId}`, {
        action,
        wardenNote: wardenNotes[requestId] || ""
      });
      toast.success(data.message);
      setRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] p-4 md:p-12 font-display">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-orange-100 hover:bg-orange-50 transition-all">
            <ChevronLeft className="text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Room Change Requests</h1>
            <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">Decision Portal</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
        ) : (
          <div className="grid gap-6">
            {requests.length > 0 ? (
              requests.map((req) => (
                <div key={req._id} className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-orange-50 flex flex-col gap-6">

                  {/* Student & Room Info */}
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-center flex-wrap">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100 flex-shrink-0">
                        <ArrowLeftRight size={24} />
                      </div>
                      <div className="truncate">
                        <h3 className="text-md font-black text-slate-800 uppercase leading-none truncate">{req.student?.fullName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest truncate">{req.student?.studentDetails?.rollNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex-shrink-0">
                      <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">From</p><p className="font-black text-slate-700">{req.currentRoom?.roomNumber}</p></div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div className="text-center"><p className="text-[8px] font-black text-orange-500 uppercase">To</p><p className="font-black text-slate-700">{req.desiredRoom?.roomNumber}</p></div>
                    </div>
                  </div>

                  {/* Note Area */}
                  <div className="space-y-3">
                    <div className="flex gap-2 text-[10px] font-black text-slate-400 uppercase ml-2 flex-wrap">
                      <AlertCircle size={12}/> Student Reason: <span className="text-slate-600 italic font-bold">"{req.reason}"</span>
                    </div>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-slate-300" size={16} />
                      <textarea 
                        placeholder="Add a note for the student (Explain rejection or give instructions)..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-[1.5rem] text-xs font-bold outline-none focus:ring-2 ring-orange-100 min-h-[100px] border border-slate-100 resize-none"
                        value={wardenNotes[req._id] || ""}
                        onChange={(e) => setWardenNotes({...wardenNotes, [req._id]: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                    <button
                      onClick={() => handleProcess(req._id, 'approve')}
                      disabled={actionLoading === req._id}
                      className="flex-1 bg-slate-900 text-white py-3 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[120px]"
                    >
                      {actionLoading === req._id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={16} />}
                      Approve Change
                    </button>
                    <button
                      onClick={() => handleProcess(req._id, 'reject')}
                      disabled={actionLoading === req._id}
                      className="flex-1 bg-white border-2 border-slate-100 text-slate-400 py-3 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[120px]"
                    >
                      {actionLoading === req._id ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={16} />}
                      Reject Request
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
                <p className="text-slate-400 font-bold italic">No pending room change requests.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WardenRoomRequests;

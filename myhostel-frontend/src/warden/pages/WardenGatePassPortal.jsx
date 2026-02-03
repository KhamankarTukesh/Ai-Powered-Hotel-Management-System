import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  User,
  Search,
  CalendarDays
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WardenGatePassPortal = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchPendingPasses = async () => {
    try {
      // Fetches only passes with status: 'Pending'
      const { data } = await API.get('/gatepass/pending'); 
      setPasses(data);
    } catch (err) {
      toast.error("Failed to load gate passes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingPasses(); }, []);

  const handleAction = async (passId, status) => {
    setBtnLoading(passId);
    try {
      // Uses your existing PUT /approve/:id route
      await API.put(`/gatepass/approve/${passId}`, { status });
      toast.success(`Pass ${status}!`);
      setPasses(prev => prev.filter(p => p._id !== passId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setBtnLoading(null);
    }
  };

  const filteredPasses = passes.filter(p => 
    p.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fffaf5] p-6 md:p-12 font-display">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)} 
              className="p-4 bg-white rounded-[1.5rem] shadow-sm border border-orange-100 hover:bg-orange-50 transition-all text-slate-600"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
                Gate Pass Portal
              </h1>
              <p className="text-orange-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
                Student Out-Movement Management
              </p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative group w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search Student..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-orange-100 rounded-2xl text-xs font-bold outline-none shadow-sm focus:ring-2 ring-orange-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* MAIN CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Requests...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPasses.length > 0 ? (
              filteredPasses.map((pass) => (
                <div key={pass._id} className="bg-white rounded-[3rem] p-8 shadow-xl border border-orange-50 flex flex-col justify-between hover:shadow-2xl hover:border-orange-200 transition-all relative overflow-hidden group">
                  
                  {/* Decorative Background Icon */}
                  <LogOut className="absolute -right-6 -top-6 text-orange-50/50 w-32 h-32 rotate-12 group-hover:text-orange-50 transition-colors" />

                  <div className="relative">
                    {/* Student Info */}
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                        <User size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none mb-1">
                          {pass.student?.fullName}
                        </h3>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                            Roll: {pass.student?.studentDetails?.rollNumber || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Movement Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
                          <MapPin size={12} className="text-orange-500"/> Destination
                        </p>
                        <p className="text-sm font-black text-slate-700 uppercase">{pass.destination}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
                          <CalendarDays size={12} className="text-orange-500"/> Expected Return
                        </p>
                        <p className="text-sm font-black text-slate-700">
                           {new Date(pass.expectedInTime).toLocaleDateString([], { day: '2-digit', month: 'short' })}, {new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Reason Box */}
                    <div className="mb-8 px-4">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 italic">Student Reason:</p>
                       <p className="text-xs font-bold text-slate-600 leading-relaxed border-l-4 border-orange-200 pl-4 py-1">
                         "{pass.reason}"
                       </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3 relative z-10">
                    <button
                      onClick={() => handleAction(pass._id, 'Approved')}
                      disabled={btnLoading === pass._id}
                      className="flex-2 bg-slate-900 text-white px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      {btnLoading === pass._id ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={18} />}
                      Approve Pass
                    </button>
                    <button
                      onClick={() => handleAction(pass._id, 'Rejected')}
                      disabled={btnLoading === pass._id}
                      className="flex-1 bg-white border-2 border-slate-100 text-slate-400 px-4 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner">
                <div className="p-6 bg-slate-50 rounded-full mb-4">
                   <Clock className="text-slate-300" size={48} />
                </div>
                <p className="text-slate-400 font-black italic uppercase tracking-widest">No pending gate pass requests</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WardenGatePassPortal;
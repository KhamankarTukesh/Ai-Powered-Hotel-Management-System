import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Send, Download, Clock, CheckCircle, XCircle, PlaneTakeoff } from 'lucide-react';

const LeaveRequest = ({ leaves, onApply }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'Rejected': return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <PlaneTakeoff size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic">Leave Management</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan your vacations & home visits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Apply Form */}
        <div className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-6"
          >
            <h3 className="text-lg font-black text-slate-800 italic mb-6">Request Leave</h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">From</label>
                  <input 
                    type="date" 
                    className="mt-1 w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-xs focus:border-indigo-200"
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">To</label>
                  <input 
                    type="date" 
                    className="mt-1 w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-xs focus:border-indigo-200"
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Reason for Leave</label>
                <textarea 
                  rows="4"
                  placeholder="Home visit, Medical, Emergency..."
                  className="mt-1 w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-sm focus:border-indigo-200"
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>

              <button 
                onClick={() => onApply(formData)}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
              >
                <Send size={18} /> Submit Application
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: History & Outpass */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Application History</h3>
          
          {leaves && leaves.length > 0 ? (
            leaves.map((leave, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getStatusBadge(leave.status)}`}>
                      {leave.status === 'Approved' ? <CheckCircle size={20}/> : leave.status === 'Rejected' ? <XCircle size={20}/> : <Clock size={20}/>}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-slate-800 italic">{leave.reason}</h4>
                        <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusBadge(leave.status)}`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                        <Calendar size={12} className="text-indigo-400" />
                        {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {leave.status === 'Approved' && leave.outpassUrl && (
                    <div className="flex items-center">
                      <a 
                        href={leave.outpassUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 shadow-sm"
                      >
                        <Download size={14} /> Download Outpass
                      </a>
                    </div>
                  )}
                </div>

                {leave.wardenNote && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border-l-4 border-indigo-400">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 italic">Warden's Remark</p>
                    <p className="text-xs font-bold text-slate-600">{leave.wardenNote}</p>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
              <FileText className="mx-auto text-slate-200 mb-2" size={40} />
              <p className="text-sm font-bold text-slate-400 italic">No leave records yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
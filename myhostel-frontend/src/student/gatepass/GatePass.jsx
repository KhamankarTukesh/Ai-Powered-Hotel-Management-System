import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, FileText, Send, CheckCircle2, Timer, XCircle, LogOut } from 'lucide-react';

const GatePass = ({ passes, onApply }) => {
  const [formData, setFormData] = useState({
    reason: '',
    destination: '',
    expectedInTime: ''
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'Pending': return "bg-amber-50 text-amber-600 border-amber-100";
      case 'Out': return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case 'Returned': return "bg-slate-50 text-slate-600 border-slate-100";
      case 'Rejected': return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-500";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic">Movement Pass</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hostel Exit & Entry Authorization</p>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase">Current Status</p>
              <p className="text-sm font-bold text-emerald-500">Inside Campus</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-6"
          >
            <h3 className="text-lg font-black text-slate-800 italic mb-6 flex items-center gap-2">
              <LogOut size={20} className="text-indigo-500" /> Apply for Pass
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Destination</label>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    placeholder="Where are you going?"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-sm focus:border-indigo-200 transition-all"
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Return By (Time)</label>
                <div className="mt-1 relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="datetime-local" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-sm focus:border-indigo-200 transition-all text-slate-600"
                    onChange={(e) => setFormData({...formData, expectedInTime: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Reason</label>
                <div className="mt-1 relative">
                  <FileText className="absolute left-4 top-4 text-slate-300" size={16} />
                  <textarea 
                    rows="3"
                    placeholder="Brief reason for outing..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-sm focus:border-indigo-200 transition-all"
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={() => onApply(formData)}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 active:scale-95"
              >
                <Send size={18} /> Send Request
              </button>
            </div>
          </motion.div>
        </div>

        {/* Status/History Section */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Recent Passes</h3>
          
          {passes && passes.length > 0 ? (
            passes.map((pass, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getStatusStyle(pass.status)}`}>
                    {pass.status === 'Approved' ? <CheckCircle2 /> : pass.status === 'Pending' ? <Timer /> : <LogOut />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-800 italic">{pass.destination}</h4>
                      <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(pass.status)}`}>
                        {pass.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 mb-2">{pass.reason}</p>
                    <div className="flex gap-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1">
                          <Clock size={12} className="text-indigo-500" /> Return: {new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                  </div>
                </div>

                {pass.status === 'Approved' && (
                  <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[8px] font-black text-indigo-400 uppercase mb-1">Pass QR/Code</p>
                    <p className="text-lg font-black text-indigo-700 tracking-widest">{pass._id.slice(-6).toUpperCase()}</p>
                  </div>
                )}

                {pass.status === 'Returned' && pass.actualInTime > pass.expectedInTime && (
                  <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                    <XCircle size={14} />
                    <span className="text-[10px] font-black uppercase">Late Return</span>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <FileText className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-sm font-bold text-slate-400 italic">No gate pass history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GatePass;
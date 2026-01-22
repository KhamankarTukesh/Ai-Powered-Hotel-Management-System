import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, HelpCircle, Send, AlertCircle } from 'lucide-react';

const RequestRoomChange = ({ currentRoomNumber, onSendRequest }) => {
  const [formData, setFormData] = useState({
    desiredRoomNumber: '',
    reason: ''
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-amber-100 p-4 rounded-2xl text-amber-600">
            <RefreshCw size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 italic">Room Swap Request</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apply for a different room or block</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Current Room</p>
                <p className="text-xl font-black text-slate-700 italic">{currentRoomNumber}</p>
             </div>
             <div>
                <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Desired Room No.</label>
                <input 
                  type="text" 
                  placeholder="e.g. B-204"
                  className="w-full mt-1 p-6 bg-white rounded-3xl border-2 border-slate-100 outline-none font-black text-xl text-indigo-600 focus:border-indigo-500 transition-all placeholder:text-slate-200"
                  onChange={(e) => setFormData({...formData, desiredRoomNumber: e.target.value})}
                />
             </div>
          </div>

          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Reason for Transfer</label>
            <textarea 
              rows="4"
              placeholder="Health issues, roommate issues, floor preference..."
              className="w-full mt-1 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 outline-none font-bold text-sm focus:border-indigo-200 transition-all"
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <AlertCircle className="text-blue-500 shrink-0" size={18} />
            <p className="text-[10px] font-bold text-blue-600/70 leading-relaxed">
              Note: Room changes are subject to availability and Warden's approval. You will be notified once the request is processed.
            </p>
          </div>

          <button 
            onClick={() => onSendRequest(formData)}
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Send size={20} /> Submit Change Request
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestRoomChange;
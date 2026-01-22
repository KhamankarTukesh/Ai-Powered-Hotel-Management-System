import React from 'react';
import { User, ShieldCheck, Calendar, Activity } from 'lucide-react';

const ComplaintDetails = ({ complaint }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            ID: #{complaint._id.slice(-6).toUpperCase()}
          </span>
          <h2 className="text-2xl font-black text-slate-800 italic mt-4">{complaint.title}</h2>
        </div>
        <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-tighter ${
          complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
        }`}>
          {complaint.status}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Problem Description</p>
          <p className="text-sm font-bold text-slate-600 leading-relaxed">{complaint.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl">
            <User className="text-indigo-400" size={20} />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Assigned Staff</p>
              <p className="text-xs font-black text-slate-700">{complaint.assignedStaff || "Waiting..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl">
            <Activity className="text-emerald-400" size={20} />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">AI Priority</p>
              <p className="text-xs font-black text-slate-700">{complaint.priority}</p>
            </div>
          </div>
        </div>

        {complaint.status === 'Resolved' && (
          <div className="bg-emerald-500 p-6 rounded-[2rem] text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-emerald-100 uppercase opacity-75">Time Taken to Resolve</p>
              <p className="text-xl font-black italic">{complaint.resolutionTime || "Fast"}</p>
            </div>
            <ShieldCheck size={40} className="text-white/20" />
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { MapPin, User, Calendar, MessageSquare } from 'lucide-react';
import UpdateStatus from './UpdateStatus';

const ComplaintDetails = ({ complaint, onStatusChange }) => {
  if (!complaint) return null;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-3xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
            complaint.priority === 'Urgent' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'
          }`}>
            {complaint.priority} Priority
          </span>
          <h2 className="text-2xl font-black text-slate-800 italic mt-3">{complaint.title}</h2>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-300 uppercase">Created On</p>
          <p className="text-xs font-bold text-slate-600">{new Date(complaint.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
            <User size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase">Reported By</p>
            <p className="text-sm font-black text-slate-700 italic">{complaint.student?.fullName}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-rose-500 shadow-sm">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase">Location</p>
            <p className="text-sm font-black text-slate-700 italic">Room {complaint.student?.roomNumber || "Not Assigned"}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-10">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
          <MessageSquare size={12}/> Issue Description
        </p>
        <p className="text-sm font-bold text-slate-600 leading-relaxed bg-indigo-50/30 p-6 rounded-3xl border border-indigo-50 italic">
          "{complaint.description}"
        </p>
      </div>

      {/* Action Section */}
      <div className="pt-8 border-t border-slate-50">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Update Job Progress</p>
        <UpdateStatus 
          currentStatus={complaint.status} 
          onUpdate={(newStatus) => onStatusChange(complaint._id, newStatus)} 
        />
        
        {complaint.status === 'Resolved' && (
           <div className="mt-6 p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 border border-emerald-100 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-[10px] font-black text-emerald-600 uppercase">Resolution Time: {complaint.resolutionTime || "Calculating..."}</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const UpdateStatus = ({ currentStatus, onUpdate }) => {
  const statuses = [
    { label: 'Pending', value: 'Pending', icon: <Clock size={14}/>, color: 'text-amber-500 bg-amber-50' },
    { label: 'In Progress', value: 'In Progress', icon: <AlertCircle size={14}/>, color: 'text-blue-500 bg-blue-50' },
    { label: 'Resolved', value: 'Resolved', icon: <CheckCircle2 size={14}/>, color: 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => onUpdate(s.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
            currentStatus === s.value 
            ? `${s.color} border-current ring-2 ring-offset-1 ring-current/20` 
            : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
          }`}
        >
          {s.icon} {s.label}
        </button>
      ))}
    </div>
  );
};

export default UpdateStatus;
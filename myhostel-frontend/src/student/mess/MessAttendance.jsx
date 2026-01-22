import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const MessAttendance = ({ onMark, activity }) => {
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <h2 className="text-xl font-black text-slate-800 mb-6 italic">Mark Today's Meals</h2>
      <div className="space-y-4">
        {mealTypes.map((type) => {
          const isChecked = activity?.meals?.[type]?.checked;
          return (
            <div key={type} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-black uppercase text-xs text-slate-600 tracking-widest">{type}</span>
              <button
                disabled={isChecked}
                onClick={() => onMark(type)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
                  isChecked ? 'bg-emerald-100 text-emerald-600 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-orange-600'
                }`}
              >
                {isChecked ? <><CheckCircle2 size={14} /> Marked</> : "Mark Present"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
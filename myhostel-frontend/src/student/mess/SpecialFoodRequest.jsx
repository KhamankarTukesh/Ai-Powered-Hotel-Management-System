import React from 'react';
import { HeartPulse } from 'lucide-react';

const SpecialFoodRequest = ({ onRequest }) => {
  const items = ["Sick Diet (Khichdi & Curd)", "No Onion / Garlic", "Early Dinner Pack"];

  return (
    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <HeartPulse className="text-rose-400" />
        <h2 className="text-xl font-black italic">Special Requests</h2>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <button 
            key={item}
            onClick={() => onRequest(item)}
            className="w-full text-left p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-bold text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <p className="mt-6 text-[9px] font-bold text-slate-500 uppercase leading-relaxed text-center">
        Note: Requests must be submitted 2 hours before meal time.
      </p>
    </div>
  );
};

export default SpecialFoodRequest;
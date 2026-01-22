import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

const MessFeedback = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <h2 className="text-xl font-black text-slate-800 mb-2 italic">How was the food?</h2>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-6">AI will analyze your feedback for quality control</p>
      
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((num) => (
          <Star 
            key={num} 
            size={24} 
            onClick={() => setRating(num)}
            className={`cursor-pointer transition-colors ${rating >= num ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
          />
        ))}
      </div>

      <textarea 
        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-sm mb-4 focus:border-orange-200"
        placeholder="Taste, hygiene, or salt issues? Tell us..."
        rows="3"
        onChange={(e) => setComment(e.target.value)}
      />

      <button 
        onClick={() => onSubmit({ rating, comment })}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition-all"
      >
        <Send size={16} /> Submit Analysis
      </button>
    </div>
  );
};
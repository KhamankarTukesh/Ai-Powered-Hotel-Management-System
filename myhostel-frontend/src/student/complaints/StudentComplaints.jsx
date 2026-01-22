import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, AlertCircle, Clock, CheckCircle2, Zap, Droplets, Trash2, ChevronRight } from 'lucide-react';

const StudentComplaints = ({ complaints, onSubmit }) => {
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Electrical' });

  const categories = [
    { name: 'Electrical', icon: <Zap size={14} /> },
    { name: 'Plumbing', icon: <Droplets size={14} /> },
    { name: 'Cleaning', icon: <Trash2 size={14} /> },
    { name: 'Mess', icon: <MessageSquare size={14} /> },
    { name: 'Other', icon: <AlertCircle size={14} /> }
  ];

  const priorityColors = {
    Urgent: "bg-rose-500 text-white animate-pulse",
    High: "bg-orange-100 text-orange-600 border-orange-200",
    Medium: "bg-blue-100 text-blue-600 border-blue-200",
    Low: "bg-slate-100 text-slate-600 border-slate-200"
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic">Support Center</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">AI-Powered Issue Resolution</p>
        </div>
        <div className="flex gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="px-4 py-2 text-center border-r border-slate-50">
              <p className="text-[9px] font-black text-slate-400 uppercase">Resolved</p>
              <p className="text-lg font-black text-emerald-500">12</p>
           </div>
           <div className="px-4 py-2 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase">Pending</p>
              <p className="text-lg font-black text-orange-500">02</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Filing Form */}
        <div className="lg:col-span-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-6">
            <h3 className="text-lg font-black text-slate-800 italic mb-6">File a Complaint</h3>
            
            <div className="space-y-4">
              <input 
                type="text" placeholder="Issue Title (e.g. Fan Making Noise)" 
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-sm focus:border-indigo-300"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />

              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat.name}
                    onClick={() => setFormData({...formData, category: cat.name})}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase transition-all ${formData.category === cat.name ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              <textarea 
                rows="4" placeholder="Describe the issue in detail..."
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none font-bold text-sm focus:border-indigo-300"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <button 
                onClick={() => onSubmit(formData)}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Submit to AI Review
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: Complaint History */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Active Requests</h3>
          {complaints.map((c, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-4 group hover:border-indigo-200 transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                  {c.status === 'Resolved' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-black text-slate-800 italic">{c.title}</h4>
                    <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${priorityColors[c.priority]}`}>
                      {c.priority}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 line-clamp-1">{c.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                  <p className="text-xs font-black text-slate-700">{c.status}</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentComplaints;
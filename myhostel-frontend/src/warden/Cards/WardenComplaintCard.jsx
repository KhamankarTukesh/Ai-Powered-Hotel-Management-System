import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const WardenComplaintCard = ({ complaintStats }) => {
    const navigate = useNavigate();

    // Destructuring exactly from your new Backend Object
    // Fields added: total, pending, resolved, urgentCount
    const { 
        total = 0, 
        pending = 0, 
        resolved = 0, 
        urgentCount = 0 
    } = complaintStats || {};

    // Calculate resolution percentage for the progress ring/text
    const successRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-orange-50 flex flex-col justify-between h-full group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            
            {/* AI Insight Glow Effect - Background Decoration */}
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-orange-100/40 rounded-full blur-3xl group-hover:bg-orange-200/40 transition-all"></div>

            <div className="flex justify-between items-start relative z-10">
                <div className="p-4 bg-orange-50 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <ClipboardList size={28} />
                </div>
                
                {/* Urgent Alert Badge - Bounces if there are urgent issues */}
                {urgentCount > 0 && (
                    <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full border border-red-100 animate-bounce shadow-sm">
                        <AlertCircle size={10} className="text-red-500" />
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-tighter">
                            {urgentCount} Urgent
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-8 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">Maintenance Hub</p>
                    <Sparkles size={10} className="text-orange-300 animate-pulse" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight italic uppercase tracking-tighter">
                    {pending} <span className="text-slate-300">/ {total}</span>
                    <br /> Active Issues
                </h2>
            </div>

            {/* Micro Stats Row - Success Rate & Resolved Count */}
            <div className="mt-6 flex items-center gap-4 border-t border-slate-50 pt-6 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved</span>
                    <span className="text-lg font-black text-green-500 italic">{resolved}</span>
                </div>
                
                <div className="h-8 w-[1px] bg-slate-100"></div>
                
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</span>
                    <span className="text-lg font-black text-slate-900 italic">
                        {successRate}%
                    </span>
                </div>
            </div>

            {/* Primary Action Button */}
            <div className="mt-8 relative z-10">
                <button 
                    onClick={() => navigate('/warden/complaints')}
                    className="w-full flex items-center justify-between p-4  text-white rounded-2xl hover:scale-105 bg-[#ff6b00] transition-all group/btn shadow-lg shadow-slate-200"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest ml-2">Resolve Portal</span>
                    <div className="p-2 bg-white/10 rounded-xl group-hover/btn:translate-x-1 transition-transform">
                        <ArrowRight size={18} />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default WardenComplaintCard;
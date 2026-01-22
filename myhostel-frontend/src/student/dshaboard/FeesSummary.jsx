import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText
} from 'lucide-react';

const FeesSummary = ({ fees }) => {
  // fees object backend ke 'feesSummary' se aa raha hai
  const { totalAmount, paidAmount, status, dueDate, paymentRisk } = fees || {};
  const remaining = totalAmount - paidAmount;

  const getStatusColor = () => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending Verification': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Partially Paid': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 mb-1">
            Financial Status
          </h3>
          <h2 className="text-2xl font-black text-slate-800 italic">Fee Summary</h2>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor()}`}>
          {status || 'No Record'}
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="bg-slate-900 rounded-[2rem] p-6 text-white mb-6 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Remaining</p>
          <h1 className="text-3xl font-black italic">₹{remaining.toLocaleString()}</h1>
          
          <div className="mt-4 flex items-center gap-2">
            <Clock size={14} className="text-rose-400" />
            <p className="text-[10px] font-bold">Due: {dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        
        {/* Decorative Icon */}
        <CreditCard className="absolute -right-4 -bottom-4 text-white/10 group-hover:rotate-12 transition-transform" size={100} />
      </div>

      {/* Breakdown List */}
      <div className="space-y-3 flex-grow">
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-[11px] font-bold text-slate-500">Paid Amount</span>
          <span className="text-sm font-black text-emerald-600">₹{paidAmount}</span>
        </div>

        {/* AI Risk Insight Card (Based on your Backend Logic) */}
        <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
          paymentRisk === 'High' ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'
        }`}>
          {paymentRisk === 'High' ? <AlertTriangle size={18} className="text-rose-500" /> : <CheckCircle size={18} className="text-indigo-500" />}
          <div>
            <p className="text-[9px] font-black uppercase text-slate-400">AI Risk Level</p>
            <p className={`text-[11px] font-black ${paymentRisk === 'High' ? 'text-rose-600' : 'text-indigo-600'}`}>
              {paymentRisk || 'Low'} Risk Status
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
        <FileText size={16} />
        View All Transactions
      </button>
    </motion.div>
  );
};

export default FeesSummary;
import React from 'react';
import { History, Download, ShieldCheck, Clock } from 'lucide-react';

const FeeReceipt = ({ transactions, onDownload }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-slate-800 italic flex items-center gap-2">
          <History size={20} className="text-indigo-500" /> Payment History
        </h3>
      </div>
      
      <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
        {transactions && transactions.length > 0 ? (
          transactions.map((t, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-indigo-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-700">₹{t.amount}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    {new Date(t.date).toLocaleDateString()} • {t.paymentMethod}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => onDownload(t.receiptId)}
                className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Download size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Clock className="mx-auto text-slate-200 mb-2" size={32} />
            <p className="text-xs font-bold text-slate-400 italic">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeReceipt;
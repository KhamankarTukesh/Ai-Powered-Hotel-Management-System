import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, AlertTriangle, ShieldCheck, History } from 'lucide-react';

const StudentFees = ({ feeData, onPay }) => {
  const [amount, setAmount] = useState('');
  const [transId, setTransId] = useState('');

  const statusColors = {
    Paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Unpaid: "bg-rose-50 text-rose-600 border-rose-100",
    "Partially Paid": "bg-amber-50 text-amber-600 border-amber-100",
    "Pending Verification": "bg-indigo-50 text-indigo-600 border-indigo-100"
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">Billing Overview</h3>
            <h2 className="text-3xl font-black text-slate-800 italic mb-6">Current Dues</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Total Payable</p>
                <p className="text-2xl font-black text-slate-800">₹{feeData?.totalAmount}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Paid Amount</p>
                <p className="text-2xl font-black text-emerald-500">₹{feeData?.paidAmount}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Remaining</p>
                <p className="text-2xl font-black text-rose-500">₹{feeData?.totalAmount - feeData?.paidAmount}</p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${statusColors[feeData?.status]}`}>
                {feeData?.status}
              </span>
              {feeData?.paymentRisk === 'High' && (
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase border bg-red-600 text-white animate-pulse">
                  AI Risk: Urgent
                </span>
              )}
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-slate-50 rounded-full -z-0 opacity-50" />
        </div>

        {/* Payment Action Box */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
          <h3 className="text-lg font-black italic mb-4">Quick Pay</h3>
          <div className="space-y-4">
            <input 
              type="number" 
              placeholder="Enter Amount"
              className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl outline-none font-bold text-sm focus:border-indigo-400"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="UPI/Bank Trans ID"
              className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl outline-none font-bold text-sm focus:border-indigo-400"
              value={transId}
              onChange={(e) => setTransId(e.target.value)}
            />
            <button 
              onClick={() => onPay(amount, transId)}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <CreditCard size={18} /> Submit Payment
            </button>
          </div>
          <p className="text-[9px] text-slate-500 mt-4 text-center font-bold">
            Warden verifies all transactions within 24 hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 italic mb-6">Charges Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-xs font-black text-slate-500 uppercase">Hostel Rent</span>
              <span className="font-bold text-slate-800">₹{feeData?.hostelRent}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-xs font-black text-slate-500 uppercase">Mess Charges</span>
              <span className="font-bold text-slate-800">₹{feeData?.messCharges}</span>
            </div>
            {feeData?.messCharges < 3000 && ( // Rebate check
               <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-black text-emerald-600 uppercase">Attendance Rebate Applied</span>
                  <span className="font-bold text-emerald-600">- Applied</span>
               </div>
            )}
          </div>
        </div>

        {/* Transaction History Preview */}
        <FeeReceipt transactions={feeData?.transactions} onDownload={id => window.open(`/api/fee/receipt/${id}`)} />
      </div>
    </div>
  );
};

export default StudentFees;
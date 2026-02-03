import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Download, ArrowLeft, Loader2, PieChart, ShieldCheck, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const WardenFeeActions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [stats, setStats] = useState({ totalStudents: 0, paidCount: 0, pendingCount: 0 });

useEffect(() => {
  const loadSummary = async () => {
    try {
      setFetching(true);
      const { data } = await API.get("/fee/analytics");

      // 1. Total Students: Sirf wo jinka record Warden ne banaya hai
      // (Rahul Sharma jaise students jinka status "Record Not Created" hai, wo count nahi honge)
      const activeRecords = data.filter(s => s.status !== "Record Not Created");

      // 2. Paid Count: Sirf wo jinhone pura paisa de diya hai
      const paid = activeRecords.filter(s => s.status === "Paid").length;

      // 3. Pending Dues: Isme 'Partially Paid', 'Unpaid', aur 'Pending Verification' teeno cover ho jayenge
      // Kyunki ye teeno status "Paid" ke barabar nahi hain (!== "Paid")
      const pending = activeRecords.filter(s => s.status !== "Paid").length;

      setStats({
        totalStudents: activeRecords.length, 
        paidCount: paid,
        pendingCount: pending
      });
    } catch (err) {
      console.error("Data sync error", err);
    } finally {
      setFetching(false);
    }
  };
  loadSummary();
}, []);
  // 2. CSV Export Logic
  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await API.get("/fee/export-fees", { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Hostel_Fee_Report_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Export failed. Please check server connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] p-6 md:p-12 font-display">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-400 hover:text-orange-600 font-bold transition-all"
          >
            <ArrowLeft size={20} /> Back to Hub
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">Export Center</h1>
            <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">Financial Intelligence</p>
          </div>
        </div>

        {/* 3. Visual Summary Cards - Data sourced from /fee/analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100 flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-500">
              <PieChart size={24}/>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Total Students</p>
              <p className="text-2xl font-black text-slate-800">{fetching ? "..." : stats.totalStudents}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100 flex items-center gap-4">
            <div className="bg-green-50 p-4 rounded-2xl text-green-500">
              <ShieldCheck size={24}/>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Cleared (Paid)</p>
              <p className="text-2xl font-black text-slate-800">{fetching ? "..." : stats.paidCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100 flex items-center gap-4">
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-500">
              <TrendingUp size={24}/>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Pending Dues</p>
              <p className="text-2xl font-black text-slate-800">{fetching ? "..." : stats.pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Main Export Card */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden border-b-8 border-orange-500">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="bg-orange-500 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-orange-500/40 transform -rotate-6">
              <FileSpreadsheet size={48} />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-white tracking-tight">Financial Master File</h2>
              <p className="text-slate-400 max-w-sm mx-auto font-medium text-sm leading-relaxed">
                Download the complete hostel ledger. Includes roll numbers, department-wise dues, and rebate history.
              </p>
            </div>

            <button
              onClick={handleExport}
              disabled={loading || fetching}
              className="group flex items-center gap-4 bg-orange-500 text-slate-900 px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-30"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <Download size={24} className="group-hover:bounce" />
              )}
              {loading ? "Generating CSV..." : "Download CSV Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenFeeActions;
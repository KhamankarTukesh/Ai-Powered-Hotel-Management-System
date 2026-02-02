import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle, XCircle, Clock, Search, ShieldCheck } from "lucide-react";
import API from "../../../api/axios";

const WardenVerifyPayments = () => {
  const [pendingFees, setPendingFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightId = queryParams.get("feeId");

  const fetchPendingData = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/fee/pending/verification");
      setPendingFees(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  const handleVerify = async (feeId, transactionId, action) => {
    setBtnLoading(transactionId);
    try {
      const { data } = await API.put("/fee/verify", { feeId, transactionId, action });
      alert(data.message);
      fetchPendingData();
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(null);
    }
  };

  const filteredData = pendingFees.filter((item) => {
    const name = item.fullName?.toLowerCase() || "";
    const roll = item.rollNumber?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || roll.includes(search);
  });

  return (
    <div className="bg-[#fffaf5] min-h-screen font-sans transition-colors duration-300 overflow-x-hidden">
      {/* Container: Strict mobile-first padding */}
      <main className="max-w-[1400px] mx-auto p-4 md:p-12 lg:p-20 flex flex-col gap-8 md:gap-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
          <div className="flex gap-4 md:gap-6 items-start w-full">
            <div className="w-1.5 md:w-2.5 h-16 md:h-24 bg-[#f97415] rounded-full shadow-lg shadow-orange-500/20"></div>
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-[#181411] leading-tight md:leading-none">
                Pending<br className="hidden md:block" /> Verifications
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex h-2 w-2 rounded-full bg-[#f97415] animate-pulse"></span>
                <p className="text-[#8c725f] text-[10px] md:text-sm font-bold uppercase tracking-widest">
                  {pendingFees.length} requests awaiting review
                </p>
              </div>
            </div>
          </div>
        </header>



        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f97415] border-r-4 border-r-transparent"></div>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredData.map((item) => {
              const isHighlighted = item.feeId === highlightId;
              
              return (
                <div
                  key={item.feeId}
                  className={`group relative bg-white rounded-[2rem] p-6 md:p-10 flex flex-col gap-6 md:gap-8 transition-all duration-500 hover:-translate-y-1 border-2 overflow-hidden ${
                    isHighlighted 
                    ? "border-[#f97415] shadow-lg" 
                    : "border-orange-50 shadow-sm"
                  }`}
                >
                  {/* Badge */}
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#f97415] text-[9px] font-black uppercase tracking-widest">
                      <span className="h-1 w-1 rounded-full bg-[#f97415]"></span>
                      Needs Review
                    </span>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <p className="text-[#8c725f] text-[9px] font-black uppercase tracking-[0.2em]">Student Name</p>
                      <h3 className="text-xl md:text-2xl font-black text-[#181411] tracking-tight truncate break-words">
                        {item.fullName}
                      </h3>
                      <p className="text-orange-500 text-[10px] font-bold tracking-widest uppercase">
                        {item.rollNumber} • {item.dept}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-[#8c725f] text-[9px] font-black uppercase tracking-[0.2em]">Amount</p>
                        <p className="text-xl font-black text-[#f97415]">₹{item.amountToVerify}</p>
                      </div>
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <p className="text-[#8c725f] text-[9px] font-black uppercase tracking-[0.2em]">Trans ID</p>
                        <p className="text-[11px] font-bold text-[#181411] font-mono bg-orange-50 px-2 py-1 rounded-lg truncate">
                          #{item.transactionId}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 col-span-2">
                        <p className="text-[#8c725f] text-[9px] font-black uppercase tracking-[0.2em]">Submitted On</p>
                        <p className="text-[11px] md:text-sm font-semibold text-[#181411]">
                          {item.submissionDate ? new Date(item.submissionDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Stacked nicely on tiny screens if needed, but flex-row works for 2 buttons */}
                  <div className="mt-auto pt-4 flex gap-3">
                    <button
                      onClick={() => handleVerify(item.feeId, item.transactionId, "Approve")}
                      disabled={btnLoading === item.transactionId}
                      className="flex-[3] h-14 md:h-16 bg-[#0f172a] hover:bg-black text-white rounded-2xl md:rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {btnLoading === item.transactionId ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                      ) : (
                        <>
                          <CheckCircle size={18} className="text-[#f97415]" />
                          <span className="font-black text-xs uppercase tracking-wider">Approve</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleVerify(item.feeId, item.transactionId, "Reject")}
                      className="flex-1 h-14 md:h-16 rounded-2xl md:rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all active:scale-95"
                    >
                      <XCircle size={22} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 md:py-32 bg-white rounded-[2rem] md:rounded-[4rem] border-2 md:border-4 border-dashed border-orange-100 mx-2">
            <div className="bg-orange-50 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
               <ShieldCheck className="text-orange-300" size={32} />
            </div>
            <h3 className="text-xl md:text-3xl font-black text-[#181411]">Everything's Verified</h3>
            <p className="text-[#8c725f] text-sm font-medium mt-2">No pending payments found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WardenVerifyPayments;
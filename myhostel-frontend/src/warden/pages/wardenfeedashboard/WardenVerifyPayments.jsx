import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Search,
  ShieldCheck
} from "lucide-react";
import API from "../../../api/axios";

const WardenVerifyPayments = () => {

  const [pendingFees, setPendingFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightId = queryParams.get("feeId");

  /* ================= FETCH DATA ================= */
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

  /* ================= VERIFY ACTION ================= */
  const handleVerify = async (feeId, transactionId, action) => {
    setBtnLoading(transactionId);

    try {
      const { data } = await API.put("/fee/verify", {
        feeId,
        transactionId,
        action
      });

      alert(data.message);
      fetchPendingData();

    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(null);
    }
  };

  /* ================= FILTER DATA ================= */
  const filteredData = pendingFees.filter((item) => {
    const name = item.fullName?.toLowerCase() || "";
    const roll = item.rollNumber?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return name.includes(search) || roll.includes(search);
  });

  return (
    <div className="bg-[#fffaf5] min-h-screen overflow-x-hidden">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 flex flex-col gap-8 md:gap-12">

        {/* ================= HEADER ================= */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">

          <div className="flex gap-4 items-start w-full">
            <div className="w-2 h-16 md:h-24 bg-[#f97415] rounded-full shadow-lg shadow-orange-500/20"></div>

            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-[#181411]">
                Pending
                <br className="hidden md:block" />
                Verifications
              </h1>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#f97415] rounded-full animate-pulse"></span>
                <p className="text-[#8c725f] text-[10px] sm:text-sm uppercase font-bold tracking-widest">
                  {pendingFees.length} requests awaiting review
                </p>
              </div>
            </div>
          </div>

          {/* ================= SEARCH ================= */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />

            <input
              type="text"
              placeholder="Search student..."
              className="w-full h-12 bg-white border border-orange-100 rounded-xl pl-12 pr-4 font-semibold outline-none focus:border-orange-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </header>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin h-12 w-12 border-t-4 border-[#f97415] border-r-4 border-r-transparent rounded-full"></div>
          </div>
        ) : filteredData.length > 0 ? (

          /* ================= CARD GRID ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">

            {filteredData.map((item) => {

              const isHighlighted = item.feeId === highlightId;

              return (
                <div
                  key={item.feeId}
                  className={`group bg-white rounded-3xl p-5 sm:p-7 md:p-9 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1 border-2 ${
                    isHighlighted
                      ? "border-[#f97415] shadow-lg"
                      : "border-orange-50 shadow-sm"
                  }`}
                >

                  {/* Badge */}
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#f97415] text-[9px] font-black uppercase tracking-widest">
                      <span className="h-1 w-1 bg-[#f97415] rounded-full"></span>
                      Needs Review
                    </span>
                  </div>

                  {/* Student Info */}
                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="text-[#8c725f] text-[9px] font-black uppercase tracking-[0.2em]">
                        Student Name
                      </p>

                      <h3 className="text-lg sm:text-xl md:text-2xl font-black truncate">
                        {item.fullName}
                      </h3>

                      <p className="text-orange-500 text-[10px] font-bold tracking-widest uppercase">
                        {item.rollNumber} • {item.dept}
                      </p>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-2 gap-4">

                      <div>
                        <p className="text-[#8c725f] text-[9px] font-black uppercase tracking-[0.2em]">
                          Amount
                        </p>

                        <p className="text-xl font-black text-[#f97415]">
                          ₹{item.amountToVerify}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#8c725f] text-[9px] font-black uppercase tracking-[0.2em]">
                          Trans ID
                        </p>

                        <p className="text-[11px] font-bold font-mono bg-orange-50 px-2 py-1 rounded-lg truncate">
                          #{item.transactionId}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-[#8c725f] text-[9px] font-black uppercase tracking-[0.2em]">
                          Submitted On
                        </p>

                        <p className="text-[11px] sm:text-sm font-semibold">
                          {item.submissionDate
                            ? new Date(item.submissionDate).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "N/A"}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3 mt-auto">

                    {/* Approve */}
                    <button
                      onClick={() =>
                        handleVerify(item.feeId, item.transactionId, "Approve")
                      }
                      disabled={btnLoading === item.transactionId}
                      className="flex-[3] h-12 sm:h-14 md:h-16 bg-[#0f172a] hover:bg-black text-white rounded-2xl md:rounded-full flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      {btnLoading === item.transactionId ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                      ) : (
                        <>
                          <CheckCircle size={18} className="text-[#f97415]" />
                          <span className="font-black text-xs uppercase tracking-wider">
                            Approve
                          </span>
                        </>
                      )}
                    </button>

                    {/* Reject */}
                    <button
                      onClick={() =>
                        handleVerify(item.feeId, item.transactionId, "Reject")
                      }
                      className="flex-1 h-12 sm:h-14 md:h-16 rounded-2xl md:rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      <XCircle size={22} />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (

          /* ================= EMPTY STATE ================= */
          <div className="text-center py-20 md:py-32 bg-white rounded-3xl md:rounded-[4rem] border-2 md:border-4 border-dashed border-orange-100">
            <div className="bg-orange-50 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-orange-300" size={32} />
            </div>

            <h3 className="text-xl md:text-3xl font-black text-[#181411]">
              Everything's Verified
            </h3>

            <p className="text-[#8c725f] text-sm mt-2">
              No pending payments found.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WardenVerifyPayments;

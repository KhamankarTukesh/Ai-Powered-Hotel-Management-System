import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Download,
  ArrowLeft,
  Loader2,
  PieChart,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../../api/axios";

const WardenFeeActions = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [stats, setStats] = useState({
    totalStudents: 0,
    paidCount: 0,
    pendingCount: 0
  });

  /* ---------------- FETCH ANALYTICS ---------------- */
  useEffect(() => {
    const loadSummary = async () => {
      try {
        setFetching(true);

        const { data } = await API.get("/fee/analytics");

        const activeRecords = data.filter(
          (s) => s.status !== "Record Not Created"
        );

        const paid = activeRecords.filter(
          (s) => s.status === "Paid"
        ).length;

        const pending = activeRecords.filter(
          (s) => s.status !== "Paid"
        ).length;

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

  /* ---------------- CSV EXPORT ---------------- */
  const handleExport = async () => {
    setLoading(true);

    try {
      const response = await API.get("/fee/export-fees", {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `Hostel_Fee_Report_${new Date().toLocaleDateString()}.csv`
      );

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
    <div className="min-h-screen bg-[#fffaf5] px-4 sm:px-6 md:px-12 py-8 font-display">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ---------------- HEADER ---------------- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-orange-600 font-bold transition-all"
          >
            <ArrowLeft size={20} />
            Back to Hub
          </button>

          <div className="text-left sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 italic tracking-tight">
              Export Center
            </h1>
            <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
              Financial Intelligence
            </p>
          </div>
        </div>

        {/* ---------------- SUMMARY CARDS ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Total Students */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100 flex items-center gap-4"
          >
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-500">
              <PieChart size={24} />
            </div>

            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">
                Total Students
              </p>

              <p className="text-2xl font-black text-slate-800">
                {fetching ? "..." : stats.totalStudents}
              </p>
            </div>
          </motion.div>

          {/* Paid */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100 flex items-center gap-4"
          >
            <div className="bg-green-50 p-4 rounded-2xl text-green-500">
              <ShieldCheck size={24} />
            </div>

            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">
                Cleared (Paid)
              </p>

              <p className="text-2xl font-black text-slate-800">
                {fetching ? "..." : stats.paidCount}
              </p>
            </div>
          </motion.div>

          {/* Pending */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100 flex items-center gap-4"
          >
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-500">
              <TrendingUp size={24} />
            </div>

            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">
                Pending Dues
              </p>

              <p className="text-2xl font-black text-slate-800">
                {fetching ? "..." : stats.pendingCount}
              </p>
            </div>
          </motion.div>

        </div>

        {/* ---------------- MAIN EXPORT CARD ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-slate-900
            rounded-[2.5rem]
            px-6 sm:px-10 md:px-16
            py-10 sm:py-14 md:py-16
            text-center
            shadow-2xl
            relative
            overflow-hidden
            border-b-8 border-orange-500
          "
        >
          {/* Background Glow */}
          <div className="absolute -top-16 -left-16 w-52 h-52 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-8">

            {/* Icon */}
            <div className="bg-orange-500 w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-orange-500/40 transform -rotate-6">
              <FileSpreadsheet size={42} />
            </div>

            {/* Text */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                Financial Master File
              </h2>

              <p className="text-slate-400 max-w-md mx-auto font-medium text-sm sm:text-base leading-relaxed">
                Download the complete hostel ledger including roll numbers,
                department-wise dues, and rebate history.
              </p>
            </div>

            {/* Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              disabled={loading || fetching}
              className="
                group
                flex items-center gap-4
                bg-orange-500 text-slate-900
                px-8 sm:px-12
                py-4 sm:py-6
                rounded-2xl
                font-black uppercase tracking-widest
                hover:scale-105 transition-all
                shadow-xl disabled:opacity-30
              "
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <Download size={24} />
              )}

              {loading ? "Generating CSV..." : "Download CSV Report"}
            </motion.button>

          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default WardenFeeActions;

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertTriangle, TrendingUp, X } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

// ✅ Lazy Component Imports (already correct)
const WardenDashboardHeader = lazy(() => import('./Cards/WardenDashboardHeader'));
const WardenComplaintCard = lazy(() => import('./Cards/WardenComplaintCard'));
const WardenAttendanceCard = lazy(() => import('./Cards/WardenAttendanceCard'));
const LeaveApprovalCard = lazy(() => import('./Cards/LeaveApprovalCard'));
const WardenRoomCard = lazy(() => import('./Cards/WardenRoomCard'));
const MessSummaryCard = lazy(() => import('./Cards/MessCard/MessSummaryCard'));
const MasterFeeCard = lazy(() => import('./Cards/FeeCards/MasterFeeCard'));
const NoticeActionCard = lazy(() => import('./Cards/NoticeCards/NoticeActionCard'));
const GatePassActionCard = lazy(() => import('./Cards/GatePassActionCard'));
const ActivityActionCard = lazy(() => import('./Cards/ActivityActionCard'));

// ✅ Cache config
const CACHE_KEY = 'warden_dashboard';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const WardenDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentHealthScore = useMemo(() => {
    if (!data) return 0;
    const attendance = parseFloat(data.attendanceStats?.attendancePercentage) || 0;
    const collection = parseFloat(data.financeStats?.collectionRate) || 0;
    const pendingComplaints = data.complaintStats?.pending || 0;
    const penalty = Math.min(pendingComplaints * 2, 20);
    return Math.round((attendance * 0.4) + (collection * 0.4) + (20 - penalty));
  }, [data]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!localStorage.getItem('token')) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        // ✅ Fix 1: Check cache first — back button will be instant
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;
          if (!isExpired) {
            setData(cachedData);
            setLoading(false);
            return; // No API call needed!
          }
        }

        // Cache miss or expired — fetch fresh
        setLoading(true);
        const res = await API.get('/warden/dashboard-summary');
        setData(res.data);

        // ✅ Fix 2: Save to cache with timestamp
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: res.data, timestamp: Date.now() })
        );

      } catch (err) {
        // ✅ Fix 3: Show stale cache on error instead of blank screen
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data: cachedData } = JSON.parse(cached);
          setData(cachedData);
        } else if (err.response?.status !== 401) {
          setError("Server connection failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleFetchAIAnalysis = async () => {
    try {
      setAiLoading(true);
      const response = await API.get('/warden/dashboard-ai-insight');
      const updatedData = { ...data, aiAnalysis: response.data.aiAnalysis };
      setData(updatedData);

      // ✅ Fix 4: Update cache with AI analysis too
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: updatedData, timestamp: Date.now() })
      );

      toast.success("AI Insights Updated");
    } catch (err) {
      toast.error("AI Service Unavailable");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fffaf5] z-[200]">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Data...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffaf5] p-6">
      <div className="max-w-md w-full text-center p-10 bg-white rounded-[2rem] shadow-2xl border border-red-50">
        <AlertTriangle className="text-red-500 mx-auto mb-6" size={60} />
        <h2 className="text-xl font-black text-slate-800 mb-2">Sync Error</h2>
        <p className="text-slate-500 text-sm mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold active:scale-95 transition-all"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fffaf5] z-[200]">
          <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
            Loading Dashboard...
          </p>
        </div>
      }
    >
      <div className="relative min-h-screen w-full bg-[#fffaf5] selection:bg-orange-100">
        <div className="fixed inset-0 bg-[#fffaf5] -z-10" />

        <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-8">

          {/* Header */}
          <div className="mb-8">
            <WardenDashboardHeader profileStats={data?.profileStats} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <WardenRoomCard roomStats={data?.roomStats} />
            <WardenAttendanceCard attendanceStats={data?.attendanceStats} />
            <WardenComplaintCard complaintStats={data?.complaintStats} />
            <LeaveApprovalCard
              pendingCount={data?.leaveStats?.pendingCount || 0}
              onClick={() => navigate('/warden/leave')}
            />
            <MessSummaryCard messStats={data?.messStats} />
            <MasterFeeCard financeStats={data?.financeStats} />
            <NoticeActionCard latestNotice={data?.latestNotice} />
            <GatePassActionCard gatepassStats={data?.gatepassStats} />
            <ActivityActionCard activityStats={data?.activityStats} />
          </div>

          {/* AI Insight Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-10">
              {/* Icon */}
              <div className={`shrink-0 p-5 rounded-3xl text-white ${aiLoading ? 'bg-slate-800 animate-pulse' : 'bg-white/20 backdrop-blur-md'}`}>
                {aiLoading ? <Loader2 size={32} className="animate-spin" /> : <Sparkles size={32} />}
              </div>

              {/* Text */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-orange-100 font-black uppercase tracking-[0.3em] text-[10px] mb-3">
                  Hostel Intelligence
                </h3>

                {!data?.aiAnalysis && !aiLoading ? (
                  <button
                    onClick={handleFetchAIAnalysis}
                    className="group flex items-center gap-3 bg-white/10 hover:bg-white/30 text-white px-6 sm:px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all mx-auto lg:mx-0"
                  >
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                    Generate Daily Insight
                  </button>
                ) : (
                  <div className="relative">
                    <div className="text-slate-100 text-sm sm:text-base font-medium leading-relaxed italic max-w-3xl break-words">
                      {aiLoading ? "Analyzing metrics..." : data.aiAnalysis}
                    </div>
                    {data?.aiAnalysis && (
                      <button
                        onClick={() => setData({ ...data, aiAnalysis: null })}
                        className="absolute -top-2 -right-2 text-slate-300 hover:text-white p-2 rounded-full bg-white/10 backdrop-blur-sm transition-all"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Health Score */}
              <div className="hidden lg:flex flex-col items-end border-l border-white/20 pl-10 shrink-0">
                <p className="text-white/70 text-[10px] font-black uppercase mb-2">Operating Health</p>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className={currentHealthScore > 60 ? "text-green-400" : "text-amber-400"} size={24} />
                  <span className="text-3xl sm:text-4xl font-black text-white italic">{currentHealthScore}%</span>
                </div>
                <div className="w-36 sm:w-40 bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentHealthScore}%` }}
                    className={`h-full ${currentHealthScore > 60 ? 'bg-green-400' : 'bg-amber-400'} rounded-full transition-all`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </Suspense>
  );
};

export default WardenDashboard;
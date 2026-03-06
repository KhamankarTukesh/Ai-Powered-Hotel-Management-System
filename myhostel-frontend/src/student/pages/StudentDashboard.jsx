import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// ✅ Fix 1: Lazy load all cards — they only load when needed
const AccommodationCard = lazy(() => import("../Cards/AccommodationCard"));
const AttendanceCard = lazy(() => import("../Cards/AttendanceCard"));
const MessCard = lazy(() => import("../Cards/MessCard"));
const FeesCard = lazy(() => import("../Cards/FeesCard"));
const GatePassCard = lazy(() => import("../Cards/GatePassCard"));
const ActionGrid = lazy(() => import("../Cards/ActionGrid"));
const NoticeCard = lazy(() => import("../Cards/NoticeCard"));

// ✅ Fix 2: Cache key and duration
const CACHE_KEY = "student_summary";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ✅ Fix 3: Small reusable card skeleton
const CardSkeleton = () => (
  <div className="bg-orange-50 rounded-2xl h-40 animate-pulse border border-orange-100" />
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // ✅ Fix 4: Check cache before making API call
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;

          if (!isExpired) {
            // Cache valid hai — no API call needed!
            setSummary(data);
            setLoading(false);
            return;
          }
        }

        // Cache miss or expired — fetch fresh data
        const res = await API.get("/users/summary");
        setSummary(res.data);

        // ✅ Fix 5: Save to cache with timestamp
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: res.data, timestamp: Date.now() })
        );

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);

        // ✅ Fix 6: If API fails, still show stale cache rather than blank screen
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          setSummary(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  /* ---------------- Loading Screen ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7]">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 sm:h-16 sm:w-16 border-t-4 border-orange-500 border-opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 sm:h-4 sm:w-4 bg-orange-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBF7] min-h-screen text-slate-700 selection:bg-orange-500 selection:text-white pb-10 sm:pb-12 font-['Inter']">
      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 lg:pt-14">

        {/* ---------------- Header Section ---------------- */}
        <div className="mb-8 sm:mb-10 lg:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">

          {/* Greeting */}
          <div className="relative group max-w-2xl">
            <div className="absolute -left-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 bg-orange-200/30 rounded-full blur-3xl group-hover:bg-orange-400/20 transition-all duration-700"></div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight mb-2 sm:mb-3 cursor-pointer leading-tight"
              onClick={() => navigate("/student/profile")}
            >
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                {new Date().getHours() < 12 ? "Good Morning," : "Welcome Back,"}
              </span>
              <br />
              <span className="hover:text-orange-600 transition-colors duration-300">
                {summary?.profile?.name || "Student"} ✨
              </span>
            </h1>

            <div className="flex items-center gap-3">
              <div className="h-[2px] w-10 sm:w-12 bg-orange-500 rounded-full"></div>
              <p className="text-slate-500 text-sm sm:text-base md:text-lg font-semibold italic">
                Your hostel life,{" "}
                <span className="text-orange-500">simplified.</span>
              </p>
            </div>
          </div>

          {/* System Badge */}
          <div className="flex items-center gap-4 bg-orange-50/80 backdrop-blur-md border border-orange-100 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-orange-100 transition-all duration-300 w-fit">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20"></div>
              <div className="bg-orange-500 text-white p-2 rounded-full relative">
                <span className="material-symbols-outlined text-lg sm:text-xl">bolt</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] leading-none mb-1">
                Status
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-700">System Live</p>
            </div>
          </div>
        </div>

        {/* ---------------- Dashboard Grid ---------------- */}
        {/* ✅ Fix 7: Suspense wraps lazy cards with skeleton fallback */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            <AccommodationCard profile={summary?.profile} />
            <AttendanceCard attendance={summary?.attendance} />
            <MessCard mess={summary?.mess} />
            <FeesCard fees={summary?.fees} />
            <GatePassCard gatepass={summary?.gatepass} />
            <ActionGrid summary={summary} />
            <div className="sm:col-span-2 xl:col-span-4">
              <NoticeCard notice={summary?.notice} />
            </div>
          </div>
        </Suspense>

      </main>
    </div>
  );
};

export default StudentDashboard;
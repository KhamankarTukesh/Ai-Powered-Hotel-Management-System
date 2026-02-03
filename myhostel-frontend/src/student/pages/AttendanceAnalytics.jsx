import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const AttendanceAnalytics = () => {
    const [stats, setStats] = useState({
        totalDays: 0,
        presentDays: 0,
        percentage: "0.00",
        status: "Low",
        todayCheckIn: { recorded: false }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await API.get('/attendance/my-stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    // Gauge Chart Calculation (264 is the full dasharray in your SVG)
    const percentageValue = parseFloat(stats.percentage) || 0;
    const dashOffset = 264 - (264 * percentageValue) / 100;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
            <main className="max-w-[1024px] mx-auto py-8 px-4 flex flex-col gap-8">
                {/* Heading */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E293B]">Attendance Analytics</h1>
                        <p className="text-slate-500">Overview for Current Semester</p>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Gauge Chart Section */}
                    <div className="lg:col-span-8 bg-[#FFF7ED] rounded-3xl p-10 flex flex-col items-center relative overflow-hidden border border-orange-100 shadow-sm">
                        <div className="flex justify-between w-full mb-8">
                            <h3 className="text-lg font-bold text-[#431407]">Monthly Trend</h3>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-green-600 flex items-center gap-1 shadow-sm">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +2.4%
                            </span>
                        </div>

                        {/* Animated SVG Gauge */}
                        <div className="relative size-64 flex items-center justify-center">
                            <svg className="size-full rotate-[135deg]" viewBox="0 0 100 100">
                                <circle 
                                    className="text-orange-100" 
                                    cx="50" cy="50" r="42" 
                                    fill="transparent" 
                                    stroke="currentColor" 
                                    strokeWidth="8" 
                                />
                                <circle 
                                    className="text-[#0df233] transition-all duration-1000 ease-out" 
                                    cx="50" cy="50" r="42" 
                                    fill="transparent" 
                                    stroke="currentColor" 
                                    strokeWidth="8" 
                                    strokeDasharray="264" 
                                    strokeDashoffset={dashOffset} 
                                    strokeLinecap="round" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                                <span className="text-6xl font-black text-[#1E293B]">
                                    {stats.percentage}
                                    <span className="text-2xl text-slate-400">%</span>
                                </span>
                                <span className="text-sm font-medium text-slate-500">Overall Score</span>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <div className="flex items-baseline gap-2 justify-center">
                                <span className="text-3xl font-bold text-[#1E293B]">{stats.presentDays}</span>
                                <span className="text-xl text-slate-400">/ {stats.totalDays} Days</span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Recorded Attendance</p>
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        {/* Status Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className={`size-10 rounded-full flex items-center justify-center mb-4 ${
                                stats.status === 'Good' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                                <span className="material-symbols-outlined">
                                    {stats.status === 'Good' ? 'verified_user' : 'report'}
                                </span>
                            </div>
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-[#1E293B]">
                                    {stats.status === 'Good' ? 'Good Standing' : 'Low Attendance'}
                                </span>
                                <div className={`size-3 rounded-full animate-pulse ${
                                    stats.status === 'Good' ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ring-1 ${
                                    percentageValue >= 75 
                                    ? 'bg-green-50 text-green-700 ring-green-200' 
                                    : 'bg-red-50 text-red-700 ring-red-200'
                                }`}>
                                    {percentageValue >= 75 ? 'Eligible for Leave' : 'Not Eligible'}
                                </span>
                            </div>
                        </div>

                        {/* Daily Mess Entry Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className={`size-10 rounded-full flex items-center justify-center mb-4 ${
                                stats.todayCheckIn?.recorded ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                                <span className="material-symbols-outlined">
                                    {stats.todayCheckIn?.recorded ? 'fact_check' : 'hourglass_empty'}
                                </span>
                            </div>
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Today's Entry</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-[#1E293B]">
                                    {stats.todayCheckIn?.recorded ? 'Recorded' : 'Pending'}
                                </span>
                                {stats.todayCheckIn?.recorded ? (
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                ) : (
                                    <span className="material-symbols-outlined text-slate-300 animate-spin">sync</span>
                                )}
                            </div>
                            {stats.todayCheckIn?.recorded && (
                                <p className="text-[11px] text-slate-400 mt-2">
                                    Mess activity synced successfully.
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AttendanceAnalytics;
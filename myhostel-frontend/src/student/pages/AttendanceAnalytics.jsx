import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const AttendanceAnalytics = () => {
    const [stats, setStats] = useState({
        totalDays: 0,
        presentDays: 0,
        percentage: "0.00",
        status: "Low"
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
    const dashOffset = 264 - (264 * parseFloat(stats.percentage)) / 100;

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900">

            <main className="max-w-[1024px] mx-auto py-8 px-4 flex flex-col gap-8">
                {/* Heading */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Attendance Analytics</h1>
                        <p className="text-slate-500">Overview for Current Semester</p>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Gauge Chart Section */}
                    <div className="lg:col-span-8 bg-[#FFF7ED] rounded-2xl p-10 flex flex-col items-center relative overflow-hidden border border-orange-100">
                        <div className="flex justify-between w-full mb-8">
                            <h3 className="text-lg font-bold">Monthly Trend</h3>
                            <span className="bg-white px-2 py-1 rounded-full text-xs font-bold text-green-600 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +2.4%
                            </span>
                        </div>

                        {/* Animated SVG Gauge */}
                        <div className="relative size-64 flex items-center justify-center">
                            <svg className="size-full rotate-[135deg]" viewBox="0 0 100 100">
                                <circle className="text-orange-200" cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" strokeWidth="8" />
                                <circle 
                                    className="text-[#0df233] transition-all duration-1000 ease-out" 
                                    cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" strokeWidth="8" 
                                    strokeDasharray="264" 
                                    strokeDashoffset={dashOffset} 
                                    strokeLinecap="round" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                                <span className="text-6xl font-black">{stats.percentage}<span className="text-2xl text-slate-400">%</span></span>
                                <span className="text-sm font-medium text-slate-500">Overall Score</span>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <div className="flex items-baseline gap-2 justify-center">
                                <span className="text-3xl font-bold">{stats.presentDays}</span>
                                <span className="text-xl text-slate-400">/ {stats.totalDays} Days</span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Recorded Attendance</p>
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Residency Card */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4">
                                <span className="material-symbols-outlined">verified_user</span>
                            </div>
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold">{stats.status === 'Good' ? 'Good Standing' : 'Low Attendance'}</span>
                                <div className={`size-3 rounded-full ${stats.status === 'Good' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold ring-1 ring-green-200">
                                    {stats.percentage >= 75 ? 'Eligible' : 'Not Eligible'}
                                </span>
                            </div>
                        </div>

                        {/* Daily Check-in Card */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-4">
                                <span className="material-symbols-outlined">fact_check</span>
                            </div>
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Today's Entry</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold">Recorded</span>
                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AttendanceAnalytics;
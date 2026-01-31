import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

// Importing Modular Components
import AccommodationCard from '../Cards/AccommodationCard';
import AttendanceCard from '../Cards/AttendanceCard';
import MessCard from '../Cards/MessCard';
import FeesCard from '../Cards/FeesCard';
import GatePassCard from '../Cards/GatePassCard';
import ActionGrid from '../Cards/ActionGrid'; 
import NoticeCard from '../Cards/NoticeCard';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await API.get('/users/summary');
                setSummary(res.data);
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 bg-orange-600 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FFFBF7] text-slate-body min-h-screen selection:bg-orange-500 selection:text-white pb-12 font-['Inter']">
            <main className="w-full max-w-[1500px] mx-auto px-6 pt-12 md:pt-16 lg:px-12">

                {/* 1. Header Section */}
                <div className="mb-10 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                    <div className="relative group">
                        <div className="absolute -left-4 -top-4 w-24 h-24 bg-orange-200/30 rounded-full blur-3xl group-hover:bg-orange-400/20 transition-all duration-700"></div>
                        
                        <h1 
                            className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight mb-3 cursor-pointer relative"
                            onClick={() => navigate('/student/profile')}
                        >
                            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent animate-gradient-x">
                                {new Date().getHours() < 12 ? 'Good Morning,' : 'Welcome back,'}
                            </span>
                            <br />
                            <span className="hover:text-orange-600 transition-colors duration-300">
                                {summary?.profile?.name || "Student"} ✨
                            </span>
                        </h1>
                        
                        <div className="flex items-center gap-3">
                            <div className="h-[2px] w-12 bg-orange-500 rounded-full"></div>
                            <p className="text-slate-500 text-lg font-semibold italic">
                                Your hostel life, <span className="text-orange-500">simplified.</span>
                            </p>
                        </div>
                    </div>

                    {/* System Live Badge */}
                    <div className="flex items-center gap-4 bg-orange-50/80 backdrop-blur-md border border-orange-100 p-4 rounded-3xl shadow-sm hover:shadow-orange-100 transition-all duration-300">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20"></div>
                            <div className="bg-orange-500 text-white p-2 rounded-full relative">
                                <span className="material-symbols-outlined text-xl">bolt</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] leading-none mb-1">Status</p>
                            <p className="text-sm font-bold text-slate-700">System Live</p>
                        </div>
                    </div>
                </div>

                {/* 2. Main Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    
                    <AccommodationCard profile={summary?.profile} />
                    
                    <AttendanceCard attendance={summary?.attendance} />
                    
                    <MessCard mess={summary?.mess} />
                    
                    <FeesCard fees={summary?.fees} />
                    
                    <GatePassCard gatepass={summary?.gatepass} />
                    
                    <ActionGrid summary={summary} />
                    
                    <div className="md:col-span-2 xl:col-span-4">
                        <NoticeCard notice={summary?.notice} />
                    </div>

                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
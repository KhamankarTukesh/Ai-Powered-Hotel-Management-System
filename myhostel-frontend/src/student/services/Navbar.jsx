import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const Navbar = ({ profile }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Axios Instance use karein ya direct call
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // 1. Unread Count Fetch karein
            // DHAYAN DEIN: URL wahi rakhein jo backend mein define hai
            const { data: countData } = await API.get('/notifications/unread-count', config);
            setUnreadCount(countData.unreadCount);

            // 2. Sari Notifications Fetch karein
            const { data: notifData } = await API.get('/notifications', config);
            setNotifications(notifData);

        } catch (err) {
            console.error("Axios Error:", err.response?.data || err.message);
        }
    };
    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Backend ke PUT route ko call kar rahe hain
            await API.put(`/notifications/${id}/read`, {}, config);

            // State update karein taaki UI se dot turant hat jaye
            fetchNotifications();
        } catch (err) {
            console.error("Mark as read error:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:px-8">
            <div className="max-w-[1500px] mx-auto">
                {/* Main Glass Container - Increased Orange Tint & Border */}
                <div className="bg-orange-50/60 backdrop-blur-2xl border border-orange-200/50 shadow-[0_10px_40px_-10px_rgba(255,145,77,0.2)] rounded-[2.5rem] px-5 py-2.5 flex items-center justify-between transition-all duration-500">

                    {/* 1. Logo Section - Customized for Dnyanda */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/dashboard')}
                    >
                        {/* Logo Container with Dark Orange Glow */}
                        <div className="relative size-12 flex items-center justify-center">
                            {/* The Outer Glow Effect */}
                            <div className="absolute inset-0 bg-orange-600 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

                            {/* Logo Box */}
                            <div className="relative z-10 size-full bg-[#E33E33] rounded-2xl flex items-center justify-center shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_8px_20px_rgba(227,62,51,0.3)] group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500 overflow-hidden">
                                {/* Using an icon that mimics your mountain logo or you can use your <img> tag here */}
                                <span className="material-symbols-outlined text-white text-3xl font-bold">landscape</span>

                                {/* Shine Animation across the logo */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>
                        </div>

                        {/* Brand Text */}
                        <div className="flex flex-col">
                            <span className="text-2xl font-[1000] text-slate-800 tracking-tighter leading-none">
                                DNYANDA
                            </span>
                            <span className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em] mt-1">
                                Beijing & Lanfor
                            </span>
                        </div>
                    </div>

                    {/* 2. Desktop Actions */}
                    <div className="flex items-center gap-2 md:gap-4">

                        {/* Notification Section */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="relative size-11 flex items-center justify-center rounded-2xl text-slate-600 bg-white/50 border border-orange-100 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-2xl">notifications</span>

                                {/* 🟠 Orange Dot - Jab unreadCount > 0 ho tabhi dikhega */}
                                {unreadCount > 0 && (
                                    <span className="absolute top-2.5 right-2.5 size-2.5 bg-orange-600 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {isNotifOpen && (
                                <>
                                    {/* Background Overlay: Click karne par dropdown band ho jaye */}
                                    <div className="fixed inset-0 z-0" onClick={() => setIsNotifOpen(false)}></div>

                                    <div className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-3xl border border-orange-100 rounded-[2rem] shadow-2xl p-4 z-50 animate-in fade-in zoom-in slide-in-from-top-4 duration-300 origin-top-right">
                                        <div className="flex justify-between items-center mb-4 px-2">
                                            <h3 className="font-[1000] text-slate-800 text-sm">NOTIFICATIONS</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold uppercase">
                                                    {unreadCount} New
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                            {notifications.length > 0 ? (
                                                notifications.map((n) => (
                                                    <div
                                                        key={n._id}
                                                        onClick={() => handleMarkAsRead(n._id)}
                                                        className={`group p-3 rounded-2xl text-xs transition-all duration-300 cursor-pointer ${n.isRead
                                                                ? 'bg-slate-50 text-slate-400 opacity-70'
                                                                : 'bg-orange-50 text-slate-800 border-l-4 border-orange-500 font-bold shadow-sm'
                                                            } hover:scale-[1.02] active:scale-95`}
                                                    >
                                                        <div className="flex justify-between items-start gap-2">
                                                            <span>{n.message}</span>
                                                            {!n.isRead && <div className="size-2 rounded-full bg-orange-500 mt-1 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>}
                                                        </div>
                                                        <p className="text-[9px] mt-1.5 opacity-60 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[10px]">schedule</span>
                                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center">
                                                    <span className="material-symbols-outlined text-slate-200 text-4xl mb-2">notifications_off</span>
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No New Alerts</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 3. Profile Section */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 pr-3 bg-white/80 border border-orange-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="size-9 rounded-xl overflow-hidden border-2 border-orange-100 group-hover:border-orange-500 transition-colors">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || 'Student'}`}
                                        alt="User"
                                        className="w-full h-full object-cover bg-orange-50"
                                    />
                                </div>
                                <span className={`material-symbols-outlined text-orange-600 text-xl transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                            </button>

                            {/* 4. Luxury Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-0" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-3xl border border-orange-100 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(249,115,22,0.3)] p-5 z-10 animate-in fade-in zoom-in slide-in-from-top-4 duration-300 origin-top-right">

                                        {/* User Info Header */}
                                        <div className="flex items-center gap-4 p-4 mb-4 bg-gradient-to-br from-orange-50 to-white rounded-3xl border border-orange-100">
                                            <div className="size-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white text-xl font-black shadow-orange-200 shadow-lg">
                                                {/* Bahubali ka 'B' yahan dikhega */}
                                                {(profile?.profile?.fullName || profile?.fullName || 'S').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-[1000] text-slate-800 truncate">
                                                    {profile?.profile?.fullName || profile?.fullName || "Student Name"}
                                                </p>
                                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-tight truncate">
                                                    {profile?.profile?.email || profile?.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-1.5 px-1">
                                            <button
                                                onClick={() => { navigate('/student/profile'); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-slate-600 hover:bg-orange-600 hover:text-white hover:shadow-glow transition-all duration-300 group/item"
                                            >
                                                <div className="size-9 rounded-xl bg-orange-100 text-orange-600 group-hover/item:bg-white/20 group-hover/item:text-white flex items-center justify-center transition-colors">
                                                    <span className="material-symbols-outlined text-xl">person_edit</span>
                                                </div>
                                                <span className="text-sm font-bold">Manage Profile</span>
                                            </button>

                                            <button
                                                onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 group/item"
                                            >
                                                <div className="size-9 rounded-xl bg-slate-100 text-slate-500 group-hover/item:bg-white/20 group-hover/item:text-white flex items-center justify-center transition-colors">
                                                    <span className="material-symbols-outlined text-xl">settings</span>
                                                </div>
                                                <span className="text-sm font-bold">Settings</span>
                                            </button>

                                            <div className="h-[1px] bg-orange-100/50 my-3 mx-2"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group/item"
                                            >
                                                <div className="size-9 rounded-xl bg-red-50 text-red-500 group-hover/item:bg-white/20 group-hover/item:text-white flex items-center justify-center transition-colors">
                                                    <span className="material-symbols-outlined text-xl">power_settings_new</span>
                                                </div>
                                                <span className="text-sm font-black uppercase tracking-widest">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
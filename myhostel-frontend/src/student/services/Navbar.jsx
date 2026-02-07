import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const Navbar = ({ profile }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // NEW: Clock State to fill the empty space in the center
    const [currentTime, setCurrentTime] = useState(new Date());

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const { data: countData } = await API.get('/notifications/unread-count', config);
            setUnreadCount(countData.unreadCount);

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

            await API.put(`/notifications/${id}/read`, {}, config);
            fetchNotifications();
        } catch (err) {
            console.error("Mark as read error:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        
        // NEW: Clock Interval updates every second
        const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
            clearInterval(interval);
            clearInterval(clockInterval);
        };
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100]">
            <div className="w-full">
                {/* Main Navbar Container */}
                <div className="bg-orange-50/60 backdrop-blur-2xl border-b border-orange-200/50 shadow-[0_10px_40px_-10px_rgba(255,145,77,0.2)] px-4 py-5 md:px-10 flex items-center justify-between transition-all duration-500">
                    
                    {/* LEFT: LOGO SECTION */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group shrink-0"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="relative size-10 md:size-12 flex items-center justify-center">
                            <div className="absolute inset-0 bg-orange-600 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="relative z-10 size-full bg-[#E33E33] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500">
                                <span className="material-symbols-outlined text-white text-2xl md:text-3xl font-bold">landscape</span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-[1000] text-slate-800 tracking-tighter leading-none">
                                DNYANDA
                            </span>
                            <span className="hidden sm:block text-[9px] font-black text-orange-600 uppercase tracking-[0.2em] mt-1">
                                Beijing & Lanfor
                            </span>
                        </div>
                    </div>

                    {/* CENTER: DYNAMIC CLOCK & STATUS PILL (Solves the "Empty" look) */}
                    <div className="hidden lg:flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 bg-white/50 px-4 py-1.5 rounded-full border border-orange-100 shadow-sm">
                            <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Hostel Live</span>
                            <div className="w-[1px] h-3 bg-orange-200 mx-1"></div>
                            <span className="text-xs font-black text-slate-800 tracking-tight">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                            {currentTime.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>

                    {/* RIGHT: ACTIONS SECTION */}
                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        {/* NOTIFICATION BELL */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="relative size-9 md:size-11 flex items-center justify-center rounded-xl md:rounded-2xl text-slate-600 bg-white/50 border border-orange-100 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-xl md:text-2xl">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 size-2 md:size-2.5 bg-orange-600 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>

                            {isNotifOpen && (
                                <>
                                    <div className="fixed inset-0 z-0" onClick={() => setIsNotifOpen(false)}></div>
                                    <div className="absolute right-0 mt-4 w-72 md:w-80 bg-white/95 backdrop-blur-3xl border border-orange-100 rounded-[2rem] shadow-2xl p-4 z-50 animate-in fade-in zoom-in slide-in-from-top-4 duration-300 origin-top-right">
                                        <div className="flex justify-between items-center mb-4 px-2">
                                            <h3 className="font-[1000] text-slate-800 text-sm">NOTIFICATIONS</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold uppercase">{unreadCount} New</span>
                                            )}
                                        </div>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                            {notifications.length > 0 ? (
                                                notifications.map((n) => (
                                                    <div key={n._id} onClick={() => handleMarkAsRead(n._id)} className={`p-3 rounded-2xl text-xs transition-all cursor-pointer ${n.isRead ? 'bg-slate-50 opacity-70' : 'bg-orange-50 border-l-4 border-orange-500 font-bold shadow-sm'}`}>
                                                        <div className="flex justify-between items-start gap-2">
                                                            <span>{n.message}</span>
                                                            {!n.isRead && <div className="size-2 rounded-full bg-orange-500 mt-1"></div>}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">No New Alerts</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* DESKTOP PROFILE BUTTON */}
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1.5 pr-4 bg-white/80 border border-orange-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="size-9 rounded-xl overflow-hidden border-2 border-orange-100 group-hover:border-orange-500 shadow-sm transition-all">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || 'Student'}`} alt="User" className="w-full h-full object-cover bg-orange-50" />
                                </div>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="text-[11px] font-[1000] text-slate-800 uppercase">
                                        {profile?.profile?.fullName?.split(' ')[0] || "User"}
                                    </span>
                                    <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Online</span>
                                </div>
                                <span className={`material-symbols-outlined text-orange-600 text-xl transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                            </button>

                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-0" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-3xl border border-orange-100 rounded-[2.5rem] shadow-xl p-5 z-10 animate-in fade-in zoom-in slide-in-from-top-4 duration-300 origin-top-right">
                                        <div className="flex items-center gap-4 p-4 mb-4 bg-orange-50 rounded-3xl border border-orange-100">
                                            <div className="size-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                                                {(profile?.profile?.fullName || profile?.fullName || 'S').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-[1000] text-slate-800 truncate">{profile?.profile?.fullName || profile?.fullName || "User"}</p>
                                                <p className="text-[10px] font-bold text-orange-500 uppercase truncate">{profile?.profile?.email || profile?.email}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <button onClick={() => { navigate('/student/profile'); setIsProfileOpen(false); }} className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-slate-600 hover:bg-orange-600 hover:text-white transition-all group/item">
                                                <div className="size-9 rounded-xl bg-orange-100 text-orange-600 group-hover/item:bg-white/20 group-hover/item:text-white flex items-center justify-center"><span className="material-symbols-outlined text-xl">person_edit</span></div>
                                                <span className="text-sm font-bold">Manage Profile</span>
                                            </button>
                                            <button onClick={() => { navigate('/settings'); setIsProfileOpen(false); }} className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all group/item">
                                                <div className="size-9 rounded-xl bg-slate-100 text-slate-500 group-hover/item:bg-white/20 group-hover/item:text-white flex items-center justify-center"><span className="material-symbols-outlined text-xl">settings</span></div>
                                                <span className="text-sm font-bold">Settings</span>
                                            </button>
                                            <div className="h-[1px] bg-orange-100/50 my-3 mx-2"></div>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all group/item">
                                                <div className="size-9 rounded-xl bg-red-50 text-red-500 group-hover/item:bg-white/20 group-hover/item:text-white flex items-center justify-center"><span className="material-symbols-outlined text-xl">power_settings_new</span></div>
                                                <span className="text-sm font-black uppercase tracking-widest">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* MOBILE HAMBURGER MENU */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden size-9 flex items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg active:scale-90 transition-all"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE SIDEBAR MENU OVERLAY */}
            {isMobileMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-white z-[120] shadow-2xl animate-in slide-in-from-right duration-300 p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-black text-slate-800 tracking-tighter">MENU</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="size-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* User Profile Info in Mobile Menu */}
                        <div className="flex items-center gap-4 p-4 mb-6 bg-orange-50 rounded-3xl border border-orange-100">
                            <div className="size-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white text-xl font-black">
                                {(profile?.profile?.fullName || profile?.fullName || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-[1000] text-slate-800 truncate">{profile?.profile?.fullName || profile?.fullName || "User"}</p>
                                <p className="text-[10px] font-bold text-orange-500 uppercase truncate">{profile?.profile?.email || profile?.email}</p>
                            </div>
                        </div>

                        {/* Mobile Links */}
                        <div className="space-y-3">
                            <button onClick={() => { navigate('/student/profile'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-600 hover:bg-orange-600 hover:text-white transition-all group">
                                <span className="material-symbols-outlined">person_edit</span>
                                <span className="font-bold">Manage Profile</span>
                            </button>
                            <button onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                                <span className="material-symbols-outlined">settings</span>
                                <span className="font-bold">Settings</span>
                            </button>
                            <div className="h-[1px] bg-slate-100 my-4"></div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 bg-red-50 font-black uppercase tracking-widest transition-all">
                                <span className="material-symbols-outlined">power_settings_new</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
    Phone, Shield, ClipboardList, GraduationCap,
    ArrowRight, Bookmark
} from 'lucide-react';

// ── 4 alag files se import ──
import EmergencyPage from './emergency';
import RulesPage from './rules';
import LeavePage from './leave';
import CalendarPage from './calendar';

const hubCards = [
    { id: 'emergency', icon: Phone,         title: 'Emergency Contacts', desc: 'Warden, security, medical — all numbers in one place',  color: 'from-red-500 to-rose-400',     bg: 'bg-red-50',    border: 'border-red-100',    tag: '24/7 Available' },
    { id: 'rules',     icon: Shield,        title: 'Hostel Rules',       desc: 'Entry timings, conduct, mess & cleanliness guidelines', color: 'from-orange-500 to-amber-400', bg: 'bg-orange-50', border: 'border-orange-100', tag: '6 Categories' },
    { id: 'leave',     icon: ClipboardList, title: 'Leave Guide',        desc: 'How to apply, types of leave, FAQs & approval process', color: 'from-blue-500 to-indigo-400',  bg: 'bg-blue-50',   border: 'border-blue-100',   tag: '5-Step Process' },
    { id: 'calendar',  icon: GraduationCap, title: 'Academic Calendar',  desc: 'Exams, holidays, deadlines & events for 2025–26',       color: 'from-purple-500 to-violet-400',bg: 'bg-purple-50', border: 'border-purple-100', tag: '30+ Events' },
];

const pageMap = {
    emergency: EmergencyPage,
    rules:     RulesPage,
    leave:     LeavePage,
    calendar:  CalendarPage,
};

const ResourcesPage = () => {
    const location = useLocation();
    const [activePage, setActivePage] = useState(location.state?.page || null);

    const goHome = () => { setActivePage(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const goTo   = (id) => { setActivePage(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    // Active page — render karo us component ko, onBack prop do
    if (activePage) {
        const ActiveComponent = pageMap[activePage];
        return (
            <div className="min-h-screen bg-[#fdf9f6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');`}</style>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activePage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        <ActiveComponent onBack={goHome} />
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    // Hub — default
    return (
        <div className="min-h-screen bg-[#fdf9f6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');`}</style>

            {/* Header */}
            <div className="bg-white border-b border-orange-100 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-200">
                        <Bookmark size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Dnyanda Hostel</p>
                        <h1 className="font-black text-slate-800 text-base leading-none">Student Resources</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl p-7 mb-10 text-white relative overflow-hidden"
                >
                    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/10" />
                    <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-2">Welcome</p>
                    <h2 className="font-black text-2xl sm:text-3xl mb-2 leading-tight">Everything you need,<br />right here.</h2>
                    <p className="text-orange-100 text-sm">Quick access to contacts, rules, leave process & academic calendar.</p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {hubCards.map(({ id, icon: Icon, title, desc, color, bg, border, tag }, i) => (
                        <motion.button
                            key={id}
                            onClick={() => goTo(id)}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.09 }}
                            whileHover={{ y: -3 }}
                            className={`${bg} ${border} border rounded-3xl p-6 text-left hover:shadow-lg transition-all group w-full`}
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                <Icon size={22} className="text-white" />
                            </div>
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-black text-slate-800 text-base">{title}</h3>
                                <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 shrink-0 ml-2">{tag}</span>
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed mb-4">{desc}</p>
                            <div className="flex items-center gap-1.5 text-orange-500 text-xs font-black">
                                View Details <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-orange-100 mt-4 py-5 text-center">
                <p className="text-xs text-slate-300 font-medium">© {new Date().getFullYear()} Dnyanda Hostel Management System</p>
            </div>
        </div>
    );
};

export default ResourcesPage;
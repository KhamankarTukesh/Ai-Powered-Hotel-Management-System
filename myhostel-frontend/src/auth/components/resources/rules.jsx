import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Shield, ChevronLeft, ChevronDown, ChevronUp,
    Download, Clock, Users, Utensils, Zap,
    BookOpen, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const ruleCategories = [
    {
        id: 1,
        icon: Clock,
        title: 'Entry & Exit Timings',
        color: 'bg-orange-50 text-orange-500 border-orange-200',
        dotColor: 'bg-orange-500',
        rules: [
            { text: 'Students must return to hostel by 10:00 PM', allowed: true },
            { text: 'Gate pass required for overnight stays outside', allowed: true },
            { text: 'Visitors allowed only in common area (10AM–7PM)', allowed: true },
            { text: 'Main gate closes at 11:00 PM strictly', allowed: false },
            { text: 'No entry after 11 PM without prior warden approval', allowed: false },
        ]
    },
    {
        id: 2,
        icon: BookOpen,
        title: 'Room & Cleanliness',
        color: 'bg-blue-50 text-blue-500 border-blue-200',
        dotColor: 'bg-blue-500',
        rules: [
            { text: 'Rooms must be kept clean at all times', allowed: true },
            { text: 'Room inspection every Monday 8AM–10AM', allowed: true },
            { text: 'Garbage to be disposed in dustbin daily', allowed: true },
            { text: 'No cooking allowed inside rooms', allowed: false },
            { text: 'Furniture must not be moved without permission', allowed: false },
        ]
    },
    {
        id: 3,
        icon: Users,
        title: 'Conduct & Discipline',
        color: 'bg-red-50 text-red-500 border-red-200',
        dotColor: 'bg-red-500',
        rules: [
            { text: 'Ragging is strictly prohibited — zero tolerance policy', allowed: false },
            { text: 'Respectful behavior towards all staff is mandatory', allowed: true },
            { text: 'No loud music or noise after 10:00 PM', allowed: false },
            { text: 'Alcohol and smoking strictly banned on campus', allowed: false },
            { text: 'Political activities inside hostel are not permitted', allowed: false },
        ]
    },
    {
        id: 4,
        icon: Utensils,
        title: 'Mess & Dining',
        color: 'bg-green-50 text-green-600 border-green-200',
        dotColor: 'bg-green-500',
        rules: [
            { text: 'Mess timings: Breakfast 7–9AM, Lunch 12–2PM, Dinner 7–9PM', allowed: true },
            { text: 'Carry your hostel ID card for mess entry', allowed: true },
            { text: 'No food wastage — serve only what you can eat', allowed: true },
            { text: 'Outside food delivery allowed only in common area', allowed: true },
            { text: 'Special diet requests via warden office only', allowed: true },
        ]
    },
    {
        id: 5,
        icon: Zap,
        title: 'Electricity & Water',
        color: 'bg-amber-50 text-amber-600 border-amber-200',
        dotColor: 'bg-amber-500',
        rules: [
            { text: 'Switch off lights and fans when leaving the room', allowed: true },
            { text: 'Report any electrical fault or leakage immediately', allowed: true },
            { text: 'AC usage allowed 10PM–6AM only (summer months)', allowed: true },
            { text: 'Geysers must be switched off after use', allowed: true },
            { text: 'Personal heaters, irons are not allowed in rooms', allowed: false },
        ]
    },
    {
        id: 6,
        icon: AlertTriangle,
        title: 'Safety & Security',
        color: 'bg-purple-50 text-purple-500 border-purple-200',
        dotColor: 'bg-purple-500',
        rules: [
            { text: 'Always carry your hostel ID card inside campus', allowed: true },
            { text: 'Report any suspicious activity to security immediately', allowed: true },
            { text: 'Do not share your room key with anyone', allowed: false },
            { text: 'Inflammable materials strictly prohibited in rooms', allowed: false },
            { text: 'Emergency exits must be kept clear at all times', allowed: true },
        ]
    },
];

const penalties = [
    { offence: 'Late return without gate pass', penalty: 'Warning + ₹100 fine' },
    { offence: 'Ragging', penalty: 'Immediate expulsion' },
    { offence: 'Alcohol/Smoking', penalty: 'Suspension + Parent notice' },
    { offence: 'Room damage', penalty: 'Full repair cost + fine' },
    { offence: 'Repeated cleanliness violations', penalty: '₹200 fine per instance' },
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
const RulesPage = ({ onBack }) => {
    
    const [openId, setOpenId] = useState(1); // first one open by default
    const [search, setSearch] = useState('');

    const filtered = ruleCategories.filter(cat =>
        !search ||
        cat.title.toLowerCase().includes(search.toLowerCase()) ||
        cat.rules.some(r => r.text.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#fdf9f6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');`}</style>

            {/* ── Header ── */}
            <div className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onBack()}
                            className="w-8 h-8 rounded-xl border border-orange-100 flex items-center justify-center hover:bg-orange-50 transition-all"
                        >
                            <ChevronLeft size={16} className="text-slate-500" />
                        </button>
                        <div>
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Resources</p>
                            <h1 className="font-black text-slate-800 text-base leading-none">Hostel Rules</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search rules..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-3 pr-3 py-1.5 text-xs rounded-xl border border-orange-100 bg-orange-50/50 outline-none focus:ring-2 focus:ring-orange-200 w-32 sm:w-44 hidden sm:block"
                        />
                        {/* Download */}
                        <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-orange-200 transition-all">
                            <Download size={13} />
                            <span className="hidden sm:inline">Download PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">

                {/* ── Info Banner ── */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3"
                >
                    <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <Shield size={15} className="text-orange-500" />
                    </div>
                    <div>
                        <p className="font-black text-orange-700 text-sm">Rules are effective from admission date</p>
                        <p className="text-orange-500 text-xs mt-0.5">Violation of any rule may result in disciplinary action. Read carefully and acknowledge.</p>
                    </div>
                </motion.div>

                {/* ── Legend ── */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-green-500" />
                        <span className="text-xs font-bold text-slate-500">Allowed / Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <XCircle size={15} className="text-red-400" />
                        <span className="text-xs font-bold text-slate-500">Not Allowed / Prohibited</span>
                    </div>
                </div>

                {/* ── Rule Categories Accordion ── */}
                <section>
                    <div className="space-y-3">
                        {filtered.map(({ id, icon: Icon, title, color, dotColor, rules }) => (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl border border-orange-100 overflow-hidden"
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => setOpenId(openId === id ? null : id)}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50/40 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${color}`}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-slate-800 text-sm">{title}</p>
                                            <p className="text-slate-400 text-[11px]">{rules.length} rules</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Dot indicators */}
                                        <div className="flex gap-1 items-center">
                                            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                                        </div>
                                        {openId === id
                                            ? <ChevronUp size={16} className="text-orange-400" />
                                            : <ChevronDown size={16} className="text-slate-300" />
                                        }
                                    </div>
                                </button>

                                {/* Accordion Body */}
                                <AnimatePresence>
                                    {openId === id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 border-t border-orange-50">
                                                <ul className="mt-4 space-y-3">
                                                    {rules.map((rule, i) => (
                                                        <motion.li
                                                            key={i}
                                                            initial={{ opacity: 0, x: -8 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex items-start gap-3"
                                                        >
                                                            {rule.allowed
                                                                ? <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                                                : <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                                            }
                                                            <span className={`text-sm leading-relaxed ${rule.allowed ? 'text-slate-600' : 'text-slate-600'}`}>
                                                                {rule.text}
                                                            </span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-slate-400 text-sm">No rules found for "{search}"</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Penalty Table ── */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-2xl bg-red-50 flex items-center justify-center">
                            <AlertTriangle size={16} className="text-red-500" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 text-base">Penalty Chart</h2>
                            <p className="text-slate-400 text-xs">Consequences for rule violations</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
                        {/* Table header */}
                        <div className="grid grid-cols-2 bg-orange-50 px-5 py-3 border-b border-orange-100">
                            <span className="text-[11px] font-black text-orange-500 uppercase tracking-wider">Offence</span>
                            <span className="text-[11px] font-black text-orange-500 uppercase tracking-wider">Penalty</span>
                        </div>
                        {/* Table rows */}
                        {penalties.map(({ offence, penalty }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                                className={`grid grid-cols-2 px-5 py-3.5 border-b border-orange-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-orange-50/20'}`}
                            >
                                <span className="text-sm text-slate-700 font-medium pr-4">{offence}</span>
                                <span className="text-sm font-bold text-red-600">{penalty}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── Acknowledgement ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-6 text-center"
                >
                    <Shield size={28} className="text-white mx-auto mb-3" />
                    <p className="text-white font-black text-base mb-1">I have read and understood all rules</p>
                    <p className="text-orange-100 text-xs mb-4">By staying in Dnyanda Hostel, you agree to follow all the above guidelines.</p>
                    <button className="bg-white text-orange-600 font-black text-sm px-8 py-2.5 rounded-xl hover:bg-orange-50 transition-all active:scale-95">
                        Acknowledge ✓
                    </button>
                </motion.div>

                {/* ── Back + Dashboard buttons ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={() => onBack()}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-orange-200 text-orange-500 font-black text-sm py-3.5 rounded-2xl hover:bg-orange-50 transition-all"
                    >
                        <ChevronLeft size={16} />
                        Back to Resources
                    </button>
                    <button
                        onClick={() => window.location.href = '/student/dashboard'}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-black text-sm py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-md shadow-orange-100"
                    >
                        Go to Dashboard →
                    </button>
                </div>

            </div>

            {/* Footer */}
            <div className="border-t border-orange-100 mt-6 py-5 text-center">
                <p className="text-xs text-slate-300 font-medium">© {new Date().getFullYear()} Dnyanda Hostel Management System</p>
            </div>
        </div>
    );
};

export default RulesPage;
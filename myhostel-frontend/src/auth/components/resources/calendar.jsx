import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
    GraduationCap, ChevronLeft, ChevronRight,
    X, Calendar, Filter, Download
} from 'lucide-react';


const calendarEvents = {
    '2025-07-01': [{ label: 'Academic Year Begins', type: 'important' }],
    '2025-07-15': [{ label: 'Hostel Allotment Deadline', type: 'deadline' }],
    '2025-07-28': [{ label: 'Orientation Program', type: 'event' }],
    '2025-08-15': [{ label: 'Independence Day', type: 'holiday' }],
    '2025-08-20': [{ label: 'Internal Exam — Unit 1', type: 'exam' }],
    '2025-08-22': [{ label: 'Internal Exam — Unit 2', type: 'exam' }],
    '2025-09-05': [{ label: "Teachers' Day Celebration", type: 'event' }],
    '2025-09-25': [{ label: 'Mid-Semester Exams Begin', type: 'exam' }],
    '2025-09-30': [{ label: 'Mid-Semester Exams End', type: 'exam' }],
    '2025-10-02': [{ label: 'Gandhi Jayanti Holiday', type: 'holiday' }],
    '2025-10-15': [{ label: 'Fee Payment Deadline', type: 'deadline' }],
    '2025-10-20': [{ label: 'Diwali Break Starts', type: 'holiday' }],
    '2025-10-28': [{ label: 'Hostel Reopens After Diwali', type: 'important' }],
    '2025-11-03': [{ label: 'Classes Resume', type: 'important' }],
    '2025-11-15': [{ label: 'Project Submission Deadline', type: 'deadline' }],
    '2025-11-26': [{ label: 'Constitution Day', type: 'holiday' }],
    '2025-12-01': [{ label: 'End Semester Exam Begins', type: 'exam' }],
    '2025-12-15': [{ label: 'End Semester Exam Ends', type: 'exam' }],
    '2025-12-20': [{ label: 'Winter Break Starts', type: 'holiday' }],
    '2026-01-02': [{ label: 'Hostel Reopens', type: 'important' }],
    '2026-01-15': [{ label: 'Fee Payment Deadline', type: 'deadline' }],
    '2026-01-26': [{ label: 'Republic Day', type: 'holiday' }],
    '2026-02-10': [{ label: 'Annual Sports Day', type: 'event' }],
    '2026-02-14': [{ label: 'Cultural Fest Begins', type: 'event' }],
    '2026-02-28': [{ label: 'Project Demo Day', type: 'important' }],
    '2026-03-01': [{ label: 'Final Exam Schedule Out', type: 'important' }],
    '2026-03-08': [{ label: "Women's Day Event", type: 'event' }],
    '2026-03-15': [{ label: 'Final Exams Begin', type: 'exam' }],
    '2026-03-30': [{ label: 'Final Exams End', type: 'exam' }],
    '2026-04-05': [{ label: 'Results Declared', type: 'important' }],
    '2026-04-14': [{ label: 'Ambedkar Jayanti Holiday', type: 'holiday' }],
    '2026-04-30': [{ label: 'Hostel Vacate Deadline', type: 'deadline' }],
};

const typeConfig = {
    important: { dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', label: 'Important', border: 'border-orange-200' },
    deadline:  { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',       label: 'Deadline',  border: 'border-red-200' },
    holiday:   { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',   label: 'Holiday',   border: 'border-green-200' },
    exam:      { dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700',     label: 'Exam',      border: 'border-blue-200' },
    event:     { dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700', label: 'Event',     border: 'border-purple-200' },
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const DAYS_FULL  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ─────────────────────────────────────────────
// CALENDAR GRID
// ─────────────────────────────────────────────
const CalendarGrid = ({ year, month, selected, onSelect }) => {
    const today      = new Date();
    const firstDay   = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays   = new Date(year, month, 0).getDate();

    const getKey = (d) =>
        `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

    const isToday = (d) =>
        today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

    return (
        <div>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS_FULL.map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase py-2 hidden sm:block">{d}</div>
                ))}
                {DAYS_SHORT.map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase py-2 sm:hidden">{d}</div>
                ))}
            </div>

            {/* Date grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                {/* Prev month filler */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`prev-${i}`} className="aspect-square flex items-center justify-center rounded-xl">
                        <span className="text-xs text-slate-200 font-medium">{prevDays - firstDay + i + 1}</span>
                    </div>
                ))}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const key    = getKey(d);
                    const events = calendarEvents[key] || [];
                    const _today = isToday(d);
                    const _sel   = selected === d;
                    const _has   = events.length > 0;

                    return (
                        <button
                            key={d}
                            onClick={() => onSelect(_sel ? null : d)}
                            className={`
                                relative aspect-square flex flex-col items-center justify-center rounded-xl
                                text-sm font-bold transition-all select-none
                                ${_today ? 'bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-200 scale-105' : ''}
                                ${_sel && !_today ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-400 ring-offset-1' : ''}
                                ${!_today && !_sel && _has ? 'text-slate-800 hover:bg-orange-50' : ''}
                                ${!_today && !_sel && !_has ? 'text-slate-500 hover:bg-slate-50' : ''}
                            `}
                        >
                            <span className="text-xs sm:text-sm">{d}</span>
                            {_has && (
                                <div className="absolute bottom-0.5 sm:bottom-1 flex gap-0.5">
                                    {events.slice(0, 3).map((ev, ei) => (
                                        <div
                                            key={ei}
                                            className={`w-1 h-1 rounded-full ${_today ? 'bg-white/80' : typeConfig[ev.type]?.dot}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const CalendarPage = ({ onBack }) => {
    const navigate    = useNavigate();
    const today       = new Date();
    const [current, setCurrent]     = useState({ year: today.getFullYear(), month: today.getMonth() });
    const [selected, setSelected]   = useState(null);
    const [filter, setFilter]       = useState('all');
    const [showFilter, setShowFilter] = useState(false);

    const { year, month } = current;

    const prev = () => {
        setSelected(null);
        if (month === 0) setCurrent({ year: year - 1, month: 11 });
        else setCurrent({ year, month: month - 1 });
    };
    const next = () => {
        setSelected(null);
        if (month === 11) setCurrent({ year: year + 1, month: 0 });
        else setCurrent({ year, month: month + 1 });
    };
    const goToday = () => {
        setSelected(null);
        setCurrent({ year: today.getFullYear(), month: today.getMonth() });
    };

    const getKey = (d) =>
        `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // All events this month
    const monthEvents = Array.from({ length: daysInMonth }, (_, i) => i + 1)
        .flatMap(d => {
            const evs = calendarEvents[getKey(d)] || [];
            return evs.map(ev => ({ day: d, ...ev }));
        })
        .filter(ev => filter === 'all' || ev.type === filter);

    // Selected day events
    const selectedKey    = selected ? getKey(selected) : null;
    const selectedEvents = selectedKey ? (calendarEvents[selectedKey] || []) : [];

    // Upcoming events (next 30 days from today)
    const upcomingEvents = Object.entries(calendarEvents)
        .filter(([key]) => {
            const d = new Date(key);
            const diff = (d - today) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= 30;
        })
        .flatMap(([key, evs]) => evs.map(ev => ({ key, ...ev })))
        .sort((a, b) => new Date(a.key) - new Date(b.key))
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-[#fdf9f6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');`}</style>

            {/* ── Header ── */}
            <div className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onBack()}
                            className="w-8 h-8 rounded-xl border border-orange-100 flex items-center justify-center hover:bg-orange-50 transition-all"
                        >
                            <ChevronLeft size={16} className="text-slate-500" />
                        </button>
                        <div>
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Resources</p>
                            <h1 className="font-black text-slate-800 text-base leading-none">Academic Calendar</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${showFilter ? 'bg-orange-500 text-white border-orange-500' : 'border-orange-100 text-slate-500 hover:bg-orange-50'}`}
                        >
                            <Filter size={13} /> Filter
                        </button>
                        <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-orange-100 text-slate-500 hover:bg-orange-50 transition-all">
                            <Download size={13} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                </div>

                {/* Filter row */}
                <AnimatePresence>
                    {showFilter && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-orange-50"
                        >
                            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`text-[11px] font-black px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    All
                                </button>
                                {Object.entries(typeConfig).map(([type, { badge, label }]) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(filter === type ? 'all' : type)}
                                        className={`text-[11px] font-black px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${filter === type ? badge + ' ring-2 ring-offset-1 ring-current' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── LEFT: Calendar ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Month navigation */}
                        <div className="bg-white rounded-3xl border border-orange-100 p-5 sm:p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-black text-slate-800 text-xl">{MONTHS[month]}</h2>
                                    <p className="text-slate-400 text-xs font-semibold">{year} — {monthEvents.length} events</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={prev} className="w-9 h-9 rounded-xl border border-orange-100 flex items-center justify-center hover:bg-orange-50 transition-all">
                                        <ChevronLeft size={16} className="text-slate-500" />
                                    </button>
                                    <button onClick={goToday} className="text-[11px] font-black text-orange-500 border border-orange-200 px-3 py-1.5 rounded-xl hover:bg-orange-50 transition-all">
                                        Today
                                    </button>
                                    <button onClick={next} className="w-9 h-9 rounded-xl border border-orange-100 flex items-center justify-center hover:bg-orange-50 transition-all">
                                        <ChevronRight size={16} className="text-slate-500" />
                                    </button>
                                </div>
                            </div>

                            <CalendarGrid
                                year={year}
                                month={month}
                                selected={selected}
                                onSelect={setSelected}
                            />

                            {/* Legend */}
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5 pt-4 border-t border-orange-50">
                                {Object.entries(typeConfig).map(([type, { dot, label }]) => (
                                    <div key={type} className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${dot}`} />
                                        <span className="text-[11px] font-semibold text-slate-400 capitalize">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Selected day detail */}
                        <AnimatePresence>
                            {selected && selectedEvents.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="bg-white rounded-3xl border border-orange-200 p-5"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-100">
                                                <span className="text-white font-black text-sm">{selected}</span>
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-base">{MONTHS[month]} {selected}</p>
                                                <p className="text-slate-400 text-xs">{selectedEvents.length} event{selectedEvents.length > 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center hover:bg-orange-100 transition-all">
                                            <X size={13} className="text-orange-500" />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedEvents.map((ev, i) => (
                                            <div key={i} className={`flex items-center gap-3 bg-white rounded-2xl p-4 border ${typeConfig[ev.type]?.border}`}>
                                                <div className={`w-2 h-8 rounded-full ${typeConfig[ev.type]?.dot}`} />
                                                <div>
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full capitalize ${typeConfig[ev.type]?.badge}`}>
                                                        {ev.type}
                                                    </span>
                                                    <p className="text-slate-800 font-bold text-sm mt-1">{ev.label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── RIGHT: Sidebar ── */}
                    <div className="space-y-5">

                        {/* Upcoming events */}
                        <div className="bg-white rounded-3xl border border-orange-100 p-5">
                            <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-4">
                                Upcoming — Next 30 Days
                            </p>
                            {upcomingEvents.length === 0 ? (
                                <div className="text-center py-6">
                                    <Calendar size={24} className="text-orange-200 mx-auto mb-2" />
                                    <p className="text-slate-400 text-xs">No upcoming events</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {upcomingEvents.map(({ key, label, type }, i) => {
                                        const d = new Date(key);
                                        const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.07 }}
                                                className="flex items-start gap-3 p-3 rounded-2xl bg-orange-50/40 border border-orange-50 hover:bg-orange-50 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex flex-col items-center justify-center shrink-0 shadow-sm">
                                                    <span className="text-orange-600 font-black text-sm leading-none">{d.getDate()}</span>
                                                    <span className="text-orange-300 text-[9px] font-bold">{MONTHS[d.getMonth()].slice(0,3)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-slate-700 text-xs font-bold leading-tight truncate">{label}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${typeConfig[type]?.badge}`}>{type}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">{diff === 0 ? 'Today' : `${diff}d away`}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* This month events list */}
                        <div className="bg-white rounded-3xl border border-orange-100 p-5">
                            <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-4">
                                {MONTHS[month]} Events
                            </p>
                            {monthEvents.length === 0 ? (
                                <div className="text-center py-6">
                                    <Calendar size={24} className="text-orange-200 mx-auto mb-2" />
                                    <p className="text-slate-400 text-xs">No events this month</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {monthEvents.map(({ day, label, type }, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelected(day)}
                                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 transition-all text-left"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                                <span className="text-orange-600 font-black text-xs">{day}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-700 text-xs font-semibold truncate">{label}</p>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize ${typeConfig[type]?.badge}`}>{type}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* ── Back button ── */}
                <button
                    onClick={() => onBack()}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-orange-200 text-orange-500 font-black text-sm py-3.5 rounded-2xl hover:bg-orange-50 transition-all mt-8"
                >
                    <ChevronLeft size={16} />
                    Back to All Resources
                </button>
            </div>

            {/* Footer */}
            <div className="border-t border-orange-100 mt-6 py-5 text-center">
                <p className="text-xs text-slate-300 font-medium">© {new Date().getFullYear()} Dnyanda Hostel Management System</p>
            </div>
        </div>
    );
};

export default CalendarPage;
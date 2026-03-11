import React from 'react';
import { motion } from 'framer-motion';
import {
    Phone, Shield, AlertTriangle, Clock,
    MapPin, ChevronLeft, Ambulance, Flame,
    HeartPulse, ArrowRight
} from 'lucide-react';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const hostelContacts = [
    {
        name: 'Chief Warden',
        number: '+91 98765 43210',
        available: '24/7',
        icon: Shield,
        bg: 'bg-orange-50',
        iconColor: 'text-orange-500',
        border: 'border-orange-200',
        desc: 'For all hostel-related urgent matters'
    },
    {
        name: 'Security Desk',
        number: '+91 98765 43211',
        available: '24/7',
        icon: AlertTriangle,
        bg: 'bg-red-50',
        iconColor: 'text-red-500',
        border: 'border-red-200',
        desc: 'Gate security and campus safety'
    },
    {
        name: 'Medical Room',
        number: '+91 98765 43212',
        available: '8AM – 10PM',
        icon: HeartPulse,
        bg: 'bg-green-50',
        iconColor: 'text-green-600',
        border: 'border-green-200',
        desc: 'First aid and basic medical help'
    },
    {
        name: 'Mess Manager',
        number: '+91 98765 43213',
        available: '7AM – 9PM',
        icon: Clock,
        bg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        border: 'border-blue-200',
        desc: 'Mess complaints and food issues'
    },
    {
        name: 'Maintenance',
        number: '+91 98765 43214',
        available: '9AM – 6PM',
        icon: MapPin,
        bg: 'bg-purple-50',
        iconColor: 'text-purple-500',
        border: 'border-purple-200',
        desc: 'Electricity, water, room repairs'
    },
    {
        name: 'Admin Office',
        number: '+91 98765 43215',
        available: '10AM – 5PM',
        icon: Phone,
        bg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        border: 'border-amber-200',
        desc: 'Documents, fees, certificates'
    },
];

const nationalEmergency = [
    { name: 'Police', number: '100', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Ambulance', number: '108', icon: HeartPulse, color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'Fire Brigade', number: '101', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Women Helpline', number: '1091', icon: Phone, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const nearbyHospitals = [
    { name: 'City General Hospital', distance: '1.2 km', number: '+91 20 2612 3456' },
    { name: 'Apollo Clinic', distance: '2.4 km', number: '+91 20 2698 7654' },
    { name: 'Ruby Hall Clinic', distance: '3.8 km', number: '+91 20 2616 3391' },
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
const EmergencyPage = ({ onBack }) => {

    return (
        <div className="min-h-screen bg-[#fdf9f6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');`}</style>

            {/* ── Header ── */}
            <div className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onBack()}
                            className="w-8 h-8 rounded-xl border border-orange-100 flex items-center justify-center hover:bg-orange-50 transition-all"
                        >
                            <ChevronLeft size={16} className="text-slate-500" />
                        </button>
                        <div>
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Resources</p>
                            <h1 className="font-black text-slate-800 text-base leading-none">Emergency Contacts</h1>
                        </div>
                    </div>

                    {/* SOS button */}
                    <a
                        href="tel:100"
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-red-200 transition-all active:scale-95"
                    >
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        SOS
                    </a>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">

                {/* ── Alert Banner ── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
                >
                    <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                        <AlertTriangle size={16} className="text-red-500" />
                    </div>
                    <div>
                        <p className="font-black text-red-700 text-sm">In case of life-threatening emergency</p>
                        <p className="text-red-500 text-xs mt-0.5">Call <strong>108</strong> for ambulance or <strong>100</strong> for police immediately. Do not delay.</p>
                    </div>
                </motion.div>

                {/* ── National Emergency Numbers ── */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <Phone size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 text-base">National Emergency</h2>
                            <p className="text-slate-400 text-xs">Tap to call directly</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {nationalEmergency.map(({ name, number, icon: Icon, color, bg }, i) => (
                            <motion.a
                                key={name}
                                href={`tel:${number}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.07 }}
                                className={`${bg} rounded-2xl p-4 flex flex-col items-center gap-2 border border-white hover:shadow-md transition-all active:scale-95`}
                            >
                                <Icon size={22} className={color} />
                                <span className="font-black text-slate-800 text-xl">{number}</span>
                                <span className="text-xs font-bold text-slate-500">{name}</span>
                            </motion.a>
                        ))}
                    </div>
                </section>

                {/* ── Hostel Contacts ── */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <Shield size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 text-base">Hostel Contacts</h2>
                            <p className="text-slate-400 text-xs">Dnyanda Hostel staff directory</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {hostelContacts.map(({ name, number, available, icon: Icon, bg, iconColor, border, desc }, i) => (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                className={`bg-white rounded-2xl border ${border} p-5 hover:shadow-md transition-all`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                                        <Icon size={18} className={iconColor} />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] font-bold text-slate-400">{available}</span>
                                    </div>
                                </div>
                                <p className="font-black text-slate-800 text-sm mb-0.5">{name}</p>
                                <p className="text-slate-400 text-xs mb-3">{desc}</p>
                                <a
                                    href={`tel:${number}`}
                                    className="flex items-center justify-between bg-orange-50 hover:bg-orange-100 rounded-xl px-4 py-2.5 transition-all group"
                                >
                                    <span className="text-orange-600 font-black text-sm">{number}</span>
                                    <Phone size={14} className="text-orange-400 group-hover:text-orange-600 transition-colors" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── Nearby Hospitals ── */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <HeartPulse size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 text-base">Nearby Hospitals</h2>
                            <p className="text-slate-400 text-xs">Closest medical facilities</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {nearbyHospitals.map(({ name, distance, number }, i) => (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-white rounded-2xl border border-orange-100 px-5 py-4 flex items-center justify-between hover:shadow-sm transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                                        <HeartPulse size={16} className="text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <MapPin size={11} className="text-orange-400" />
                                            <span className="text-xs text-slate-400 font-medium">{distance} away</span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={`tel:${number}`}
                                    className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-black text-xs px-4 py-2 rounded-xl transition-all"
                                >
                                    <Phone size={12} />
                                    Call
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── Back to Resources ── */}
                <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    onClick={() => onBack()}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-orange-200 text-orange-500 font-black text-sm py-3.5 rounded-2xl hover:bg-orange-50 transition-all"
                >
                    <ChevronLeft size={16} />
                    Back to All Resources
                </motion.button>

            </div>

            {/* Footer */}
            <div className="border-t border-orange-100 mt-6 py-5 text-center">
                <p className="text-xs text-slate-300 font-medium">© {new Date().getFullYear()} Dnyanda Hostel Management System</p>
            </div>
        </div>
    );
};

export default EmergencyPage;
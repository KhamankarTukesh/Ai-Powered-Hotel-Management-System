import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
    ClipboardList, ChevronLeft, CheckCircle2,
    Clock, AlertTriangle, HelpCircle,
    ChevronDown, ChevronUp, ArrowRight,
    FileText, Bell, Shield, UserCheck
} from 'lucide-react';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const leaveTypes = [
    {
        title: 'Home Leave',
        icon: '🏠',
        duration: 'Up to 7 days',
        approval: 'Warden',
        color: 'bg-orange-50 border-orange-200',
        badge: 'bg-orange-100 text-orange-700',
        desc: 'For visiting family during weekends or short breaks.'
    },
    {
        title: 'Medical Leave',
        icon: '🏥',
        duration: 'As required',
        approval: 'Warden + Medical',
        color: 'bg-red-50 border-red-200',
        badge: 'bg-red-100 text-red-700',
        desc: 'For medical treatment. Doctor certificate required.'
    },
    {
        title: 'Emergency Leave',
        icon: '🚨',
        duration: 'Up to 3 days',
        approval: 'Warden (urgent)',
        color: 'bg-purple-50 border-purple-200',
        badge: 'bg-purple-100 text-purple-700',
        desc: 'For family emergencies. Can be applied retrospectively.'
    },
    {
        title: 'Academic Leave',
        icon: '🎓',
        duration: 'Event based',
        approval: 'HOD + Warden',
        color: 'bg-blue-50 border-blue-200',
        badge: 'bg-blue-100 text-blue-700',
        desc: 'For conferences, workshops, inter-college events.'
    },
];

const leaveSteps = [
    {
        step: '01',
        icon: FileText,
        title: 'Fill Leave Form',
        desc: 'Go to Dashboard → Leave → Apply New Leave. Select leave type, fill dates, reason and any required documents.',
        time: '5 min',
        tip: 'Apply at least 24 hours in advance for better approval chances.'
    },
    {
        step: '02',
        icon: Bell,
        title: 'Parent Notification',
        desc: 'Your registered parent/guardian will receive an automated SMS and call for confirmation of the leave request.',
        time: '1–2 hrs',
        tip: 'Make sure your parent\'s number is updated in your profile.'
    },
    {
        step: '03',
        icon: UserCheck,
        title: 'Warden Review',
        desc: 'Warden reviews your request and approves or rejects it with a reason. You get a real-time notification.',
        time: '2–4 hrs',
        tip: 'Attach supporting documents for medical or academic leaves.'
    },
    {
        step: '04',
        icon: Shield,
        title: 'Gate Pass Generated',
        desc: 'Once approved, a digital gate pass is auto-generated in your dashboard. Show it at the security gate before leaving.',
        time: 'Instant',
        tip: 'Screenshot your gate pass in case of internet issues at gate.'
    },
    {
        step: '05',
        icon: CheckCircle2,
        title: 'Check-in on Return',
        desc: 'Mark your return on the portal within 1 hour of arriving. Hand over the gate pass copy at the security desk.',
        time: '2 min',
        tip: 'Late check-in without marking return may result in a fine.'
    },
];

const faqs = [
    {
        q: 'Can I apply for leave on the same day?',
        a: 'Same-day leave is only allowed for emergencies. For regular leave, apply at least 24 hours in advance. Emergency leaves can be applied and approved within hours.'
    },
    {
        q: 'What happens if leave is rejected?',
        a: 'You will receive a notification with the rejection reason. You can reapply with additional justification or supporting documents. Contact the warden directly for urgent cases.'
    },
    {
        q: 'How many leaves can I take per month?',
        a: 'Regular home leave is limited to 4 days per month. Medical and emergency leaves are not counted in this limit. Academic leaves require HOD approval.'
    },
    {
        q: 'What if I return late from leave?',
        a: 'Inform the warden immediately if you are going to be late. Unauthorized late return results in a warning and ₹200 fine. Repeated violations may affect your hostel allotment.'
    },
    {
        q: 'Can I extend my leave once approved?',
        a: 'Yes, you can apply for a leave extension from the dashboard before your leave expires. Extensions are subject to warden approval and must be applied before the original leave end date.'
    },
];

const importantRules = [
    { icon: '⏰', text: 'Apply minimum 24 hours before planned departure' },
    { icon: '📱', text: 'Keep your phone reachable during leave period' },
    { icon: '📄', text: 'Medical leave requires a valid doctor\'s certificate' },
    { icon: '🔙', text: 'Mark return within 1 hour of arrival back at hostel' },
    { icon: '🚫', text: 'Leaving without approved gate pass = disciplinary action' },
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
const LeavePage = ({ onBack }) => {
    
    const [openFaq, setOpenFaq] = useState(null);

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
                            <h1 className="font-black text-slate-800 text-base leading-none">Leave Application Guide</h1>
                        </div>
                    </div>
                    <button
                        onClick={() => ()=>{}}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all active:scale-95"
                    >
                        Apply Now <ArrowRight size={13} />
                    </button>
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
                        <AlertTriangle size={15} className="text-orange-500" />
                    </div>
                    <div>
                        <p className="font-black text-orange-700 text-sm">Leave without gate pass is not allowed</p>
                        <p className="text-orange-500 text-xs mt-0.5">Always apply through the portal and wait for approval before leaving the hostel premises.</p>
                    </div>
                </motion.div>

                {/* ── Leave Types ── */}
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <ClipboardList size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 text-base">Types of Leave</h2>
                            <p className="text-slate-400 text-xs">Choose the correct type when applying</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {leaveTypes.map(({ title, icon, duration, approval, color, badge, desc }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className={`rounded-2xl border p-5 ${color}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-2xl">{icon}</span>
                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${badge}`}>
                                        {duration}
                                    </span>
                                </div>
                                <p className="font-black text-slate-800 text-sm mb-1">{title}</p>
                                <p className="text-slate-500 text-xs leading-relaxed mb-3">{desc}</p>
                                <div className="flex items-center gap-1.5">
                                    <UserCheck size={12} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-500">Approval: {approval}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── Step by Step Guide ── */}
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <FileText size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 text-base">How to Apply — Step by Step</h2>
                            <p className="text-slate-400 text-xs">Follow these steps carefully</p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 top-6 bottom-6 w-px bg-orange-100 hidden sm:block" />

                        <div className="space-y-4">
                            {leaveSteps.map(({ step, icon: Icon, title, desc, time, tip }, i) => (
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: -14 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.09 }}
                                    className="flex gap-4 items-start"
                                >
                                    {/* Step badge */}
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-100 relative z-10">
                                        <Icon size={18} className="text-white" />
                                    </div>

                                    {/* Card */}
                                    <div className="bg-white rounded-2xl border border-orange-100 p-4 flex-1 hover:shadow-sm transition-all">
                                        <div className="flex items-start justify-between mb-1.5">
                                            <div>
                                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Step {step}</span>
                                                <p className="font-black text-slate-800 text-sm">{title}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full shrink-0 ml-2">
                                                {time}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs leading-relaxed mb-2">{desc}</p>
                                        {/* Tip */}
                                        <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
                                            <span className="text-amber-500 text-xs mt-0.5">💡</span>
                                            <span className="text-amber-700 text-xs font-medium">{tip}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Important Rules ── */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-2xl bg-red-50 flex items-center justify-center">
                            <AlertTriangle size={16} className="text-red-500" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 text-base">Important Rules</h2>
                            <p className="text-slate-400 text-xs">Must follow for smooth leave approval</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-orange-100 divide-y divide-orange-50">
                        {importantRules.map(({ icon, text }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-center gap-4 px-5 py-3.5"
                            >
                                <span className="text-lg shrink-0">{icon}</span>
                                <p className="text-sm text-slate-600 font-medium">{text}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <HelpCircle size={16} className="text-blue-500" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 text-base">Frequently Asked Questions</h2>
                            <p className="text-slate-400 text-xs">Common doubts answered</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {faqs.map(({ q, a }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl border border-orange-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50/40 transition-all text-left"
                                >
                                    <span className="font-bold text-slate-800 text-sm pr-4">{q}</span>
                                    {openFaq === i
                                        ? <ChevronUp size={15} className="text-orange-400 shrink-0" />
                                        : <ChevronDown size={15} className="text-slate-300 shrink-0" />
                                    }
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-4 border-t border-orange-50">
                                                <p className="text-slate-500 text-sm leading-relaxed mt-3">{a}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <div>
                        <p className="text-white font-black text-base">Ready to apply for leave?</p>
                        <p className="text-orange-100 text-xs mt-1">Go to your dashboard and submit your leave request now</p>
                    </div>
                    <button
                        onClick={() => ()=>{}}
                        className="bg-white text-orange-600 font-black text-sm px-7 py-3 rounded-xl hover:bg-orange-50 transition-all active:scale-95 shrink-0 flex items-center gap-2"
                    >
                        Apply Now <ArrowRight size={15} />
                    </button>
                </motion.div>

                {/* ── Back button ── */}
                <button
                    onClick={() => onBack()}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-orange-200 text-orange-500 font-black text-sm py-3.5 rounded-2xl hover:bg-orange-50 transition-all"
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

export default LeavePage;
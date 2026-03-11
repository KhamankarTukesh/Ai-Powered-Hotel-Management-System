import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, ClipboardList, UtensilsCrossed, DoorOpen,
    CreditCard, CalendarCheck, Bell, ArrowRight, Star,
    Users, Building2, Clock, ChevronDown, Menu, X, Zap,
    CheckCircle2, MapPin, Phone, Mail
} from 'lucide-react';

// ── Animated Counter ──
const Counter = ({ target, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, target]);

    return <span ref={ref}>{count}{suffix}</span>;
};

const features = [
    { icon: CalendarCheck, title: 'Attendance Tracking',   desc: 'Real-time daily attendance with analytics and automated alerts for guardians.',     color: 'from-orange-500 to-amber-400' },
    { icon: ClipboardList, title: 'Leave Management',      desc: 'Apply, track and get approvals for leaves with digital outpass generation.',          color: 'from-rose-500 to-orange-400' },
    { icon: ShieldCheck,   title: 'Complaint System',      desc: 'AI-powered complaint categorization with priority tagging and resolution tracking.',   color: 'from-amber-500 to-yellow-400' },
    { icon: DoorOpen,      title: 'Gate Pass',             desc: 'Instant digital gate pass requests with QR-based entry/exit movement logging.',        color: 'from-orange-600 to-red-400'   },
    { icon: CreditCard,    title: 'Fee Management',        desc: 'Pay fees, track dues, download receipts and get instant payment verification.',        color: 'from-amber-600 to-orange-500' },
    { icon: UtensilsCrossed, title: 'Mess & Menu',         desc: 'Weekly mess menu, meal feedback, and dining activity tracking for every student.',     color: 'from-red-500 to-rose-400'     },
];

const steps = [
    { num: '01', title: 'Register',  desc: 'Create your account with college roll number and ID verification.' },
    { num: '02', title: 'Verify',    desc: 'Verify your email with OTP sent to your registered address.' },
    { num: '03', title: 'Dashboard', desc: 'Access your personalized hostel dashboard instantly.' },
];

const testimonials = [
    { name: 'Rahul Sharma',   dept: 'Computer Engineering', text: 'Gate pass approvals used to take a day. Now it\'s done in minutes. Love the system!',       avatar: 'R' },
    { name: 'Priya Patil',    dept: 'Mechanical Engg.',     text: 'The leave management is so smooth. I get notified instantly when warden approves.',          avatar: 'P' },
    { name: 'Amit Deshmukh',  dept: 'Civil Engineering',    text: 'Fee receipts, mess menu, complaints — everything in one place. Really well designed.',       avatar: 'A' },
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
        return () => clearInterval(t);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#fdf9f5] overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;0,900;1,400&family=Playfair+Display:wght@700;900&display=swap');
                .playfair { font-family: 'Playfair Display', serif; }
                .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); }
            `}</style>

            {/* ── NAVBAR ── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-orange-100' : 'bg-transparent'}`}>
                <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
                            <ShieldCheck size={18} className="text-white" />
                        </div>
                        <span className="font-black text-slate-900 text-lg tracking-tight">DNYANDA</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {['features', 'howitworks', 'contact'].map(s => (
                            <button key={s} onClick={() => scrollTo(s)}
                                className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors capitalize">
                                {s === 'howitworks' ? 'How It Works' : s}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => navigate('/login')}
                            className="text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors px-4 py-2">
                            Login
                        </button>
                        <button onClick={() => navigate('/register')}
                            className="text-sm font-black bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-200 active:scale-95">
                            Get Started →
                        </button>
                    </div>

                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                        {menuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="md:hidden bg-white border-t border-orange-100 px-5 py-5 space-y-3">
                            {['features', 'howitworks', 'contact'].map(s => (
                                <button key={s} onClick={() => scrollTo(s)}
                                    className="block w-full text-left text-sm font-bold text-slate-600 py-2 capitalize">
                                    {s === 'howitworks' ? 'How It Works' : s}
                                </button>
                            ))}
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => navigate('/login')} className="flex-1 py-2.5 border border-orange-200 text-orange-500 font-bold text-sm rounded-xl">Login</button>
                                <button onClick={() => navigate('/register')} className="flex-1 py-2.5 bg-orange-500 text-white font-black text-sm rounded-xl">Get Started</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background blobs */}
                <div className="absolute inset-0 grain pointer-events-none" />
                <div className="absolute top-20 -right-32 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -left-32 w-[400px] h-[400px] bg-amber-200/30 rounded-full blur-[120px]" />

                <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
                            <Zap size={12} /> Smart Hostel Management
                        </motion.div>

                        <h1 className="playfair text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-6">
                            Your Hostel,<br />
                            <span className="text-orange-500 italic">Simplified.</span>
                        </h1>

                        <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-md">
                            Dnyanda Hostel Management System — everything from attendance to fee payments, gate passes to complaints, all in one powerful platform.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/register')}
                                className="flex items-center gap-2 bg-orange-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all text-sm">
                                Get Started Free <ArrowRight size={16} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={() => scrollTo('features')}
                                className="flex items-center gap-2 bg-white text-slate-700 font-black px-8 py-4 rounded-2xl border border-orange-100 shadow-sm hover:border-orange-300 transition-all text-sm">
                                Explore Features <ChevronDown size={16} />
                            </motion.button>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-4 mt-10">
                            <div className="flex -space-x-2">
                                {['R','P','A','S','M'].map((l, i) => (
                                    <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 border-2 border-white flex items-center justify-center text-white text-xs font-black">
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-0.5">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f97415" className="text-orange-500" />)}
                                </div>
                                <p className="text-xs text-slate-400 font-medium">Trusted by 200+ students</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Visual Card Stack */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative hidden lg:block">

                        {/* Main card */}
                        <div className="relative bg-white rounded-[2.5rem] border border-orange-100 shadow-2xl shadow-orange-100 p-8 z-10">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Student Dashboard</p>
                                    <h3 className="font-black text-slate-800 text-lg">Good Morning, Rahul ✨</h3>
                                </div>
                                <div className="relative">
                                    <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                                        <Bell size={18} className="text-orange-500" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <span className="text-white text-[8px] font-black">3</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[
                                    { label: 'Attendance', val: '92%', color: 'bg-green-50 text-green-600' },
                                    { label: 'Mess', val: 'Veg', color: 'bg-orange-50 text-orange-600' },
                                    { label: 'Gate Pass', val: 'Active', color: 'bg-blue-50 text-blue-600' },
                                ].map(({ label, val, color }) => (
                                    <div key={label} className={`${color} rounded-2xl p-3 text-center`}>
                                        <p className="text-xs font-black">{val}</p>
                                        <p className="text-[9px] font-bold opacity-60 mt-0.5">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Notification */}
                            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={15} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-800">Leave Approved ✅</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Your leave for 20–22 March has been approved by the warden.</p>
                                </div>
                            </div>

                            {/* Fee bar */}
                            <div className="mt-5">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-bold text-slate-600">Fee Status</p>
                                    <p className="text-xs font-black text-orange-500">₹8,500 / ₹12,000</p>
                                </div>
                                <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ delay: 1, duration: 1 }}
                                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Floating badge — top right */}
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute -top-5 -right-5 bg-white border border-orange-100 rounded-2xl shadow-lg p-3 flex items-center gap-2 z-20">
                            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                                <CheckCircle2 size={16} className="text-green-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-700">Gate Pass</p>
                                <p className="text-[9px] text-green-500 font-bold">Approved!</p>
                            </div>
                        </motion.div>

                        {/* Floating badge — bottom left */}
                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
                            className="absolute -bottom-5 -left-5 bg-white border border-orange-100 rounded-2xl shadow-lg p-3 flex items-center gap-2 z-20">
                            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Bell size={16} className="text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-700">New Notice</p>
                                <p className="text-[9px] text-orange-500 font-bold">From Warden</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => scrollTo('stats')}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scroll</p>
                    <ChevronDown size={18} className="text-orange-400" />
                </motion.div>
            </section>

            {/* ── STATS ── */}
            <section id="stats" className="bg-orange-500 py-16">
                <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    {[
                        { icon: Users,     val: 200, suffix: '+', label: 'Students'      },
                        { icon: Building2, val: 50,  suffix: '+', label: 'Rooms'         },
                        { icon: Clock,     val: 24,  suffix: '/7', label: 'Support'      },
                        { icon: Star,      val: 98,  suffix: '%', label: 'Satisfaction'  },
                    ].map(({ icon: Icon, val, suffix, label }, i) => (
                        <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                            <Icon size={28} className="mx-auto mb-3 opacity-80" />
                            <p className="text-4xl font-black mb-1"><Counter target={val} suffix={suffix} /></p>
                            <p className="text-sm font-bold opacity-70 uppercase tracking-widest">{label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className="py-24 px-5 sm:px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-center mb-16">
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">Everything You Need</p>
                        <h2 className="playfair text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                            Built for Modern<br /><span className="text-orange-500 italic">Hostel Life</span>
                        </h2>
                        <p className="text-slate-400 max-w-md mx-auto text-base">Six powerful modules that cover every aspect of your hostel experience.</p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map(({ icon: Icon, title, desc, color }, i) => (
                            <motion.div key={title}
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-3xl border border-orange-100 p-6 hover:shadow-xl hover:shadow-orange-100 transition-all group">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                    <Icon size={22} className="text-white" />
                                </div>
                                <h3 className="font-black text-slate-800 text-base mb-2">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="howitworks" className="py-24 px-5 sm:px-8 bg-slate-900">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-center mb-16">
                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-3">Simple Process</p>
                        <h2 className="playfair text-4xl sm:text-5xl font-black text-white mb-4">
                            Up & Running in<br /><span className="text-orange-400 italic">3 Easy Steps</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {steps.map(({ num, title, desc }, i) => (
                            <motion.div key={num}
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                                className="relative bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all">
                                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-orange-900/50">
                                    <span className="playfair text-white font-black text-xl">{num}</span>
                                </div>
                                <h3 className="font-black text-white text-lg mb-3">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/3 -right-3 text-orange-500 text-2xl font-black z-10">→</div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-center mt-12">
                        <button onClick={() => navigate('/register')}
                            className="inline-flex items-center gap-2 bg-orange-500 text-white font-black px-10 py-4 rounded-2xl hover:bg-orange-400 transition-all shadow-xl shadow-orange-900/30 active:scale-95 text-sm">
                            Start Now — It's Free <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-24 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">Student Reviews</p>
                    <h2 className="playfair text-4xl sm:text-5xl font-black text-slate-900 mb-12">
                        What Students <span className="text-orange-500 italic">Say</span>
                    </h2>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTestimonial}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="bg-white border border-orange-100 rounded-3xl p-8 shadow-xl shadow-orange-100">
                                <div className="flex items-center justify-center gap-1 mb-5">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f97415" className="text-orange-500" />)}
                                </div>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6 italic">
                                    "{testimonials[activeTestimonial].text}"
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-black text-lg">
                                        {testimonials[activeTestimonial].avatar}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-slate-800 text-sm">{testimonials[activeTestimonial].name}</p>
                                        <p className="text-xs text-slate-400">{testimonials[activeTestimonial].dept}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center gap-2 mt-6">
                            {testimonials.map((_, i) => (
                                <button key={i} onClick={() => setActiveTestimonial(i)}
                                    className={`h-2 rounded-full transition-all ${i === activeTestimonial ? 'w-8 bg-orange-500' : 'w-2 bg-orange-200'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="py-20 px-5 sm:px-8 mx-5 sm:mx-8 mb-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-[3rem] overflow-hidden relative">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="relative max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="playfair text-4xl sm:text-5xl font-black text-white mb-4">
                            Ready to Experience<br />Smarter Hostel Life?
                        </h2>
                        <p className="text-white/80 text-base mb-8">Join 200+ students already managing their hostel life digitally.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button onClick={() => navigate('/register')}
                                className="bg-white text-orange-500 font-black px-10 py-4 rounded-2xl hover:bg-orange-50 transition-all shadow-xl active:scale-95 text-sm">
                                Get Started Free →
                            </button>
                            <button onClick={() => navigate('/login')}
                                className="bg-white/20 text-white font-black px-10 py-4 rounded-2xl border border-white/30 hover:bg-white/30 transition-all text-sm">
                                Login to Dashboard
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTACT / FOOTER ── */}
            <section id="contact" className="py-16 px-5 sm:px-8 border-t border-orange-100">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={17} className="text-white" />
                            </div>
                            <span className="font-black text-slate-900 tracking-tight">DNYANDA</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">Smart hostel management for the modern student. Safe, transparent, efficient.</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Contact</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={14} className="text-orange-400" /> Hostel Block A, Main Campus, Pune</div>
                            <div className="flex items-center gap-2 text-sm text-slate-500"><Phone size={14} className="text-orange-400" /> +91 98765 43210</div>
                            <div className="flex items-center gap-2 text-sm text-slate-500"><Mail size={14} className="text-orange-400" /> help@dnyanda.edu</div>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Quick Links</p>
                        <div className="space-y-2">
                            {[['Login', '/login'], ['Register', '/register'], ['Resources', '/resources'], ['Legal', '/legal']].map(([label, path]) => (
                                <button key={label} onClick={() => navigate(path)}
                                    className="block text-sm text-slate-500 hover:text-orange-500 transition-colors font-medium">
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-orange-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© {new Date().getFullYear()} Dnyanda Hostel Management System</p>
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Built for Excellence ✦</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
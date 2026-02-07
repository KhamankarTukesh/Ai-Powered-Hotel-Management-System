import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Mail, Phone, MapPin, Instagram, Facebook, 
    Twitter, ShieldCheck, ExternalLink 
} from 'lucide-react';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-transparent border-t border-slate-200/50 pt-16 pb-8 w-full mt-auto">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Column 1: Brand & Mission */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-200">
                                <ShieldCheck size={24} />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tight">DNYANDA</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            A dedicated ecosystem for student housing, focusing on safety, transparency, and academic growth through smart management.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2.5 bg-slate-50 rounded-full text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"><Instagram size={18}/></a>
                            <a href="#" className="p-2.5 bg-slate-50 rounded-full text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"><Twitter size={18}/></a>
                            <a href="#" className="p-2.5 bg-slate-50 rounded-full text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"><Facebook size={18}/></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Navigation */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Navigation</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            {['Dashboard', 'Attendance', 'Room Status', 'Complaints', 'Mess Menu'].map((item) => (
                                <li key={item} className="flex items-center gap-2 hover:text-orange-600 cursor-pointer transition-colors group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-200 group-hover:bg-orange-500 transition-colors" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Student Resources */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Resources</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li className="hover:text-slate-800 cursor-pointer">Emergency Contacts</li>
                            <li className="hover:text-slate-800 cursor-pointer">Hostel Rules & PDF</li>
                            <li className="hover:text-slate-800 cursor-pointer">Leave Application Guide</li>
                            <li className="hover:text-slate-800 cursor-pointer flex items-center gap-1">
                                Academic Calendar <ExternalLink size={12}/>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Support */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Contact Support</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-sm text-slate-600 bg-orange-50/50 p-3 rounded-2xl border border-orange-100/50">
                                <MapPin size={18} className="text-orange-500 shrink-0" />
                                <span>Main Education Campus,<br/>Hostel Block A, Pune.</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 px-3">
                                <Phone size={18} className="text-orange-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 px-3">
                                <Mail size={18} className="text-orange-500 shrink-0" />
                                <span>help@dnyanda.edu</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    <p>© {currentYear} DNYANDA HOSTEL MANAGEMENT SYSTEM</p>
                    <div className="flex gap-6">
                        <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
                        <span className="hover:text-slate-600 cursor-pointer">Terms</span>
                        <span className="text-orange-500/50">Built for Excellence</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
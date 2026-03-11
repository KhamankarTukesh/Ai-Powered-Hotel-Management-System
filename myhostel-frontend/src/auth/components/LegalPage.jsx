import React, { useState } from 'react';
import { ChevronLeft, Shield, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sections = {
    privacy: {
        icon: Shield,
        title: 'Privacy Policy',
        updated: 'January 2025',
        content: [
            { heading: 'Information We Collect', text: 'We collect your name, email, phone number, room details, and hostel activity data to manage your stay effectively.' },
            { heading: 'How We Use It', text: 'Your data is used for attendance tracking, leave management, fee processing, and hostel communications only.' },
            { heading: 'Data Sharing', text: 'We do not sell or share your personal data with third parties. Information is shared only with hostel staff for management purposes.' },
            { heading: 'Data Security', text: 'All data is encrypted and stored securely. Passwords are hashed and never stored in plain text.' },
            { heading: 'Your Rights', text: 'You can request access, correction, or deletion of your personal data by contacting the hostel admin office.' },
            { heading: 'Contact', text: 'For privacy concerns, email us at help@dnyanda.edu or visit the admin office at Hostel Block A, Pune.' },
        ]
    },
    terms: {
        icon: FileText,
        title: 'Terms of Use',
        updated: 'January 2025',
        content: [
            { heading: 'Acceptance', text: 'By using the Dnyanda Hostel Management System, you agree to these terms. If you disagree, please discontinue use.' },
            { heading: 'Account Responsibility', text: 'You are responsible for maintaining the confidentiality of your login credentials. Do not share your account with others.' },
            { heading: 'Acceptable Use', text: 'The portal is for hostel management purposes only. Misuse, hacking attempts, or unauthorized access will result in account suspension.' },
            { heading: 'Leave & Gate Pass', text: 'Gate passes generated through the portal are official documents. Misuse or forgery of gate passes is a serious violation.' },
            { heading: 'Limitation of Liability', text: 'Dnyanda Hostel is not liable for any indirect or consequential damages arising from the use of this platform.' },
            { heading: 'Changes', text: 'We reserve the right to update these terms at any time. Continued use of the portal means acceptance of updated terms.' },
        ]
    }
};

const LegalPage = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState('privacy');
    const page = sections[active];
    const Icon = page.icon;

    return (
        <div className="min-h-screen bg-[#fdf9f6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');`}</style>

            {/* Header */}
            <div className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl border border-orange-100 flex items-center justify-center hover:bg-orange-50 transition-all">
                            <ChevronLeft size={16} className="text-slate-500" />
                        </button>
                        <h1 className="font-black text-slate-800 text-base">Legal</h1>
                    </div>
                    {/* Toggle */}
                    <div className="flex gap-1 bg-orange-50 p-1 rounded-xl border border-orange-100">
                        {['privacy', 'terms'].map(tab => (
                            <button key={tab} onClick={() => setActive(tab)}
                                className={`text-xs font-black px-4 py-1.5 rounded-lg transition-all capitalize ${active === tab ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                {tab === 'privacy' ? 'Privacy' : 'Terms'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

                {/* Title */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
                        <Icon size={18} className="text-orange-500" />
                    </div>
                    <div>
                        <h2 className="font-black text-slate-800 text-xl">{page.title}</h2>
                        <p className="text-slate-400 text-xs">Last updated: {page.updated}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-5">
                    {page.content.map(({ heading, text }, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-orange-100 p-5">
                            <p className="font-black text-slate-800 text-sm mb-1.5">{i + 1}. {heading}</p>
                            <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-5 text-center">
                    <p className="text-slate-500 text-xs">Questions? Contact us at <span className="text-orange-500 font-bold">help@dnyanda.edu</span></p>
                </div>

                <button onClick={() => navigate(-1)}
                    className="w-full mt-5 flex items-center justify-center gap-2 bg-white border border-orange-200 text-orange-500 font-black text-sm py-3.5 rounded-2xl hover:bg-orange-50 transition-all">
                    <ChevronLeft size={16} /> Go Back
                </button>
            </div>

            <div className="border-t border-orange-100 mt-4 py-5 text-center">
                <p className="text-xs text-slate-300 font-medium">© {new Date().getFullYear()} Dnyanda Hostel Management System</p>
            </div>
        </div>
    );
};

export default LegalPage;
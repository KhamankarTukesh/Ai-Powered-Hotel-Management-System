import React, { useState, useEffect } from 'react';
import API from '../../api/axios'; 
import { formatDistanceToNow } from 'date-fns';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
               
                const response = await API.get('/notice/all'); 
                setNotices(response.data);
            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    // Logic for Image 4d8e1b data mapping
    const filteredNotices = filter === 'All' 
        ? notices 
        : notices.filter(n => n.category === filter || (filter === 'Urgent' && n.isEmergency));

    if (loading) return (
        <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
            <div className="text-[#ff6a00] font-bold animate-pulse">Loading Hostel Notices...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFF7ED] p-6 lg:p-10 font-sans">
            <div className="max-w-4xl mx-auto">
                
                {/* 1. Filter Pills (Design from Image 4e7316) */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                    {['All', 'Urgent', 'Event', 'General', 'Fee'].map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                                filter === cat ? 'bg-[#181411] text-white' : 'bg-white text-[#8c725f]'
                            }`}
                        >
                            {cat === 'All' ? 'All Notices' : cat}
                        </button>
                    ))}
                </div>

                {/* 2. Notices Feed */}
                <div className="flex flex-col gap-6">
                    {filteredNotices.length === 0 ? (
                        <div className="bg-white p-12 rounded-[32px] text-center border-2 border-dashed border-orange-100">
                            <span className="material-symbols-outlined text-5xl text-orange-200 mb-4">notifications_off</span>
                            <p className="text-[#8c725f] font-medium">No {filter} notices found.</p>
                        </div>
                    ) : (
                        filteredNotices.map((notice) => (
                            <div 
                                key={notice._id}
                                className={`bg-white rounded-[24px] p-6 shadow-sm border transition-all ${
                                    notice.isEmergency ? 'border-red-200 bg-red-50/20 ring-1 ring-red-100' : 'border-slate-100'
                                }`}
                            >
                                {/* Warden Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-[#ff6a00] font-bold">
                                            {/* Handles "Warden Sharma" logic from your DB */}
                                            {notice.postedBy?.fullName?.charAt(0) || 'W'}
                                        </div>
                                        <div>
                                            <p className="text-[#181411] font-bold text-sm leading-tight">
                                                {notice.postedBy?.fullName || "Hostel Warden"}
                                            </p>
                                            <p className="text-[#8c725f] text-[11px] mt-1">
                                                {formatDistanceToNow(new Date(notice.createdAt))} ago • {notice.category}
                                            </p>
                                        </div>
                                    </div>
                                    {notice.isEmergency && (
                                        <div className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                            <span className="material-symbols-outlined text-[14px]">campaign</span>
                                            Urgent
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-[#181411] text-lg font-black mb-2 tracking-tight">
                                    {notice.title}
                                </h2>
                                <p className="text-[#8c725f] text-sm leading-relaxed mb-4">
                                    {notice.content}
                                </p>

                                {/* PDF View (Cloudinary logic) */}
                                {notice.attachmentUrl && (
                                    <div className="flex items-center justify-between bg-[#f8f7f5] p-3 rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-3 text-[#181411] text-xs font-bold">
                                            <span className="material-symbols-outlined text-red-500">description</span>
                                            Official_Document.pdf
                                        </div>
                                        <a 
                                            href={notice.attachmentUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="bg-[#ff6a00] text-white text-[11px] font-bold px-5 py-2 rounded-full hover:bg-orange-600 shadow-sm"
                                        >
                                            View
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notices;
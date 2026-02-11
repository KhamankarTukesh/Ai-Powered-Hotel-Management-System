import React, { useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

const ActivityHistory = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async (e) => {
        if (e) e.preventDefault();

        try {
            setLoading(true);
            const { data } = await API.get(`/activities?rollNumber=${rollNumber}`);
            setActivities(data);

            if (data.length === 0) {
                toast.error("No activity found for this roll number");
            } else {
                toast.success("Logs fetched successfully!");
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error(error.response?.data?.error || "Student not found or Server error");
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50/30 px-4 sm:px-6 md:px-8 py-6 md:py-10">

            <div className="max-w-3xl lg:max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-orange-600 tracking-tight uppercase">
                        Activity Timeline
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 font-medium">
                        Hostel In/Out History Tracker
                    </p>
                </div>

                {/* Search Form */}
                <form
                    onSubmit={fetchHistory}
                    className="flex flex-col md:flex-row gap-3 md:gap-4 mb-10 sm:mb-12"
                >

                    {/* Input */}
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-xl">
                            person_search
                        </span>

                        <input
                            type="text"
                            placeholder="Enter Roll Number (e.g. 124BT12000)"
                            className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-2xl border-2 border-orange-100 outline-none focus:border-orange-500 bg-white shadow-sm transition-all font-semibold text-sm sm:text-base"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                            required
                        />
                    </div>

                    {/* Button */}
                    <button
                        disabled={loading}
                        className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-black shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-50 text-sm sm:text-base"
                    >
                        {loading ? "SEARCHING..." : "SEARCH"}
                    </button>

                </form>

                {/* Activity List */}
                <div className="space-y-5 sm:space-y-6">

                    {activities.length > 0 ? (

                        activities.map((log) => (

                            <div
                                key={log._id}
                                className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border-l-8 border-orange-500 hover:shadow-md transition-all group overflow-hidden"
                            >

                                {/* Top Row */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">

                                    {/* Date + Time */}
                                    <div className="flex flex-col">
                                        <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {new Date(log.createdAt || log.timestamp).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>

                                        <span className="text-[10px] sm:text-xs font-bold text-gray-400">
                                            {new Date(log.createdAt || log.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    {/* Action Badge */}
                                    <span
                                        className={`self-start sm:self-auto px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase whitespace-nowrap ${
                                            log.action === 'Check-in'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                        }`}
                                    >
                                        {log.action}
                                    </span>

                                </div>

                                {/* Description */}
                                <h3 className="text-gray-800 font-bold text-sm sm:text-base md:text-lg mb-3 break-words">
                                    {log.description}
                                </h3>

                                {/* Student Info */}
                                <div className="pt-3 border-t border-gray-50 flex items-center gap-2 sm:gap-3 flex-wrap">

                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-100 flex items-center justify-center text-[10px] sm:text-xs font-bold text-orange-600 flex-shrink-0">
                                        {log.student?.fullName?.charAt(0)}
                                    </div>

                                    <p className="text-[11px] sm:text-xs text-gray-500 font-medium break-words">
                                        {log.student?.fullName}
                                        <span className="text-orange-500">
                                            {" "}• Roll: {log.student?.studentDetails?.rollNumber}
                                        </span>
                                    </p>

                                </div>

                            </div>

                        ))

                    ) : (

                        !loading && (

                            <div className="text-center py-16 sm:py-20 bg-white/50 rounded-[2.5rem] sm:rounded-[3rem] border-4 border-dashed border-orange-100 px-4">
                                <span className="material-symbols-outlined text-5xl sm:text-6xl text-orange-200 mb-4 block">
                                    history_toggle_off
                                </span>

                                <p className="text-orange-300 font-bold italic text-sm sm:text-base">
                                    Enter a roll number to view the hostel journey.
                                </p>
                            </div>

                        )

                    )}

                </div>

            </div>

        </div>
    );
};

export default ActivityHistory;

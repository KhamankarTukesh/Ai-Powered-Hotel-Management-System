import React, { useState, useEffect } from 'react';
import {
    User, BadgeCheck, School, Calendar, Verified, Building,
    Layers, Bed, Lock, Clock, ArrowRight, Award, Plus, Send, Group, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';

const RoomDetails = ({ currentUserId }) => {
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false); // Submit loading state
    const [request, setRequest] = useState({
        currentRoomNumber: '',
        desiredRoomNumber: '',
        reason: ''
    });

    // Helper to get ID (Checks prop, then storage _id, then storage id)
    const getActiveId = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        return currentUserId || storedUser?._id || storedUser?.id;
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            const activeId = getActiveId();
            console.log("Searching for ID:", activeId);

            if (!activeId) {
                setLoading(false);
                return;
            }

            try {
                const response = await API.get('/rooms');
                const rooms = response.data;

                // Loose matching logic for safety
                const myRoom = rooms.find(room =>
                    room.beds.some(bed => {
                        const bedStudentId = bed.studentId?._id || bed.studentId;
                        return bedStudentId && String(bedStudentId) === String(activeId);
                    })
                );

                console.log("Matched Room Found:", myRoom);

                if (myRoom) {
                    setRoomData(myRoom);
                    setRequest(prev => ({ ...prev, currentRoomNumber: myRoom.roomNumber }));
                }
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Data sync failed");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [currentUserId]);

    // ✅ ADDED: Missing handleRequestChange function to prevent crash
    const handleRequestChange = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Make sure this endpoint exists in your backend
            await API.post('/rooms/request-change', {
                studentId: getActiveId(),
                ...request
            });
            toast.success("Request submitted successfully!");
            setRequest(prev => ({ ...prev, desiredRoomNumber: '', reason: '' }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const currentId = getActiveId();
    const myBed = roomData?.beds.find(bed => String(bed.studentId?._id || bed.studentId) === String(currentId));
    const me = myBed?.studentId;
    const otherBeds = roomData?.beds.filter(bed => {
        const bid = bed.studentId?._id || bed.studentId;
        return bid && String(bid) !== String(currentId);
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-orange-500" size={40} />
                <p className="font-black text-orange-500 animate-pulse">Fetching room details...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f7f5] p-6 lg:p-10 font-sans antialiased text-[#181411]">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* TOP SECTION */}
                <div className="bg-white/85 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white overflow-hidden relative">
                    <div className="p-10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,116,21,0.5)]"></span>
                                <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em]">Live Residency</p>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter mt-2">
                                Room <span className="text-orange-500">{roomData?.roomNumber || "N/A"}</span>
                            </h1>
                        </div>
                        <div className="bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-200">
                            <Award size={14} /> Premium Deluxe
                        </div>
                    </div>

                    <div className="px-10 py-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-8 grid grid-cols-2 gap-6">
                            <InfoItem icon={<User size={18} />} label="Full Name" value={me?.fullName || "Not Assigned"} />
                            <InfoItem icon={<BadgeCheck size={18} />} label="Roll Number" value={me?.studentDetails?.rollNumber || "N/A"} />
                            <InfoItem icon={<School size={18} />} label="Department" value={me?.studentDetails?.department || "N/A"} />
                            <InfoItem icon={<Calendar size={18} />} label="Bed Number" value={myBed?.bedNumber || "None"} />
                        </div>

                        <div className="md:col-span-4 bg-orange-50 rounded-2xl p-6 border border-orange-100 flex flex-col items-center justify-center text-center">
                            <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-1">Monthly Rent</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black tracking-tight">₹{roomData?.price || "0"}</span>
                                <span className="text-slate-400 text-sm font-medium">/mo</span>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase">
                                <Verified size={12} /> {roomData?.status || "Status Unknown"}
                            </div>
                        </div>
                    </div>

                    {/* --- UPDATED COLORFUL TIMELINE SECTION --- */}
                    <div className="px-10 py-10 bg-gradient-to-br from-white to-orange-50/30 mt-4 border-t border-orange-100/50">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">

                            {/* Block Item */}
                            <TimelineItem
                                icon={<Building />}
                                title={roomData?.block || "N/A"}
                                sub="Building Block"
                                colorClass="bg-blue-500 shadow-blue-200 text-white"
                                active={true}
                            />

                            {/* Connecting Line 1 */}
                            <div className="hidden md:block h-1 flex-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-2 opacity-30"></div>

                            {/* Floor Item */}
                            <TimelineItem
                                icon={<Layers />}
                                title={`${roomData?.floor || '0'} Floor`}
                                sub="Residency Level"
                                colorClass="bg-purple-500 shadow-purple-200 text-white"
                                active={true}
                            />

                            {/* Connecting Line 2 */}
                            <div className="hidden md:block h-1 flex-1 bg-gradient-to-r from-purple-400 to-orange-400 rounded-full mx-2 opacity-30"></div>

                            {/* Bed Item */}
                            <TimelineItem
                                icon={<Bed />}
                                title={`Bed ${myBed?.bedNumber || 'N/A'}`}
                                sub="Your Assigned Spot"
                                colorClass="bg-orange-500 shadow-orange-200 text-white"
                                active={true}
                            />
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* --- ROOM OCCUPANCY STATUS (BEDS ARRAY) --- */}
                    <div className="lg:col-span-12 mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

                            {roomData?.beds?.map((bed, i) => {
                                const hasStudent = bed.studentId; // Check if student exists on this bed

                                return (
                                    <div key={i} className="h-full">
                                        {hasStudent ? (
                                            /* OCCUPIED BED CARD */
                                            <div className="bg-white border border-orange-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all relative h-full">
                                                <span className="absolute top-6 right-6 px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded-full">
                                                    Occupied
                                                </span>
                                                <div className="flex flex-col items-center text-center">
                                                    {/* Dynamic Avatar based on Name */}
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bed.studentId.fullName}`}
                                                        alt="avatar"
                                                        className="w-28 h-28 rounded-full border-4 border-orange-50 mb-4"
                                                    />
                                                    <h3 className="text-xl font-bold text-slate-800">{bed.studentId.fullName}</h3>
                                                    <p className="text-sm text-gray-500 mb-4">{bed.studentId.email}</p>

                                                    <div className="w-full pt-4 border-t border-orange-100 space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-400 font-medium">Department</span>
                                                            <span className="font-bold text-slate-700">
                                                                {bed.studentId.studentDetails?.department || "N/A"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-400 font-medium">Roll No.</span>
                                                            <span className="font-bold text-slate-700">
                                                                {bed.studentId.studentDetails?.rollNumber || "N/A"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm items-center">
                                                            <span className="text-gray-400 font-medium">Bed Spot</span>
                                                            <span className="font-black text-orange-500 flex items-center gap-1">
                                                                <Bed size={14} /> {bed.bedNumber}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* VACANT BED CARD */
                                            <div className="bg-orange-50/30 border-2 border-dashed border-orange-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center h-full group hover:bg-orange-50 transition-all">
                                                <h3 className="text-lg font-bold text-orange-400 uppercase tracking-tight">Available</h3>
                                                <p className="text-[10px] font-black text-orange-300 uppercase tracking-widest mb-3">
                                                    Bed {bed.bedNumber} - Vacant
                                                </p>
                                                <p className="text-xs text-gray-400 max-w-[150px]">
                                                    Ready for new assignment
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                        </div>
                    </div>

                    {/* Request Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white border border-orange-200 rounded-[2.5rem] p-10 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">Room Change Request</h2>
                            <form onSubmit={handleRequestChange} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Current Room</label>
                                        <input type="text" value={roomData?.roomNumber || ""} readOnly className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-500 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-orange-500 uppercase ml-1">Desired Room</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 102"
                                            className="w-full bg-orange-50/50 border-2 border-transparent focus:border-orange-500 rounded-2xl p-4 font-bold outline-none transition-all"
                                            value={request.desiredRoomNumber}
                                            onChange={(e) => setRequest({ ...request, desiredRoomNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-orange-500 uppercase ml-1">Reason</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="w-full bg-orange-50/50 border-2 border-transparent focus:border-orange-500 rounded-3xl p-4 outline-none transition-all resize-none"
                                        value={request.reason}
                                        onChange={(e) => setRequest({ ...request, reason: e.target.value })}
                                    ></textarea>
                                </div>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> SUBMIT REQUEST</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="border-l-2 border-orange-500/20 pl-4 py-1">
        <div className="flex items-center gap-2 text-orange-500 opacity-70">
            {icon}
            <p className="text-[10px] font-black uppercase tracking-wider">{label}</p>
        </div>
        <p className="text-lg font-bold mt-0.5">{value || "N/A"}</p>
    </div>
);

const TimelineItem = ({ icon, title, sub, active }) => (
    <div className="flex flex-col items-center gap-2">
        <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white border border-slate-100 text-orange-500'}`}>
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className="text-center">
            <p className="text-sm font-bold leading-tight">{title}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{sub}</p>
        </div>
    </div>
);

export default RoomDetails;
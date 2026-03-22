import React, { useState, useEffect } from 'react';
import {
    User, BadgeCheck, School, Calendar, Verified, Building,
    Layers, Bed, Award, Send, Loader2, ArrowLeftRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';

const RoomDetails = ({ currentUserId }) => {
    const [roomData, setRoomData]   = useState(null);
    const [allRooms, setAllRooms]   = useState([]); // ✅ All rooms for dropdown
    const [loading, setLoading]     = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [request, setRequest]     = useState({
        currentRoomNumber: '',
        desiredRoomNumber: '',
        reason: ''
    });

    const getActiveId = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        return currentUserId || storedUser?._id || storedUser?.id;
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            const activeId = getActiveId();
            if (!activeId) { setLoading(false); return; }

            try {
                const response = await API.get('/rooms');
                const rooms = response.data;
                setAllRooms(rooms); // ✅ Save all rooms for dropdown

                const myRoom = rooms.find(room =>
                    room.beds.some(bed => {
                        const bedStudentId = bed.studentId?._id || bed.studentId;
                        return bedStudentId && String(bedStudentId) === String(activeId);
                    })
                );

                if (myRoom) {
                    setRoomData(myRoom);
                    setRequest(prev => ({ ...prev, currentRoomNumber: myRoom.roomNumber }));
                }
            } catch (error) {
                toast.error("Data sync failed");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [currentUserId]);

    const handleRequestChange = async (e) => {
        e.preventDefault();
        if (!request.desiredRoomNumber) return toast.error("Please select a desired room");
        if (request.desiredRoomNumber === request.currentRoomNumber)
            return toast.error("Desired room cannot be same as current room");

        setSubmitting(true);
        try {
            await API.post('/rooms/request-change', {
                studentId: getActiveId(),
                ...request
            });
            toast.success("Room change request submitted!");
            setRequest(prev => ({ ...prev, desiredRoomNumber: '', reason: '' }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const currentId = getActiveId();
    const myBed = roomData?.beds.find(
        bed => String(bed.studentId?._id || bed.studentId) === String(currentId)
    );
    const me = myBed?.studentId;

    // ✅ Available rooms = rooms that are NOT current room AND have available beds
    const availableRooms = allRooms.filter(room =>
        room.roomNumber !== roomData?.roomNumber &&
        room.beds.some(bed => !bed.isOccupied)
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-orange-500" size={40} />
                <p className="font-black text-orange-500 animate-pulse">Fetching room details...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f7f5] p-4 sm:p-6 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── TOP CARD ── */}
                <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-xl border overflow-hidden">

                    {/* Header */}
                    <div className="p-6 sm:p-10 flex flex-col md:flex-row justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                                <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">Live Residency</p>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-2">
                                Room <span className="text-orange-500">{roomData?.roomNumber || "N/A"}</span>
                            </h1>
                        </div>
                        <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 self-start md:self-center">
                            <Award size={14} /> Premium Deluxe
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="px-6 sm:px-10 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InfoItem icon={<User size={18} />}       label="Full Name"    value={me?.fullName} />
                            <InfoItem icon={<BadgeCheck size={18} />} label="Roll Number"  value={me?.studentDetails?.rollNumber} />
                            <InfoItem icon={<School size={18} />}     label="Department"   value={me?.studentDetails?.department} />
                            <InfoItem icon={<Calendar size={18} />}   label="Bed Number"   value={myBed?.bedNumber} />
                        </div>
                        <div className="lg:col-span-4 bg-orange-50 rounded-2xl p-6 text-center flex flex-col justify-center">
                            <p className="text-orange-500 text-[10px] font-black uppercase">Monthly Rent</p>
                            <span className="text-3xl sm:text-4xl font-black">₹{roomData?.price || "0"}</span>
                            <div className="mt-3 text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full inline-flex items-center justify-center gap-1">
                                <Verified size={12} /> {roomData?.status}
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="px-6 sm:px-10 py-8 bg-gradient-to-br from-white to-orange-50/30 border-t">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <TimelineItem icon={<Building />} title={roomData?.block}          sub="Building Block" />
                            <TimelineItem icon={<Layers />}   title={`${roomData?.floor} Floor`} sub="Residency Level" />
                            <TimelineItem icon={<Bed />}       title={`Bed ${myBed?.bedNumber}`} sub="Your Spot" />
                        </div>
                    </div>
                </div>

                {/* ── BEDS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roomData?.beds?.map((bed, i) => {
                        const hasStudent = bed.studentId;
                        return (
                            <div key={i} className="h-full">
                                {hasStudent ? (
                                    <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md h-full relative">
                                        <span className="absolute top-4 right-4 text-[10px] bg-orange-500 text-white px-3 py-1 rounded-full">Occupied</span>
                                        <div className="flex flex-col items-center text-center">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bed.studentId.fullName}`} alt="avatar" className="w-24 h-24 rounded-full border mb-4" />
                                            <h3 className="text-lg font-bold">{bed.studentId.fullName}</h3>
                                            <p className="text-xs text-gray-500 mb-4">{bed.studentId.email}</p>
                                            <div className="w-full border-t pt-4 space-y-2 text-sm">
                                                <Row label="Department" value={bed.studentId.studentDetails?.department} />
                                                <Row label="Roll No."   value={bed.studentId.studentDetails?.rollNumber} />
                                                <Row label="Bed Spot"   value={<span className="text-orange-500 font-bold">{bed.bedNumber}</span>} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-full">
                                        <h3 className="text-lg font-bold text-orange-400">Available</h3>
                                        <p className="text-xs text-gray-400">Bed {bed.bedNumber} Vacant</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ── ROOM CHANGE REQUEST FORM ── */}
                <div className="bg-white border border-orange-200 rounded-3xl p-6 sm:p-10 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                            <ArrowLeftRight size={18} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-800">Room Change Request</h2>
                            <p className="text-xs text-slate-400 font-medium">Select an available room from the list</p>
                        </div>
                    </div>

                    <form onSubmit={handleRequestChange} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Current Room — read only */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Current Room</label>
                                <div className="w-full bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 font-bold text-slate-700 text-sm">
                                    {roomData?.roomNumber || 'Not Assigned'} — Block {roomData?.block}, Floor {roomData?.floor}
                                </div>
                            </div>

                            {/* ✅ Desired Room — dropdown with available rooms */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                                    Desired Room <span className="text-orange-500">({availableRooms.length} available)</span>
                                </label>
                                <select
                                    required
                                    value={request.desiredRoomNumber}
                                    onChange={(e) => setRequest({ ...request, desiredRoomNumber: e.target.value })}
                                    className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300/40 appearance-none cursor-pointer"
                                >
                                    <option value="">-- Select a room --</option>
                                    {availableRooms.map(room => {
                                        const availableBeds = room.beds.filter(b => !b.isOccupied).length;
                                        return (
                                            <option key={room._id} value={room.roomNumber}>
                                                Room {room.roomNumber} — Block {room.block}, Floor {room.floor} ({availableBeds} bed{availableBeds > 1 ? 's' : ''} free) · ₹{room.price}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Reason for Request</label>
                            <textarea
                                required
                                rows="4"
                                placeholder="Explain why you want to change your room..."
                                className="w-full bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-orange-300/40"
                                value={request.reason}
                                onChange={(e) => setRequest({ ...request, reason: e.target.value })}
                            />
                        </div>

                        <button disabled={submitting}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-2xl flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-60 text-sm shadow-md shadow-orange-200">
                            {submitting ? <Loader2 className="animate-spin" size={16} /> : <><Send size={15} /> Submit Request</>}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

/* ── SMALL COMPONENTS ── */
const InfoItem = ({ icon, label, value }) => (
    <div className="border-l-2 border-orange-500/20 pl-4">
        <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase">{icon}{label}</div>
        <p className="text-base sm:text-lg font-bold">{value || "N/A"}</p>
    </div>
);

const TimelineItem = ({ icon, title, sub }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="p-3 rounded-2xl bg-orange-500 text-white">{React.cloneElement(icon, { size: 20 })}</div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-[9px] uppercase text-slate-400">{sub}</p>
    </div>
);

const Row = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold">{value || "N/A"}</span>
    </div>
);

export default RoomDetails;
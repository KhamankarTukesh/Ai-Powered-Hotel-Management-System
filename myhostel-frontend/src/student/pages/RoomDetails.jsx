import React, { useState, useEffect } from 'react';
import {
    User, BadgeCheck, School, Calendar, Verified, Building,
    Layers, Bed, Award, Send, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';

const RoomDetails = ({ currentUserId }) => {
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [request, setRequest] = useState({
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

            if (!activeId) {
                setLoading(false);
                return;
            }

            try {
                const response = await API.get('/rooms');
                const rooms = response.data;

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
        setSubmitting(true);

        try {
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

    const myBed = roomData?.beds.find(
        bed => String(bed.studentId?._id || bed.studentId) === String(currentId)
    );

    const me = myBed?.studentId;

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-orange-500" size={40} />
                    <p className="font-black text-orange-500 animate-pulse">
                        Fetching room details...
                    </p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#f8f7f5] p-4 sm:p-6 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* TOP CARD */}
                <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-xl border overflow-hidden">

                    {/* HEADER */}
                    <div className="p-6 sm:p-10 flex flex-col md:flex-row justify-between gap-6">

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                                <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">
                                    Live Residency
                                </p>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-2">
                                Room <span className="text-orange-500">
                                    {roomData?.roomNumber || "N/A"}
                                </span>
                            </h1>
                        </div>

                        <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 self-start md:self-center">
                            <Award size={14} /> Premium Deluxe
                        </div>

                    </div>

                    {/* USER INFO */}
                    <div className="px-6 sm:px-10 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* LEFT INFO */}
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InfoItem icon={<User size={18} />} label="Full Name" value={me?.fullName} />
                            <InfoItem icon={<BadgeCheck size={18} />} label="Roll Number" value={me?.studentDetails?.rollNumber} />
                            <InfoItem icon={<School size={18} />} label="Department" value={me?.studentDetails?.department} />
                            <InfoItem icon={<Calendar size={18} />} label="Bed Number" value={myBed?.bedNumber} />
                        </div>

                        {/* PRICE BOX */}
                        <div className="lg:col-span-4 bg-orange-50 rounded-2xl p-6 text-center flex flex-col justify-center">
                            <p className="text-orange-500 text-[10px] font-black uppercase">
                                Monthly Rent
                            </p>

                            <span className="text-3xl sm:text-4xl font-black">
                                ₹{roomData?.price || "0"}
                            </span>

                            <div className="mt-3 text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full inline-flex items-center justify-center gap-1">
                                <Verified size={12} /> {roomData?.status}
                            </div>
                        </div>

                    </div>

                    {/* TIMELINE */}
                    <div className="px-6 sm:px-10 py-8 bg-gradient-to-br from-white to-orange-50/30 border-t">

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                            <TimelineItem icon={<Building />} title={roomData?.block} sub="Building Block" />

                            <TimelineItem icon={<Layers />} title={`${roomData?.floor} Floor`} sub="Residency Level" />

                            <TimelineItem icon={<Bed />} title={`Bed ${myBed?.bedNumber}`} sub="Your Spot" />

                        </div>

                    </div>

                </div>

                {/* BEDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {roomData?.beds?.map((bed, i) => {

                        const hasStudent = bed.studentId;

                        return (
                            <div key={i} className="h-full">

                                {hasStudent ? (
                                    <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md h-full">

                                        <span className="absolute top-4 right-4 text-[10px] bg-orange-500 text-white px-3 py-1 rounded-full">
                                            Occupied
                                        </span>

                                        <div className="flex flex-col items-center text-center">

                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bed.studentId.fullName}`}
                                                alt="avatar"
                                                className="w-24 h-24 rounded-full border mb-4"
                                            />

                                            <h3 className="text-lg font-bold">
                                                {bed.studentId.fullName}
                                            </h3>

                                            <p className="text-xs text-gray-500 mb-4">
                                                {bed.studentId.email}
                                            </p>

                                            <div className="w-full border-t pt-4 space-y-2 text-sm">

                                                <Row label="Department" value={bed.studentId.studentDetails?.department} />

                                                <Row label="Roll No." value={bed.studentId.studentDetails?.rollNumber} />

                                                <Row
                                                    label="Bed Spot"
                                                    value={<span className="text-orange-500 font-bold">{bed.bedNumber}</span>}
                                                />

                                            </div>

                                        </div>

                                    </div>
                                ) : (

                                    <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-full">
                                        <h3 className="text-lg font-bold text-orange-400">
                                            Available
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            Bed {bed.bedNumber} Vacant
                                        </p>
                                    </div>

                                )}

                            </div>
                        );
                    })}

                </div>

                {/* REQUEST FORM */}
                <div className="bg-white border border-orange-200 rounded-3xl p-6 sm:p-10 shadow-sm">

                    <h2 className="text-xl sm:text-2xl font-bold mb-6">
                        Room Change Request
                    </h2>

                    <form onSubmit={handleRequestChange} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input label="Current Room" value={roomData?.roomNumber} disabled />

                            <Input
                                label="Desired Room"
                                value={request.desiredRoomNumber}
                                onChange={(e) => setRequest({ ...request, desiredRoomNumber: e.target.value })}
                            />

                        </div>

                        <textarea
                            required
                            rows="4"
                            className="w-full bg-orange-50 rounded-2xl p-4 outline-none"
                            value={request.reason}
                            onChange={(e) => setRequest({ ...request, reason: e.target.value })}
                        />

                        <button
                            disabled={submitting}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2"
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : <><Send size={16} /> Submit</>}
                        </button>

                    </form>

                </div>

            </div>
        </div>
    );
};

/* SMALL COMPONENTS */

const InfoItem = ({ icon, label, value }) => (
    <div className="border-l-2 border-orange-500/20 pl-4">
        <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase">
            {icon}
            {label}
        </div>
        <p className="text-base sm:text-lg font-bold">{value || "N/A"}</p>
    </div>
);

const TimelineItem = ({ icon, title, sub }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="p-3 rounded-2xl bg-orange-500 text-white">
            {React.cloneElement(icon, { size: 20 })}
        </div>
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

const Input = ({ label, value, onChange, disabled }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">
            {label}
        </label>
        <input
            value={value || ""}
            onChange={onChange}
            disabled={disabled}
            className="w-full bg-orange-50 rounded-xl p-3 font-semibold"
        />
    </div>
);

export default RoomDetails;

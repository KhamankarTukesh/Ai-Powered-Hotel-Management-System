import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AttendanceManager = () => {
    const [students, setStudents] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [report, setReport] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const downloadReport = () => {
        if (report.length === 0) return toast.error("No data to download");

        const doc = new jsPDF();

        // PDF Header
        doc.setFontSize(18);
        doc.text("Daily Attendance Report", 14, 20);
        doc.setFontSize(11);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

        // Table Data
        const tableColumn = ["Student Name", "Room No", "Status"];
        const tableRows = report.map(item => [
            item.student?.fullName || "N/A",
            item.student?.roomNo || item.student?.roomNumber || "N/A",
            item.status
        ]);

        // CHANGE HERE: Use autoTable as a function, not a doc method
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [249, 116, 21] }
        });

        doc.save(`Attendance_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("PDF Downloaded!");
    };
    // --- 2. DELETE REPORT LOGIC ---
    const handleDeleteDailyReport = async () => {
        if (!window.confirm("Warning: Are you sure you want to clear today's attendance from the database?")) return;

        try {
            setLoading(true);
            await API.delete('/attendance/daily-report');
            toast.success("Today's report cleared!");

            // UI Update: Report khali kar do aur switches ko wapas default kar do
            setReport([]);
            const defaults = {};
            students.forEach(s => { defaults[s._id] = "Present"; });
            setAttendanceMap(defaults);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete records");
        } finally {
            setLoading(false);
        }
    };

    // --- 3. FETCH & SYNC LOGIC ---
const fetchDailyReport = useCallback(async (shouldUpdateSwitches = false) => {
    try {
        const { data } = await API.get(`/attendance/daily-report?t=${new Date().getTime()}`);
        let reportData = Array.isArray(data) ? data : [];

        // --- ROOM NUMBER FIX START ---
        // Agar backend room info nahi bhej raha, toh hum students list se match karenge
        const enrichedReport = reportData.map(item => {
            const studentId = item.student?._id || item.student;
            // Hum students list mein se matching student dhoond rahe hain
            const studentInfo = students.find(s => s._id === studentId);

            return {
                ...item,
                student: {
                    ...item.student,
                    // Pehle se hai toh wahi rakho, nahi toh students list se uthao
                    fullName: item.student?.fullName || studentInfo?.fullName || "Unknown",
                    roomNo: item.student?.roomNo || studentInfo?.roomNo || "N/A"
                }
            };
        });
        // --- ROOM NUMBER FIX END ---

        setReport(enrichedReport);

        if (shouldUpdateSwitches === true && enrichedReport.length > 0) {
            setAttendanceMap(prev => {
                const syncedMap = { ...prev };
                enrichedReport.forEach(item => {
                    const id = item.student?._id || item.student;
                    if (id) syncedMap[id] = item.status;
                });
                return syncedMap;
            });
        }
    } catch (err) {
        console.error("Sync Error:", err);
    }
}, [students]); // Yahan 'students' dependency hona zaroori hai

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const { data: roomData } = await API.get('/rooms');
            const allStudents = roomData.flatMap(room =>
                (room.beds || [])
                    .filter(bed => bed.isOccupied && bed.studentId)
                    .map(bed => ({
                        _id: bed.studentId._id || bed.studentId,
                        fullName: bed.studentId.fullName || "Student",
                        roomNo: room.roomNumber,
                        course: bed.studentId.course || "Resident"
                    }))
            );

            setStudents(allStudents);
            const defaults = {};
            allStudents.forEach(s => { defaults[s._id] = "Present"; });
            setAttendanceMap(defaults);

            await fetchDailyReport(true);
        } catch (err) {
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInitialData(); }, []);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                attendanceData: Object.entries(attendanceMap).map(([id, status]) => ({
                    studentId: id,
                    status: status
                }))
            };
            await API.post('/attendance/mark', payload);
            toast.success("Saved Successfully!");
            await fetchDailyReport(false);
        } catch (err) {
            toast.error("Failed to save");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roomNo?.toString().includes(searchTerm)
    );

    return (
        <div className="bg-[#f8f7f5] text-[#181411] font-sans min-h-screen flex flex-col overflow-hidden">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e5e5; border-radius: 20px; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-80px)]">

                {/* LEFT: MARK ATTENDANCE */}
                <section className="lg:col-span-5 xl:col-span-4 flex flex-col bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden h-full relative">
                    <div className="p-6 pb-2 shrink-0 bg-white">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-[#181411]">Mark Attendance</h2>
                                <p className="text-sm text-[#8c725f] mt-1">Review student presence</p>
                            </div>
                            <div className="bg-[#f97415]/10 text-[#f97415] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Live</div>
                        </div>

                        <div className="relative w-full mb-4">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8c725f]">search</span>
                            <input
                                className="block w-full pl-11 pr-4 py-3.5 bg-[#f8f7f5] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#f97415]/30 outline-none transition-all"
                                placeholder="Type name or room..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-2 pb-24 space-y-3">
                        {filteredStudents.map((student) => (
                            <div key={student._id} className="flex items-center justify-between p-4 bg-[#f8f7f5] rounded-2xl group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-white flex items-center justify-center font-bold text-[#f97415] shadow-sm uppercase">
                                        {student.fullName[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#181411]">{student.fullName}</p>
                                        <p className="text-[10px] text-[#8c725f] font-bold uppercase tracking-tight">Room {student.roomNo}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={attendanceMap[student._id] === "Present"}
                                        onChange={(e) => setAttendanceMap(prev => ({
                                            ...prev,
                                            [student._id]: e.target.checked ? "Present" : "Absent"
                                        }))}
                                    />
                                    <div className="w-12 h-7 bg-gray-200 rounded-full peer peer-checked:bg-[#22c55e] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full bg-[#f97415] hover:bg-[#e66a13] text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">{submitting ? 'hourglass_empty' : 'done_all'}</span>
                            {submitting ? 'SYNCING...' : 'CONFIRM ATTENDANCE'}
                        </button>
                    </div>
                </section>

                {/* RIGHT: DAILY REPORT WITH PDF & DELETE */}
                <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Daily Report</h2>
                                <p className="text-sm text-[#8c725f] mt-1">Status from database</p>
                            </div>

                            <div className="flex gap-2">
                                {/* DOWNLOAD PDF BUTTON */}
                                <button
                                    onClick={downloadReport}
                                    className="flex items-center gap-2 bg-blue-50 text-blue-600 font-bold py-2.5 px-4 rounded-xl hover:bg-blue-100 transition-all text-sm border border-blue-100"
                                >
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    PDF
                                </button>

                                {/* DELETE REPORT BUTTON */}
                                <button
                                    onClick={handleDeleteDailyReport}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 font-bold py-2.5 px-4 rounded-xl hover:bg-red-100 transition-all text-sm border border-red-100"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                    Clear
                                </button>

                                <button
                                    onClick={() => fetchDailyReport(false)}
                                    className="flex items-center gap-2 bg-[#181411] text-white font-semibold py-2.5 px-5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm"
                                >
                                    <span className={`material-symbols-outlined text-lg ${loading && 'animate-spin'}`}>sync</span>
                                    Fetch
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar p-8 pt-2">
                            <table className="w-full text-left">
                                <thead className="bg-[#f8f7f5] sticky top-0 z-10">
                                    <tr>
                                        <th className="py-4 px-4 text-xs font-bold text-[#8c725f] uppercase rounded-l-xl">Student</th>
                                        <th className="py-4 px-4 text-xs font-bold text-[#8c725f] uppercase">Room</th>
                                        <th className="py-4 px-4 text-xs font-bold text-[#8c725f] uppercase text-right rounded-r-xl">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {report.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 flex items-center gap-3 font-semibold">{item.student?.fullName}</td>
                                            <td className="py-4 px-4 text-sm font-medium text-[#8c725f]">{item.student?.roomNo || item.student?.roomNumber || 'N/A'}</td>
                                            <td className="py-4 px-4 text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border 
                                                    ${item.status === 'Present' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 h-32 shrink-0">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                            <p className="text-sm font-medium text-[#8c725f]">Total</p>
                            <p className="text-3xl font-black mt-1">{students.length}</p>
                        </div>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col justify-center border-l-4 border-l-[#22c55e]">
                            <p className="text-sm font-medium text-[#8c725f]">Present</p>
                            <p className="text-3xl font-black text-[#22c55e] mt-1">{report.filter(r => r.status === 'Present').length}</p>
                        </div>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col justify-center border-l-4 border-l-[#ef4444]">
                            <p className="text-sm font-medium text-[#8c725f]">Absent</p>
                            <p className="text-3xl font-black text-[#ef4444] mt-1">{report.filter(r => r.status === 'Absent').length}</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AttendanceManager;
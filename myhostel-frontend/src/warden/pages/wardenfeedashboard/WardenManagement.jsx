import React, { useState, useEffect } from "react";
import { Search, BadgePercent, Trash2, AlertTriangle, UserCheck, Loader2 } from "lucide-react";
import API from "../../../api/axios"; // Adjust path as needed

const WardenManagement = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [rebateAmount, setRebateAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 1. Fetch data from Analytics
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setFetching(true);
            const { data } = await API.get("/fee/analytics");
            // Filter out students without records
            const active = data.filter(item => item.status !== "Record Not Created");
            setStudents(active);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setFetching(false);
        }
    };

    // 2. Filter Logic
    const filtered = students.filter(item => {
        const name = item.student?.fullName?.toLowerCase() || "";
        const roll = item.student?.studentDetails?.rollNumber?.toLowerCase() || "";
        return name.includes(search.toLowerCase()) || roll.includes(search.toLowerCase());
    });

    const handleSelect = (item) => {
        setSelectedStudent(item);
        setSearch(`${item.student.fullName} (${item.student.studentDetails?.rollNumber})`);
    };

    // 3. ACTION: Apply Rebate
    const handleApplyRebate = async () => {
        if (!rebateAmount) return alert("Enter rebate amount");
        setLoading(true);
        try {
            const feeId = selectedStudent._id || selectedStudent.feeId;
            const { data } = await API.post("/fee/apply-rebate", {
                feeId,
                rebateAmount: Number(rebateAmount)
            });
            alert(data.message);
            reset();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to apply rebate");
        } finally {
            setLoading(false);
        }
    };

    // 4. ACTION: Clear Single Record
    const handleClear = async () => {
        if (!window.confirm("Are you sure? This will delete transaction history for this student.")) return;
        setLoading(true);
        try {
            const feeId = selectedStudent._id || selectedStudent.feeId;
            const { data } = await API.delete(`/fee/clear/${feeId}`);
            alert(data.message);
            reset();
        } catch (err) {
            alert(err.response?.data?.message || "Clear failed! Student must be in 'Paid' status.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setSearch("");
        setSelectedStudent(null);
        setRebateAmount("");
        fetchData();
    };

    return (
        <div className="min-h-screen bg-[#fffcf9] p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* TOP NAVBAR (Export Button Removed) */}
                <div className="bg-slate-900 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center shadow-2xl border-b-4 border-orange-500">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-500/40 text-white">
                            <BadgePercent size={28} />
                        </div>
                        <div>
                            <h2 className="text-white text-2xl font-black tracking-tight">Warden Command Center</h2>
                            <p className="text-orange-200 text-[10px] font-bold uppercase tracking-widest">Fee Rebates & Records</p>
                        </div>
                    </div>
                </div>

                {/* SEARCH & WORK AREA */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: Search Panel */}
                    <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] shadow-xl border border-orange-100">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Find Student</label>
                        <div className="relative mt-3">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                type="text"
                                placeholder="Name or Roll Number..."
                                className="w-full h-16 bg-slate-50 border-2 border-transparent focus:border-orange-400 rounded-2xl px-12 outline-none font-bold text-slate-800 transition-all"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); if (selectedStudent) setSelectedStudent(null); }}
                            />
                        </div>

                        <div className="mt-6 space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {fetching ? <Loader2 className="animate-spin mx-auto text-orange-500 mt-10" /> : (
                                filtered.map(item => (
                                    <div
                                        key={item._id}
                                        onClick={() => handleSelect(item)}
                                        className="p-4 rounded-2xl border border-slate-50 hover:border-orange-200 hover:bg-orange-50 cursor-pointer transition-all flex justify-between items-center group"
                                    >
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{item.student.fullName}</h4>
                                            <p className="text-[10px] text-slate-400 font-mono">{item.student.studentDetails.rollNumber}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${item.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {item.status}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Action Panel */}
                    <div className="lg:col-span-7">
                        {selectedStudent ? (
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border-t-8 border-orange-500 space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Active Record</span>
                                        <h3 className="text-3xl font-black text-slate-800 mt-2">{selectedStudent.student.fullName}</h3>
                                        <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">{selectedStudent.student.studentDetails.department} Department</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-300 uppercase">Current Mess Bill</p>
                                        <p className="text-3xl font-black text-orange-500 font-mono">₹{selectedStudent.messCharges}</p>
                                    </div>
                                </div>

                                <div className="h-[2px] bg-slate-50 w-full"></div>

                                {/* Rebate Section */}
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <BadgePercent size={16} className="text-orange-500" /> Apply Mess Rebate
                                    </label>
                                    <div className="flex gap-4 mt-3">
                                        <input
                                            type="number"
                                            placeholder="Enter amount (e.g. 500)"
                                            className="flex-1 h-16 bg-slate-50 rounded-2xl px-6 outline-none border-2 border-transparent focus:border-green-500 font-black text-xl text-green-600"
                                            value={rebateAmount}
                                            onChange={(e) => setRebateAmount(e.target.value)}
                                        />
                                        <button
                                            onClick={handleApplyRebate}
                                            disabled={loading || !rebateAmount}
                                            className="bg-green-500 text-white px-8 rounded-2xl font-black uppercase text-xs hover:bg-green-600 shadow-lg shadow-green-500/20 disabled:opacity-50"
                                        >
                                            {loading ? "..." : "Apply"}
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-red-100 p-3 rounded-xl text-red-600">
                                            <AlertTriangle size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-red-800 uppercase">Clear Records</p>
                                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter italic">Delete history for new month</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClear}
                                        disabled={loading || selectedStudent.status !== 'Paid'}
                                        className="bg-white text-red-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase border border-red-200 hover:bg-red-600 hover:text-white transition-all disabled:opacity-30"
                                    >
                                        Reset Student Logs
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[3rem] p-12 text-center">
                                <div className="bg-slate-50 p-8 rounded-full mb-6">
                                    <UserCheck size={64} className="text-slate-200" />
                                </div>
                                <h3 className="text-slate-300 font-black uppercase text-xl">Select a student</h3>
                                <p className="text-slate-300 text-sm font-medium">Search for a student to apply rebates or clear their records</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WardenManagement;
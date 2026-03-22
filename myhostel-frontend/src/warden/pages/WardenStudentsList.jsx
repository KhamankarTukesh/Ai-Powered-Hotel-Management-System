import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Users, Search, Loader2, CheckCircle2, XCircle, Building2, GraduationCap } from 'lucide-react';

const WardenStudentsList = () => {
    const [students, setStudents]   = useState([]);
    const [filtered, setFiltered]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [search, setSearch]       = useState('');
    const [filterDept, setFilterDept] = useState('all');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await API.get('/users/all-students');
                setStudents(data);
                setFiltered(data);
            } catch {
                toast.error("Failed to load students");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // ── Search + Filter ──
    useEffect(() => {
        let result = students;
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(s =>
                s.fullName?.toLowerCase().includes(q) ||
                s.email?.toLowerCase().includes(q) ||
                s.studentDetails?.rollNumber?.toLowerCase().includes(q)
            );
        }
        if (filterDept !== 'all') {
            result = result.filter(s => s.studentDetails?.department === filterDept);
        }
        setFiltered(result);
    }, [search, filterDept, students]);

    const departments = [...new Set(students.map(s => s.studentDetails?.department).filter(Boolean))];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fffaf5]">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-orange-500" size={40} />
                <p className="text-sm font-bold text-slate-400">Loading students...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fffaf5] px-4 sm:px-6 lg:px-10 py-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');`}</style>

            <div className="max-w-6xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-orange-500 rounded-2xl flex items-center justify-center shadow-md shadow-orange-200">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 leading-none">All Students</h1>
                            <p className="text-xs text-slate-400 mt-0.5">{students.length} registered · {filtered.length} showing</p>
                        </div>
                    </div>

                    {/* Stats pills */}
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-600 text-xs font-black px-3 py-1.5 rounded-xl">
                            <CheckCircle2 size={12} />
                            {students.filter(s => s.isVerified).length} Verified
                        </div>
                        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-600 text-xs font-black px-3 py-1.5 rounded-xl">
                            <Building2 size={12} />
                            {students.filter(s => s.allocatedRoom).length} With Room
                        </div>
                        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-500 text-xs font-black px-3 py-1.5 rounded-xl">
                            <XCircle size={12} />
                            {students.filter(s => !s.allocatedRoom).length} No Room
                        </div>
                    </div>
                </div>

                {/* ── Search + Filter ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or roll number..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-orange-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300/40 text-slate-700"
                        />
                    </div>
                    <select
                        value={filterDept}
                        onChange={e => setFilterDept(e.target.value)}
                        className="bg-white border border-orange-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:outline-none appearance-none cursor-pointer min-w-[160px]"
                    >
                        <option value="all">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                {/* ── Students Table ── */}
                <div className="bg-white rounded-3xl border border-orange-100 shadow-xl overflow-hidden">

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-orange-50 border-b border-orange-100">
                        <div className="col-span-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Student</div>
                        <div className="col-span-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Roll No.</div>
                        <div className="col-span-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:block">Department</div>
                        <div className="col-span-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:block">Room</div>
                        <div className="col-span-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-orange-50 max-h-[600px] overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-slate-400 font-bold">No students found</p>
                            </div>
                        ) : (
                            filtered.map((student, i) => (
                                <div key={student._id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-orange-50/40 transition-all items-center">

                                    {/* Name + Email */}
                                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                                            {student.fullName?.charAt(0) || 'S'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-slate-800 truncate">{student.fullName}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{student.email}</p>
                                        </div>
                                    </div>

                                    {/* Roll Number */}
                                    <div className="col-span-2 hidden sm:block">
                                        <p className="text-xs font-bold text-slate-600 truncate">
                                            {student.studentDetails?.rollNumber || <span className="text-slate-300">—</span>}
                                        </p>
                                    </div>

                                    {/* Department */}
                                    <div className="col-span-2 hidden md:block">
                                        <p className="text-xs font-bold text-slate-600 truncate">
                                            {student.studentDetails?.department || <span className="text-slate-300">—</span>}
                                        </p>
                                    </div>

                                    {/* Room */}
                                    <div className="col-span-2 hidden lg:block">
                                        {student.allocatedRoom ? (
                                            <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                                                {student.allocatedRoom.roomNumber}
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-300">No Room</span>
                                        )}
                                    </div>

                                    {/* Verified Status */}
                                    <div className="col-span-2">
                                        {student.isVerified ? (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100 w-fit">
                                                <CheckCircle2 size={10} /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100 w-fit">
                                                <XCircle size={10} /> Pending
                                            </span>
                                        )}
                                    </div>

                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-orange-50/50 border-t border-orange-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total {filtered.length} of {students.length} students
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WardenStudentsList;
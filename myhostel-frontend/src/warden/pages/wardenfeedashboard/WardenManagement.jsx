import React, { useState, useEffect } from "react";
import {
  Search,
  BadgePercent,
  AlertTriangle,
  UserCheck,
  Loader2,
} from "lucide-react";
import API from "../../../api/axios";

const WardenManagement = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [rebateAmount, setRebateAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setFetching(true);
      const { data } = await API.get("/fee/analytics");

      const active = data.filter(
        (item) => item.status !== "Record Not Created"
      );

      setStudents(active);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  /* ================= SEARCH ================= */
  const filtered = students.filter((item) => {
    const name = item.student?.fullName?.toLowerCase() || "";
    const roll =
      item.student?.studentDetails?.rollNumber?.toLowerCase() || "";

    return (
      name.includes(search.toLowerCase()) ||
      roll.includes(search.toLowerCase())
    );
  });

  const handleSelect = (item) => {
    setSelectedStudent(item);
    setSearch(
      `${item.student.fullName} (${item.student.studentDetails?.rollNumber})`
    );
  };

  /* ================= APPLY REBATE ================= */
  const handleApplyRebate = async () => {
    if (!rebateAmount) return alert("Enter rebate amount");

    setLoading(true);
    try {
      const feeId = selectedStudent._id || selectedStudent.feeId;

      const { data } = await API.post("/fee/apply-rebate", {
        feeId,
        rebateAmount: Number(rebateAmount),
      });

      alert(data.message);
      reset();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to apply rebate");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLEAR RECORD ================= */
  const handleClear = async () => {
    if (!window.confirm("Are you sure?")) return;

    setLoading(true);
    try {
      const feeId = selectedStudent._id || selectedStudent.feeId;

      const { data } = await API.delete(`/fee/clear/${feeId}`);

      alert(data.message);
      reset();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Student must be Paid before clearing"
      );
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
    <div className="min-h-screen bg-[#fffcf9] px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* ================= HEADER ================= */}
        <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl border-b-4 border-orange-500">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-3 rounded-2xl text-white">
              <BadgePercent size={26} />
            </div>

            <div>
              <h2 className="text-white text-xl sm:text-2xl font-black">
                Warden Command Center
              </h2>
              <p className="text-orange-200 text-[10px] uppercase font-bold tracking-widest">
                Fee Rebates & Records
              </p>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* ================= SEARCH PANEL ================= */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-7 rounded-3xl shadow-lg border border-orange-100">

            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Find Student
            </label>

            {/* Search Input */}
            <div className="relative mt-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />

              <input
                type="text"
                placeholder="Name or Roll Number..."
                className="w-full h-14 sm:h-16 bg-slate-50 rounded-2xl pl-12 pr-4 outline-none border-2 border-transparent focus:border-orange-400 font-bold"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (selectedStudent) setSelectedStudent(null);
                }}
              />
            </div>

            {/* Student List */}
            <div className="mt-5 space-y-2 max-h-[360px] sm:max-h-[420px] overflow-y-auto pr-1">
              {fetching ? (
                <Loader2 className="animate-spin mx-auto mt-10 text-orange-500" />
              ) : (
                filtered.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelect(item)}
                    className="p-3 sm:p-4 rounded-xl border border-slate-50 hover:border-orange-200 hover:bg-orange-50 cursor-pointer transition flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-800">
                        {item.student.fullName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {item.student.studentDetails.rollNumber}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                        item.status === "Paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ================= ACTION PANEL ================= */}
          <div className="lg:col-span-7">
            {selectedStudent ? (
              <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl border-t-8 border-orange-500 flex flex-col gap-7">

                {/* Student Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-5">
                  <div>
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] uppercase font-black">
                      Active Record
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                      {selectedStudent.student.fullName}
                    </h3>

                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">
                      {selectedStudent.student.studentDetails.department}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-[10px] uppercase font-black text-slate-300">
                      Current Mess Bill
                    </p>

                    <p className="text-2xl sm:text-3xl font-black text-orange-500 font-mono">
                      ₹{selectedStudent.messCharges}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[2px] bg-slate-50" />

                {/* ===== Rebate Section ===== */}
                <div>
                  <label className="text-xs uppercase font-black text-slate-400 flex items-center gap-2">
                    <BadgePercent size={16} className="text-orange-500" />
                    Apply Mess Rebate
                  </label>

                  <div className="flex flex-col sm:flex-row gap-4 mt-3">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="flex-1 h-14 sm:h-16 bg-slate-50 rounded-2xl px-5 outline-none border-2 border-transparent focus:border-green-500 font-black text-lg text-green-600"
                      value={rebateAmount}
                      onChange={(e) => setRebateAmount(e.target.value)}
                    />

                    <button
                      onClick={handleApplyRebate}
                      disabled={loading || !rebateAmount}
                      className="h-14 sm:h-16 px-6 sm:px-8 bg-green-500 text-white rounded-2xl font-black uppercase text-xs hover:bg-green-600 disabled:opacity-40"
                    >
                      {loading ? "Processing..." : "Apply"}
                    </button>
                  </div>
                </div>

                {/* ===== Danger Zone ===== */}
                <div className="bg-red-50 p-5 sm:p-6 rounded-3xl border border-red-100 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-xl text-red-600">
                      <AlertTriangle size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-red-800 uppercase">
                        Clear Records
                      </p>

                      <p className="text-[10px] text-red-500 uppercase font-bold italic">
                        Delete history for new month
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleClear}
                    disabled={loading || selectedStudent.status !== "Paid"}
                    className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition disabled:opacity-40"
                  >
                    Reset Student Logs
                  </button>
                </div>
              </div>
            ) : (
              /* ===== Empty State ===== */
              <div className="h-full min-h-[320px] flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-3xl p-8 sm:p-12 text-center">
                <div className="bg-slate-50 p-6 sm:p-8 rounded-full mb-6">
                  <UserCheck size={56} className="text-slate-200" />
                </div>

                <h3 className="text-slate-300 uppercase font-black text-lg sm:text-xl">
                  Select a student
                </h3>

                <p className="text-slate-300 text-sm">
                  Search to apply rebates or clear records
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenManagement;

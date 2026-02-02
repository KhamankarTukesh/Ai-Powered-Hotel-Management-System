import React, { useEffect, useState } from "react";
import API from "../../../api/axios";

const CreateFee = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    hostelRent: 35000,
    messCharges: 15000,
    dueDate: "2026-02-15",
  });

  // 1. Fetch Students from Analytics API
useEffect(() => {
  const fetchStudents = async () => {
    try {
      const { data } = await API.get("/fee/analytics");

      const eligible = data.filter(
        (item) => item.status === "Record Not Created"
      );

      setStudents(eligible);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  fetchStudents();
}, []);


  // 2. Filter Logic (Search by Name or Roll Number)
const filteredStudents = students.filter((item) => {
  const roll =
    item.student?.studentDetails?.rollNumber?.toLowerCase() || "";

  const name =
    item.student?.fullName?.toLowerCase() || "";

  const query = search.trim().toLowerCase();

  if (!query) return true; // search empty → sab dikhao

  return roll.includes(query) || name.includes(query);
});


  // 3. Selection Handler
  const handleSelect = (studentObj) => {
    setSelectedStudent(studentObj);
    setSearch(`${studentObj.fullName} (${studentObj.studentDetails?.rollNumber})`);
  };

  // 4. Submit to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("Please select a student first!");

    setLoading(true);
    try {
      const payload = {
        studentId: selectedStudent._id, // Warden enters name, we send ID
        hostelRent: Number(form.hostelRent),
        messCharges: Number(form.messCharges),
        dueDate: form.dueDate,
      };

      const { data } = await API.post("/fee/create", payload);
      
      alert("✅ " + data.message);
      // Reset Page
      setSelectedStudent(null);
      setSearch("");
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-[2rem] shadow-2xl mt-10 border border-orange-50">
      <h2 className="text-3xl font-black text-gray-800 mb-2">Create Fee Record</h2>
      <p className="text-gray-400 mb-8">Search student by roll number or name to link ID.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- SEARCH SECTION --- */}
        <div className="relative">
          <label className="text-xs font-bold uppercase text-gray-500 ml-1">Find Student</label>
          <input
            type="text"
            placeholder="Type Roll Number (e.g. 124BT12908)..."
            className="w-full h-14 bg-gray-50 rounded-2xl px-5 mt-2 border-2 border-transparent focus:border-orange-400 outline-none transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if(selectedStudent) setSelectedStudent(null); // Reset if typing again
            }}
          />

          {/* AUTO-FILTER DROPDOWN */}
          {search.length > 0 && !selectedStudent && (
            <div className="absolute w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((item) => (
                  <div
                    key={item.student._id}
                    onClick={() => handleSelect(item.student)}
                    className="p-4 hover:bg-orange-50 cursor-pointer border-b border-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{item.student.fullName}</p>
                      <p className="text-xs text-gray-500">{item.student.studentDetails?.rollNumber}</p>
                    </div>
                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-bold">SELECT</span>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-gray-400">No pending students found.</p>
              )}
            </div>
          )}
        </div>

        {/* --- FEE DETAILS GRID --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500">Hostel Rent (₹)</label>
            <input
              type="number"
              className="w-full h-12 bg-gray-50 rounded-xl px-4 outline-none border focus:border-gray-200"
              value={form.hostelRent}
              onChange={(e) => setForm({ ...form, hostelRent: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500">Mess Charges (₹)</label>
            <input
              type="number"
              className="w-full h-12 bg-gray-50 rounded-xl px-4 outline-none border focus:border-gray-200"
              value={form.messCharges}
              onChange={(e) => setForm({ ...form, messCharges: e.target.value })}
              required
            />
          </div>
        </div>

        {/* --- DUE DATE --- */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Due Date</label>
          <input
            type="date"
            className="w-full h-14 bg-gray-50 rounded-2xl px-5 outline-none border focus:border-gray-200"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
          />
        </div>

        {/* --- SUBMIT BUTTON --- */}
        <button
          disabled={!selectedStudent || loading}
          className={`w-full h-16 rounded-2xl font-black text-lg transition-all shadow-lg ${
            selectedStudent 
            ? "bg-orange-500 text-white hover:bg-orange-600 active:scale-95" 
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Creating..." : "Confirm & Create Fee"}
        </button>
      </form>
    </div>
  );
};

export default CreateFee;
import React, { useEffect, useState } from "react";
import API from "../../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, CalendarDays, IndianRupee } from "lucide-react";

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

  /* ---------------- FETCH STUDENTS ---------------- */
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

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredStudents = students.filter((item) => {
    const roll =
      item.student?.studentDetails?.rollNumber?.toLowerCase() || "";

    const name = item.student?.fullName?.toLowerCase() || "";

    const query = search.trim().toLowerCase();

    if (!query) return true;

    return roll.includes(query) || name.includes(query);
  });

  /* ---------------- SELECT HANDLER ---------------- */
  const handleSelect = (studentObj) => {
    setSelectedStudent(studentObj);
    setSearch(
      `${studentObj.fullName} (${studentObj.studentDetails?.rollNumber})`
    );
  };

  /* ---------------- SUBMIT HANDLER ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("Please select a student first!");

    setLoading(true);

    try {
      const payload = {
        studentId: selectedStudent._id,
        hostelRent: Number(form.hostelRent),
        messCharges: Number(form.messCharges),
        dueDate: form.dueDate,
      };

      const { data } = await API.post("/fee/create", payload);

      alert("✅ " + data.message);
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="
      max-w-3xl
      mx-auto
      p-5 sm:p-8
      bg-white
      rounded-[2rem]
      shadow-2xl
      border border-orange-50
      mt-6 sm:mt-10
    "
    >
      {/* ---------------- HEADER ---------------- */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
          Create Fee Record
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Search student by roll number or name to link ID.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* ---------------- SEARCH SECTION ---------------- */}
        <div className="relative">
          <label className="text-xs font-bold uppercase text-gray-500 ml-1">
            Find Student
          </label>

          <div className="relative mt-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Type Roll Number or Name..."
              className="
              w-full
              h-14
              bg-gray-50
              rounded-2xl
              pl-11 pr-5
              border-2 border-transparent
              focus:border-orange-400
              outline-none
              transition-all
            "
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (selectedStudent) setSelectedStudent(null);
              }}
            />
          </div>

          {/* ---------------- DROPDOWN ---------------- */}
          <AnimatePresence>
            {search.length > 0 && !selectedStudent && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="
                absolute w-full mt-3
                bg-white border border-gray-100
                rounded-2xl shadow-2xl
                z-50 max-h-60 overflow-y-auto
              "
              >
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((item) => (
                    <motion.div
                      key={item.student._id}
                      whileHover={{ backgroundColor: "#fff7ed" }}
                      onClick={() => handleSelect(item.student)}
                      className="
                      p-4 cursor-pointer
                      border-b border-gray-50
                      flex justify-between items-center
                    "
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-xl">
                          <User size={16} className="text-orange-500" />
                        </div>

                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            {item.student.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.student.studentDetails?.rollNumber}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-bold">
                        SELECT
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-400">
                    No pending students found.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------------- FEE GRID ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Hostel Rent */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <IndianRupee size={12} /> Hostel Rent
            </label>

            <input
              type="number"
              className="
              w-full h-12 bg-gray-50
              rounded-xl px-4 outline-none
              border focus:border-orange-300
            "
              value={form.hostelRent}
              onChange={(e) =>
                setForm({ ...form, hostelRent: e.target.value })
              }
              required
            />
          </div>

          {/* Mess Charges */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <IndianRupee size={12} /> Mess Charges
            </label>

            <input
              type="number"
              className="
              w-full h-12 bg-gray-50
              rounded-xl px-4 outline-none
              border focus:border-orange-300
            "
              value={form.messCharges}
              onChange={(e) =>
                setForm({ ...form, messCharges: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* ---------------- DUE DATE ---------------- */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            <CalendarDays size={13} /> Due Date
          </label>

          <input
            type="date"
            className="
            w-full h-14 bg-gray-50
            rounded-2xl px-5 outline-none
            border focus:border-orange-300
          "
            value={form.dueDate}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
            required
          />
        </div>

        {/* ---------------- SUBMIT ---------------- */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={!selectedStudent || loading}
          className={`
          w-full h-16 rounded-2xl
          font-black text-lg transition-all shadow-lg
          ${
            selectedStudent
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
        >
          {loading ? "Creating..." : "Confirm & Create Fee"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateFee;

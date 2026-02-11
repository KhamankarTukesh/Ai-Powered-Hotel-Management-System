import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Users, AlertTriangle } from "lucide-react";

const WardenAttendanceCard = ({ attendanceStats = {} }) => {
  const navigate = useNavigate();

  /* ---------- Backend Data ---------- */
  const {
    present = 0,
    absent = 0,
    unmarked = 0,
    attendancePercentage = 0,
    attendanceTaken = false,
  } = attendanceStats;

  /* ---------- Completion Logic ---------- */
  const isCompleted =
    attendanceTaken === true &&
    unmarked === 0 &&
    (present > 0 || absent > 0);

  const handleNavigate = () => navigate("/markattendance");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
      className="relative group cursor-pointer overflow-hidden
      bg-gradient-to-br from-[#FFF9F5] to-white
      p-5 sm:p-7 lg:p-8 rounded-[2rem] sm:rounded-[2.5rem]
      shadow-lg hover:shadow-2xl
      border border-orange-100/50
      flex flex-col justify-between
      min-h-[300px] sm:min-h-[320px]
      transition-all duration-500 active:scale-[0.98]"
    >
      {/* ---------- Glow Background ---------- */}
      <div
        className={`absolute -right-12 -bottom-12 w-28 h-28 sm:w-36 sm:h-36
        rounded-full blur-3xl transition-all duration-700
        ${
          isCompleted
            ? "bg-green-200/20 group-hover:bg-green-400/30"
            : "bg-amber-200/20 group-hover:bg-amber-400/30"
        }`}
      />

      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p
            className="text-[9px] sm:text-[10px] font-black
            text-slate-400 uppercase tracking-[0.2em]"
          >
            Attendance Today
          </p>

          <h4
            className={`text-sm font-bold italic mt-1 ${
              isCompleted ? "text-green-600" : "text-orange-600"
            }`}
          >
            {isCompleted ? "Completed" : "Verification Pending"}
          </h4>
        </div>

        {/* Status Icon */}
        <div
          className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm
          transition-all duration-500
          ${
            isCompleted
              ? "bg-green-500 text-white"
              : "bg-orange-500 text-white"
          }`}
        >
          {isCompleted ? (
            <CalendarCheck size={22} />
          ) : (
            <AlertTriangle size={22} />
          )}
        </div>
      </div>

      {/* ---------- Percentage ---------- */}
      <div className="relative z-10 my-5 sm:my-6">
        <div className="flex items-baseline gap-1">
          <h3
            className="text-3xl sm:text-5xl font-black
            text-slate-800 tracking-tight"
          >
            {attendancePercentage}
          </h3>

          <span className="text-lg sm:text-xl font-black text-orange-500">
            %
          </span>
        </div>

        <p
          className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2
          uppercase tracking-widest bg-white/70
          w-fit px-2 py-0.5 rounded-lg"
        >
          Overall Attendance
        </p>
      </div>

      {/* ---------- Stats Row ---------- */}
      <div className="grid grid-cols-3 gap-2 relative z-10 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
        <span className="text-green-600 bg-green-50 py-1.5 rounded-lg text-center">
          {present} Present
        </span>

        <span className="text-red-600 bg-red-50 py-1.5 rounded-lg text-center">
          {absent} Absent
        </span>

        <span className="text-amber-600 bg-amber-50 py-1.5 rounded-lg text-center">
          {unmarked} Unmarked
        </span>
      </div>

      {/* ---------- Progress Bar ---------- */}
      <div className="mt-4 relative z-10">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-[2px]">
          <div
            className="h-full rounded-full
            bg-gradient-to-r from-orange-500 to-amber-400
            transition-all duration-1000"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
      </div>

      {/* ---------- Action Button ---------- */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNavigate();
        }}
        className={`mt-6 w-full relative z-10 overflow-hidden
        py-3.5 sm:py-4 font-black
        rounded-xl sm:rounded-[1.5rem]
        flex items-center justify-center gap-3
        transition-all active:scale-[0.97]
        group/btn
        ${
          isCompleted
            ? "bg-white border border-slate-100 text-slate-800 hover:bg-slate-50"
            : "bg-orange-600 text-white hover:scale-[1.03] shadow-md"
        }`}
      >
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">
          {isCompleted ? "View Register" : "Verify Attendance"}
        </span>

        <Users
          size={15}
          className="group-hover/btn:translate-x-1 transition-transform"
        />

        {/* Shine Animation */}
        <div
          className="absolute top-0 -left-[100%] w-full h-full
          bg-gradient-to-r from-transparent via-white/20 to-transparent
          group-hover/btn:animate-[shimmer_1s_infinite]"
        />
      </button>
    </div>
  );
};

export default WardenAttendanceCard;

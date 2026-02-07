import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Users, AlertTriangle } from 'lucide-react';

const WardenAttendanceCard = ({ attendanceStats }) => {
  const navigate = useNavigate();

  // ✅ REAL DATA FROM BACKEND
  const {
    present = 0,
    absent = 0,
    unmarked = 0,
    attendancePercentage = 0,
    attendanceTaken = false // 🔑 THIS IS THE KEY
  } = attendanceStats || {};

  /**
   * ✅ REAL-WORLD COMPLETION LOGIC
   * 1. Warden must submit attendance
   * 2. No unmarked students
   * 3. At least someone is marked present/absent
   */
  const isCompleted =
    attendanceTaken === true &&
    unmarked === 0 &&
    (present > 0 || absent > 0);

  return (
    <div
      onClick={() => navigate('/markattendance')}
  role="button"
  tabIndex={0}
      className="relative group bg-gradient-to-br from-[#FFF9F5] to-white p-6 sm:p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,145,77,0.1)] hover:shadow-[0_20px_60px_rgba(255,145,77,0.2)] transition-all duration-500 border border-orange-100/50 flex flex-col justify-between min-h-[320px] h-full overflow-hidden cursor-pointer active:scale-95"
    >
      {/* Soft Glow */}
      <div
        className={`absolute -right-10 -bottom-10 size-32 sm:size-40 rounded-full blur-3xl transition-all duration-700
        ${
          isCompleted
            ? 'bg-green-200/20 group-hover:bg-green-400/30'
            : 'bg-amber-200/20 group-hover:bg-amber-400/30'
        }`}

         
      />

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
            Attendance Today
          </p>
          <h4
            className={`text-sm font-bold italic ${
              isCompleted ? 'text-green-600' : 'text-orange-600'
            }`}
          >
            {isCompleted ? 'Completed' : 'Verification Pending'}
          </h4>
        </div>

        <div
          className={`p-3 rounded-2xl shadow-sm transition-all duration-500 ${
            isCompleted
              ? 'bg-green-500 text-white'
              : 'bg-orange-500 text-white'
          }`}
        >
          {isCompleted ? (
            <CalendarCheck size={22} />
          ) : (
            <AlertTriangle size={22} />
          )}
        </div>
      </div>

      {/* Attendance Percentage */}
      <div className="relative z-10 my-4">
        <div className="flex items-baseline gap-1">
          <h3 className="text-4xl sm:text-5xl font-[950] text-slate-800 tracking-tighter">
            {attendancePercentage}
          </h3>
          <span className="text-xl font-black text-orange-500">%</span>
        </div>

        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2
          uppercase tracking-widest bg-white/60 w-fit px-2 py-0.5 rounded-lg">
          Overall Attendance
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex gap-2 relative z-10">
        <span className="flex-1 text-center text-[10px] font-black text-green-600 bg-green-50 py-1 rounded-lg uppercase tracking-wider">
          {present} Present
        </span>
        <span className="flex-1 text-center text-[10px] font-black text-red-600 bg-red-50 py-1 rounded-lg uppercase tracking-wider">
          {absent} Absent
        </span>
        <span className="flex-1 text-center text-[10px] font-black text-amber-600 bg-amber-50 py-1 rounded-lg uppercase tracking-wider">
          {unmarked} Unmarked
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 relative z-10">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-[2px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate('/markattendance')}
        className={`mt-6 w-full relative z-10 overflow-hidden font-black py-4
        rounded-[1.5rem] shadow-glow transition-all active:scale-95
        flex items-center justify-center gap-3 group/btn
        ${
          isCompleted
            ? 'bg-white border border-slate-100 text-slate-800 hover:bg-slate-50'
            : 'hover:scale-105 text-white bg-orange-600'
        }`}
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">
          {isCompleted ? 'View Register' : 'Verify Attendance'}
        </span>
        <Users size={14} className="group-hover/btn:translate-x-2 transition-transform" />

        {/* Subtle Shine */}
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

import React from "react";
import { useNavigate } from "react-router-dom";

const FeesCard = ({ fees }) => {
  const navigate = useNavigate();
  const pendingAmount = fees?.pending || 0;
  const isPending = pendingAmount > 0;

  const dueDate = fees?.dueDate
    ? new Date(fees.dueDate).toLocaleDateString("en-IN")
    : "No Deadline";

  return (
    <div className="relative group bg-gradient-to-br from-white to-[#FFF9F5] 
    p-5 sm:p-6 md:p-7 lg:p-8 rounded-[2rem] sm:rounded-[2.5rem] 
    shadow-soft hover:-translate-y-1 sm:hover:-translate-y-2 
    transition-all duration-500 border border-orange-100 
    flex flex-col justify-between min-h-[280px] sm:min-h-[320px] 
    h-full overflow-hidden">

      {/* Money Rainfall Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="absolute top-[-20px] left-1/4 animate-[falling_3s_linear_infinite] text-lg sm:text-xl">🪙</div>
        <div className="absolute top-[-20px] left-1/2 animate-[falling_4s_linear_infinite_1s] text-lg sm:text-xl">💰</div>
        <div className="absolute top-[-20px] left-3/4 animate-[falling_2.5s_linear_infinite_0.5s] text-lg sm:text-xl">🪙</div>
      </div>

      {/* Glow Background */}
      <div className="absolute -right-10 -bottom-10 size-28 sm:size-36 md:size-40 bg-orange-200/20 rounded-full blur-3xl group-hover:bg-orange-400/30 transition-all duration-700"></div>

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
            Financial Status
          </p>

          <h4
            className={`text-xs sm:text-sm font-bold italic ${
              isPending ? "text-orange-600" : "text-green-600"
            }`}
          >
            {isPending ? "Pending Dues" : "All Clear"}
          </h4>
        </div>

        <div
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl 
          animate-bounce-slow shadow-sm transition-colors duration-500 
          ${isPending ? "bg-orange-500 text-white" : "bg-green-500 text-white"}`}
        >
          <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">
            {isPending ? "account_balance_wallet" : "check_circle"}
          </span>
        </div>
      </div>

      {/* Amount Section */}
      <div className="relative z-10 my-4 sm:my-5">
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl font-black text-orange-500">
            ₹
          </span>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-[950] text-slate-800 tracking-tighter break-all">
            {pendingAmount}
          </h3>
        </div>

        {/* Due Date */}
        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 mt-2 
        flex items-center gap-1 uppercase tracking-widest bg-white/50 
        w-fit px-2 py-1 rounded-lg">
          <span className="material-symbols-outlined text-[10px] sm:text-xs">
            event
          </span>
          Due: {dueDate}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate("/fees")}
        className="w-full relative z-10 overflow-hidden 
        bg-slate-900 hover:bg-orange-600 text-white 
        font-black py-3 sm:py-4 rounded-xl sm:rounded-3xl 
        shadow-glow transition-all active:scale-95 
        flex items-center justify-center gap-2 sm:gap-3 group/btn"
      >
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em]">
          {isPending ? "Clear Dues" : "View History"}
        </span>

        <span className="material-symbols-outlined text-xs sm:text-sm group-hover/btn:translate-x-2 transition-transform">
          {isPending ? "payments" : "history"}
        </span>

        {/* Shine Effect */}
        <div className="absolute top-0 -left-[100%] w-full h-full 
        bg-gradient-to-r from-transparent via-white/20 to-transparent 
        group-hover/btn:animate-[shimmer_1s_infinite]"></div>
      </button>
    </div>
  );
};

export default FeesCard;

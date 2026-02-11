import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DoorOpen,
  LayoutGrid,
  ArrowLeftRight,
  AlertCircle,
} from "lucide-react";

const WardenRoomCard = ({ roomStats = {} }) => {
  const navigate = useNavigate();

  const {
    totalRooms = 0,
    occupiedBeds = 0,
    totalBeds = 0,
    pendingRequests = 0,
  } = roomStats;

  const occupancyRate =
    totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div
      className="relative group w-full h-full flex flex-col justify-between
      bg-gradient-to-br from-white to-orange-50
      p-5 sm:p-6 lg:p-8
      rounded-3xl border border-orange-100
      shadow-md hover:shadow-xl
      hover:-translate-y-1 sm:hover:-translate-y-2
      transition-all duration-500 overflow-hidden"
    >
      {/* Glow Effect */}
      <div
        className="absolute -right-12 -bottom-12 w-32 h-32 sm:w-40 sm:h-40
        bg-orange-200/20 rounded-full blur-3xl
        group-hover:bg-orange-300/30 transition-all duration-700"
      />

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Inventory Status
          </p>

          <h4 className="text-sm sm:text-base font-bold italic text-orange-600">
            Room Occupancy
          </h4>
        </div>

        <div
          className={`p-3 rounded-xl shadow-sm transition-all duration-500 ${
            pendingRequests > 0
              ? "bg-red-500 text-white animate-pulse"
              : "bg-orange-500 text-white"
          }`}
        >
          {pendingRequests > 0 ? (
            <AlertCircle size={22} />
          ) : (
            <DoorOpen size={22} />
          )}
        </div>
      </div>

      {/* Main Stats */}
      <div className="relative z-10 my-4">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">
          {occupiedBeds}
          <span className="text-slate-300 mx-1">/</span>
          {totalBeds}
        </h3>

        <p
          className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2
          uppercase tracking-widest bg-white/60 w-fit px-2 py-1 rounded-md"
        >
          Beds Occupied
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-slate-400 uppercase tracking-wider">
            Efficiency
          </span>

          <span className="text-orange-600 italic">
            {occupancyRate}% Full
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-[2px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-600 to-amber-400
            transition-all duration-700 ease-out"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 relative z-10">
        <button
          onClick={() => navigate("/warden/rooms")}
          className="flex flex-col items-center justify-center gap-1
          py-3 rounded-2xl
          bg-orange-500 text-white
          hover:scale-105 active:scale-95
          transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LayoutGrid size={18} />
          Inventory
        </button>

        <button
          onClick={() => navigate("/warden/room-requests")}
          className="flex flex-col items-center justify-center gap-1
          py-3 rounded-2xl
          bg-orange-500 text-white
          hover:scale-105 active:scale-95
          transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeftRight size={18} />
          Requests
        </button>
      </div>
    </div>
  );
};

export default WardenRoomCard;

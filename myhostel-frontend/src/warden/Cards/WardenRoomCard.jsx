import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DoorOpen, LayoutGrid, ArrowLeftRight, AlertCircle } from 'lucide-react';

const WardenRoomCard = ({ roomStats }) => {
  const navigate = useNavigate();

  const {
    totalRooms = 0,
    occupiedBeds = 0,
    totalBeds = 0,
    pendingRequests = 0
  } = roomStats || {};

  const occupancyRate =
    totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="relative group bg-gradient-to-br from-white to-[#FFF9F5] 
      p-6 sm:p-8 rounded-[2.5rem] border border-orange-100
      shadow-soft hover:-translate-y-2 transition-all duration-500
      min-h-[320px] h-full flex flex-col justify-between overflow-hidden">

      {/* Glow */}
      <div className="absolute -right-10 -bottom-10 size-32 sm:size-40 
        bg-orange-200/20 rounded-full blur-3xl 
        group-hover:bg-orange-400/30 transition-all duration-700" />

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Inventory Status
          </p>
          <h4 className="text-sm font-bold italic text-orange-600">
            Room Occupancy
          </h4>
        </div>

        <div className={`p-3 rounded-2xl shadow-sm transition-all duration-500
          ${pendingRequests > 0
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-orange-500 text-white'}`}>
          {pendingRequests > 0 ? (
            <AlertCircle size={22} />
          ) : (
            <DoorOpen size={22} />
          )}
        </div>
      </div>

      {/* Main Stat */}
      <div className="relative z-10 my-4">
        <h3 className="text-4xl sm:text-5xl font-[950] text-slate-800 tracking-tighter">
          {occupiedBeds}
          <span className="text-slate-300 mx-1">/</span>
          {totalBeds}
        </h3>

        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2
          uppercase tracking-widest bg-white/50 w-fit px-2 py-0.5 rounded-lg">
          Beds Occupied
        </p>
      </div>

      {/* Progress */}
      <div className="relative z-10">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-slate-400 uppercase tracking-widest">
            Efficiency
          </span>
          <span className="text-orange-600 italic">
            {occupancyRate}% Full
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-[2px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-1000"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
        <button
          onClick={() => navigate('/warden/rooms')}
 className="py-3 rounded-[1.5rem] bg-orange-50 border border-orange-100
            bg-orange-500 hover:scale-105 text-white transition-all
            flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-widest">
          <LayoutGrid size={18} />
          Inventory
        </button>

        <button
          onClick={() => navigate('/warden/room-requests')}
          className="py-3 rounded-[1.5rem] bg-orange-50 border border-orange-100
            bg-orange-500 hover:scale-105 text-white transition-all
            flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeftRight size={18} />
          Requests
        </button>
      </div>
    </div>
  );
};

export default WardenRoomCard;

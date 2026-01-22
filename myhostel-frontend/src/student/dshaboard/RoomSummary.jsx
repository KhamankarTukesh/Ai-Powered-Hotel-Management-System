import React from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, MapPin, Layers, LayoutGrid } from 'lucide-react';

const RoomSummary = ({ roomData }) => {
  // roomData backend se aa raha hai (roomSummary object)
  // roomData.beds mein saari beds ki list hogi
  const beds = roomData?.beds || [];
  
  // Filter out the current user to show only roommates
  // (Assuming studentId is populated in backend)
  const roommates = beds.filter(bed => bed.isOccupied && bed.studentId);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full"
    >
      {/* 1. Room Header Info */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg">
              <MapPin size={14} />
            </span>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {roomData?.block || 'Main Block'} | Floor {roomData?.floor || '0'}
            </h3>
          </div>
          <h2 className="text-3xl font-black text-slate-800 italic">
            Room {roomData?.roomNumber || 'N/A'}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
            <span className="bg-slate-900 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
              {roomData?.type || 'Standard'}
            </span>
            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                {roomData?.status}
            </div>
        </div>
      </div>

      {/* 2. Occupancy Details (Bed-wise) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <LayoutGrid size={14} /> Bed Assignments
            </p>
            <span className="text-[10px] font-bold text-slate-500">{roommates.length} / {roomData?.capacity} Occupied</span>
        </div>

        <div className="grid gap-3">
          {beds.map((bed, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                bed.isOccupied ? 'bg-slate-50 border-slate-100' : 'bg-white border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                    bed.isOccupied ? 'bg-white text-indigo-600 border-slate-200' : 'bg-transparent text-slate-300 border-slate-100'
                }`}>
                  {bed.bedNumber}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-700">
                    {bed.isOccupied ? (bed.studentId?.fullName || "Occupied") : "Empty Bed"}
                  </h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    {bed.isOccupied ? `Contact: ${bed.studentId?.phone || 'N/A'}` : "Available for Allocation"}
                  </p>
                </div>
              </div>
              
              {bed.isOccupied && bed.studentId?.phone && (
                <a 
                  href={`tel:${bed.studentId.phone}`}
                  className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-md rounded-xl transition-all border border-slate-100"
                >
                  <Phone size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Room Summary Footer */}
      <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-50">
             <Layers size={16} className="text-indigo-600 mb-1" />
             <p className="text-[9px] font-black uppercase text-indigo-400">Total Capacity</p>
             <p className="text-sm font-black text-indigo-900">{roomData?.capacity} Beds</p>
          </div>
          <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-50">
             <Users size={16} className="text-emerald-600 mb-1" />
             <p className="text-[9px] font-black uppercase text-emerald-400">Active Mates</p>
             <p className="text-sm font-black text-emerald-900">{roommates.length} Students</p>
          </div>
      </div>
    </motion.div>
  );
};

export default RoomSummary;
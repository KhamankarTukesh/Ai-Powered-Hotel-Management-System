import React from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Bed, Layers, MapPin, User, Mail, Hash } from 'lucide-react';

const MyRoom = ({ roomData, currentStudentId }) => {
  // roomData backend se getAllRooms ya specific profile route se aayega
  const { roomNumber, block, floor, type, beds, price } = roomData;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic flex items-center gap-3">
            My <span className="text-indigo-600">Residence</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room & Roommate Details</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase">Monthly Rent</p>
           <p className="text-lg font-black text-slate-800">₹{price}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Room Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <Home size={32} />
              </div>
              <span className="bg-indigo-500 px-4 py-1 rounded-full text-[10px] font-black uppercase">
                {type} Sharing
              </span>
            </div>

            <h3 className="text-5xl font-black italic mb-2 tracking-tighter">{roomNumber}</h3>
            <p className="text-indigo-300 font-bold uppercase text-[10px] tracking-[0.2em] mb-8">Room Number</p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-white/40 text-[9px] font-black uppercase mb-1">Block</p>
                <p className="font-bold flex items-center gap-2"><MapPin size={14} className="text-indigo-400"/> {block}</p>
              </div>
              <div>
                <p className="text-white/40 text-[9px] font-black uppercase mb-1">Floor</p>
                <p className="font-bold flex items-center gap-2"><Layers size={14} className="text-indigo-400"/> {floor} Floor</p>
              </div>
            </div>
          </div>
          
          {/* Abstract background shape */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </motion.div>

        {/* Right: Bed & Roommates */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
            <Users size={16} /> Bed Allocations
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beds.map((bed, i) => {
              const isMe = bed.studentId?._id === currentStudentId;
              const isEmpty = !bed.isOccupied;

              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-[2rem] border transition-all ${
                    isMe ? 'bg-indigo-50 border-indigo-100 ring-2 ring-indigo-500/10' : 
                    isEmpty ? 'bg-slate-50 border-slate-100 border-dashed' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isMe ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Bed size={20} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Bed {bed.bedNumber}</span>
                  </div>

                  {!isEmpty ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Student Name</p>
                        <p className="text-sm font-black text-slate-800 italic">
                          {bed.studentId.fullName} {isMe && "(You)"}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Roll No</p>
                          <p className="text-xs font-bold text-slate-600">{bed.studentId.studentDetails?.rollNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Dept</p>
                          <p className="text-xs font-bold text-slate-600">{bed.studentId.studentDetails?.department || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <p className="text-xs font-bold text-slate-300 italic uppercase tracking-wider">Empty Slot</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRoom;
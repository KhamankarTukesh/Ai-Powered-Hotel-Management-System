import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import {
  DoorOpen,
  Search,
  UserPlus,
  Loader2,
  Bed,
  CheckCircle2,
  LayoutGrid,
   ArrowLeftRight,
   ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const WardenRoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

   const navigate = useNavigate();
  // Form State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomRes, studentRes] = await Promise.all([
        API.get('/rooms'),
        API.get('/fee/analytics')
      ]);
      setRooms(roomRes.data);
      setStudents(studentRes.data);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleAllocate = async (e) => {
    e.preventDefault();

    // 1. Validation check
    if (!selectedRoom || !selectedBed || !searchQuery) {
      return toast.error("Please fill all fields");
    }

    setActionLoading(true);
    try {
      // 2. Robust Search logic
      // Hum trim() add kar rahe hain taaki accidental spaces se error na aaye
      const studentObj = students.find(s => {
        const roll = s.student?.studentDetails?.rollNumber?.toLowerCase().trim();
        const name = s.student?.fullName?.toLowerCase().trim();
        const query = searchQuery.toLowerCase().trim();

        return roll === query || name === query;
      });

      if (!studentObj) {
        // Direct error message agar warden ne dropdown select nahi kiya ya galat type kiya
        throw new Error("Student not recognized. Please select from the dropdown list.");
      }

      const studentId = studentObj.student._id;

      // 3. API Call
      await API.put('/rooms/allocate', {
        roomId: selectedRoom._id,
        studentId: studentId,
        bedNumber: selectedBed
      });

      // 4. Success UI Feedback
      toast.success(`Success! Bed ${selectedBed} in Room ${selectedRoom.roomNumber} is now for ${studentObj.student.fullName}`);

      // 5. State Reset
      setSearchQuery('');
      setIsSelected(false);
      setSelectedRoom(null);
      setSelectedBed('');

      // 6. Refresh Data
      fetchData();

    } catch (err) {
      // Backend validation errors handle karega (like 'Bed already occupied')
      toast.error(err.response?.data?.message || err.message || "Allocation failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Add this before the return statement
  const filteredStudents = students.filter((item) => {
    const roll = item.student?.studentDetails?.rollNumber?.toLowerCase() || "";
    const name = item.student?.fullName?.toLowerCase() || "";
    const query = searchQuery.trim().toLowerCase();
    return query === "" ? false : (roll.includes(query) || name.includes(query));
  });

  return (
    <div className="min-h-screen bg-[#fffaf5] p-4 md:p-10 font-display">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Inventory</h1>
            <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">Room & Bed Management</p>
          </div>
          <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-orange-100">
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Rooms</p>
              <p className="text-xl font-black text-slate-800">{rooms.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Allocation Form */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-orange-50 sticky top-10">
              <h2 className="text-lg font-black text-slate-800 uppercase mb-6 flex items-center gap-2">
                <UserPlus size={20} className="text-orange-500" /> Quick Allocate
              </h2>

              <form onSubmit={handleAllocate} className="space-y-5">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
                    Student Roll No / Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-orange-200"
                      placeholder="Ex: CSE2025"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSelected(false); // If user types, show the list again
                      }}
                    />
                  </div>

                  {/* Only show list if there is text AND no student is currently selected */}
                  {searchQuery.length > 0 && !isSelected && (
                    <div className="absolute w-full mt-2 bg-white border border-orange-100 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((item) => (
                          <div
                            key={item.student._id}
                            onClick={() => {
                              setSearchQuery(item.student.fullName); // Fills the input
                              setIsSelected(true); // HIDES THE LIST
                            }}
                            className="p-4 hover:bg-orange-50 cursor-pointer border-b border-orange-50 flex justify-between items-center transition-colors"
                          >
                            <div>
                              <p className="font-bold text-slate-800">{item.student.fullName}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase">
                                {item.student.studentDetails?.rollNumber}
                              </p>
                            </div>
                            <span className="text-[9px] bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-black">
                              SELECT
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="p-4 text-[10px] font-black text-slate-400 uppercase text-center italic">
                          No matching students
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Room Info */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Selected Room</label>
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    {selectedRoom ? (
                      <div className="flex justify-between items-center">
                        <span className="font-black text-orange-700">Room {selectedRoom.roomNumber} ({selectedRoom.block})</span>
                        <button type="button" onClick={() => { setSelectedRoom(null); setSelectedBed('') }} className="text-[10px] font-black text-red-500 uppercase">Clear</button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 italic">Select a room from the list →</span>
                    )}
                  </div>
                </div>

                {/* Bed Selection */}
                {selectedRoom && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Select Available Bed</label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedRoom.beds.map((bed) => (
                        <button
                          key={bed._id}
                          type="button"
                          disabled={bed.isOccupied}
                          onClick={() => setSelectedBed(bed.bedNumber)}
                          className={`p-3 rounded-xl font-black text-xs transition-all ${bed.isOccupied
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : selectedBed === bed.bedNumber
                              ? 'bg-orange-500 text-white shadow-lg'
                              : 'bg-slate-50 text-slate-600 hover:bg-orange-100'
                            }`}
                        >
                          Bed {bed.bedNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={actionLoading || !selectedRoom}
                  className="w-full py-5  text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 bg-orange-600 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                  Confirm Allocation
                </button>
              </form>


            </div>
                          
 <div className="bg-white p-5 rounded-[2rem] shadow-xl border border-orange-50 mt-4 flex items-center justify-between">
  <div className="flex items-center gap-4">
    <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
      <ArrowLeftRight size={20} />
    </div>
    <div>
      <h3 className="text-xs font-black text-slate-800 uppercase italic">Room Requests</h3>
      <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Pending Approvals</p>
    </div>
  </div>

  <button 
    onClick={() => navigate('/warden/room-requests')}
    className=" text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:scale-105 bg-orange-500 transition-all shadow-md active:scale-95"
  >
    Open Portal
  </button>
</div>
          </div>

          {/* Right: Room Grid */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="flex justify-center p-20"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => room.status !== 'Full' && setSelectedRoom(room)}
                    className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer group ${selectedRoom?._id === room._id
                      ? 'border-orange-500 bg-orange-50/50 shadow-lg'
                      : 'border-white bg-white hover:border-orange-100'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${room.status === 'Full' ? 'bg-slate-100 text-slate-400' : 'bg-orange-100 text-orange-600'}`}>
                        <DoorOpen size={24} />
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${room.status === 'Full' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-800">Room {room.roomNumber}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <LayoutGrid size={12} /> {room.block} • Floor {room.floor}
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      {room.beds.map((bed) => (
                        <div
                          key={bed._id}
                          className={`flex-1 h-1.5 rounded-full ${bed.isOccupied ? 'bg-slate-200' : 'bg-green-400'}`}
                          title={`Bed ${bed.bedNumber}: ${bed.isOccupied ? 'Occupied' : 'Vacant'}`}
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {room.beds.map((bed) => bed.isOccupied && (
                        <div key={bed._id} className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                          <span className="text-[9px] font-bold text-slate-500 truncate max-w-[80px]">
                            {bed.studentId?.fullName || "Occupied"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenRoomManager;
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
import AddRoomModal from './AddRoomModal';

const WardenRoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);

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
  const getAiRoomSuggestion = async () => {
    // Pehle check karein ki student select hua hai ya nahi
    const studentObj = students.find(s => s.student?.fullName === searchQuery);
    if (!studentObj) return toast.error("Please select a student from the list first!");

    setIsSuggesting(true);
    try {
      const { data } = await API.post('/ai/suggest-room', {
        studentId: studentObj.student._id
      });

      if (data.success) {
        setAiRecommendation(data.recommendation);
        // Auto-select suggested room logic
        const suggestedRoom = rooms.find(r => r._id === data.recommendation.roomId);
        if (suggestedRoom) {
          setSelectedRoom(suggestedRoom);
          toast.success("AI suggested a perfect room!");
        }
      }
    } catch (err) {
      toast.error("AI could not find a recommendation");
    } finally {
      setIsSuggesting(false);
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
      setAiRecommendation(null);

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
<div className="h-screen bg-[#fffaf5] flex flex-col font-display">
      
      {/* 1. Header: Isko bahar rakha hai taaki ye top par fix rahe */}
      <div className="p-4 md:px-10 md:pt-10 pb-4 max-w-7xl mx-auto w-full">
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
      </div>

      {/* 2. Main Content Area: Flex-1 aur overflow-hidden */}
      <div className="flex-1 overflow-hidden max-w-7xl mx-auto w-full px-4 md:px-10 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

          {/* Left Side: Allocation Form (Fixed/Sticky) */}
          <div className="lg:col-span-4 h-full overflow-y-auto pr-2 custom-scrollbar">
            {/* Form Container */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-orange-50 mb-4">
              <h2 className="text-lg font-black text-slate-800 uppercase mb-6 flex items-center gap-2">
                <UserPlus size={20} className="text-orange-500" /> Quick Allocate
              </h2>
<form onSubmit={handleAllocate} className="space-y-5">
  {/* 1. Student Search & Dropdown Section */}
  <div className="space-y-2 relative">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
      Student Roll No / Name
    </label>
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
      <input
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-orange-200 transition-all"
        placeholder="Ex: CSE2025"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsSelected(false); 
        }}
      />
    </div>

    {/* Dropdown List: Z-index fixed and added scroll */}
    {searchQuery.length > 0 && !isSelected && (
      <div className="absolute w-full mt-2 bg-white border border-orange-100 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((item) => (
            <div
              key={item.student._id}
              onClick={() => {
                setSearchQuery(item.student.fullName);
                setIsSelected(true);
              }}
              className="p-4 hover:bg-orange-50 cursor-pointer border-b border-orange-50 flex justify-between items-center transition-colors group"
            >
              <div>
                <p className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                  {item.student.fullName}
                </p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                  {item.student.studentDetails?.rollNumber}
                </p>
              </div>
              <span className="text-[9px] bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-black group-hover:bg-orange-600 group-hover:text-white transition-all">
                SELECT
              </span>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase italic">
              No matching students found
            </p>
          </div>
        )}
      </div>
    )}
  </div>

  {/* 2. Selected Room Info Section */}
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
      Selected Room
    </label>
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
      selectedRoom ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'
    }`}>
      {selectedRoom ? (
        <div className="flex justify-between items-center animate-in fade-in slide-in-from-left-2">
          <div className="flex flex-col">
             <span className="font-black text-orange-700 text-sm">
                Room {selectedRoom.roomNumber}
             </span>
             <span className="text-[9px] font-bold text-orange-400 uppercase">
                Block {selectedRoom.block} • Floor {selectedRoom.floor}
             </span>
          </div>
          <button 
            type="button" 
            onClick={() => { setSelectedRoom(null); setSelectedBed(''); }} 
            className="text-[10px] font-black text-red-500 uppercase hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      ) : (
        <span className="text-xs font-bold text-slate-400 italic flex items-center gap-2">
          <LayoutGrid size={14} /> Select a room from the grid
        </span>
      )}
    </div>
  </div>

  {/* 3. Bed Selection Grid */}
  {selectedRoom && (
    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
        Select Available Bed
      </label>
      <div className="grid grid-cols-3 gap-2">
        {selectedRoom.beds.map((bed) => (
          <button
            key={bed._id}
            type="button"
            disabled={bed.isOccupied}
            onClick={() => setSelectedBed(bed.bedNumber)}
            className={`p-3 rounded-xl font-black text-[11px] transition-all duration-200 ${
              bed.isOccupied
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                : selectedBed === bed.bedNumber
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-95'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            {bed.isOccupied ? 'Taken' : `Bed ${bed.bedNumber}`}
          </button>
        ))}
      </div>
    </div>
  )}

  {/* 4. AI Suggestion Section */}
  {isSelected && (
    <div className="space-y-3 pt-2">
      {!aiRecommendation ? (
        <button
          type="button"
          onClick={getAiRoomSuggestion}
          disabled={isSuggesting}
          className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg disabled:opacity-70"
        >
          {isSuggesting ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            "✨ Get AI Suggestion"
          )}
        </button>
      ) : (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in zoom-in duration-300">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <CheckCircle2 size={14} />
            <p className="text-[10px] font-black uppercase tracking-widest">AI Recommended</p>
          </div>
          <p className="text-[11px] font-bold text-slate-700 leading-tight">
            {aiRecommendation.reason}
          </p>
          <button
            type="button"
            onClick={() => setAiRecommendation(null)}
            className="text-[9px] text-blue-400 font-bold mt-2 hover:underline"
          >
            Reset Suggestion
          </button>
        </div>
      )}
    </div>
  )}

  {/* 5. Submit Button */}
  <button
    type="submit"
    disabled={actionLoading || !selectedRoom || !selectedBed || !isSelected}
    className="w-full py-5 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 active:scale-95 transition-all shadow-xl shadow-orange-100 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
  >
    {actionLoading ? (
      <Loader2 className="animate-spin" />
    ) : (
      <CheckCircle2 size={18} />
    )}
    Confirm Allocation
  </button>
</form>


            </div>

{/* Form ke niche wala extra Card (Room Requests) */}
            <div className="bg-white p-5 rounded-[2rem] shadow-xl border border-orange-50 mt-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <ArrowLeftRight size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase italic">Room Requests</h3>
                  <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Pending Approvals</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/warden/room-requests')}
                className="text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:scale-105 bg-orange-500 transition-all shadow-md active:scale-95"
              >
                Open Portal
              </button>
            </div>
          </div>

          {/* Right Column: Room Grid (Scrollable Section) */}
          <div className="lg:col-span-8 h-full max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-orange-500" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Inventory...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-10 pl-5 pt-5">
                
                {/* 1. Rooms Loop */}
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => room.status !== 'Full' && setSelectedRoom(room)}
                    className={`p-5 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-1 ${
                      selectedRoom?._id === room._id
                        ? 'border-orange-500 bg-orange-50/50 shadow-lg'
                        : 'border-white bg-white hover:border-orange-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl transition-colors ${
                        room.status === 'Full' 
                        ? 'bg-slate-100 text-slate-400' 
                        : 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                      }`}>
                        <DoorOpen size={24} />
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                        room.status === 'Full' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-800">Room {room.roomNumber}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <LayoutGrid size={12} className="text-orange-400" /> {room.block} • Floor {room.floor}
                      </div>
                    </div>

                    {/* Bed Indicator Bars */}
                    <div className="mt-6 flex gap-1.5">
                      {room.beds.map((bed) => (
                        <div
                          key={bed._id}
                          className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                            bed.isOccupied ? 'bg-slate-200' : 'bg-green-400'
                          }`}
                          title={`Bed ${bed.bedNumber}: ${bed.isOccupied ? 'Occupied' : 'Vacant'}`}
                        />
                      ))}
                    </div>

                    {/* Occupied Students Names - Cleaned up display */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {room.beds.some(b => b.isOccupied) ? (
                        room.beds.map((bed) => bed.isOccupied && (
                          <div key={bed._id} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 transition-colors hover:bg-white">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                            <span className="text-[9px] font-bold text-slate-500 truncate max-w-[70px]">
                              {bed.studentId?.fullName?.split(' ')[0] || "Occupied"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[9px] font-bold text-slate-300 uppercase italic">Room is empty</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* 2. Add Room Button/Modal */}
                <div className="h-full min-h-[200px]">
                   <AddRoomModal onRoomAdded={fetchData} /> 
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default WardenRoomManager;
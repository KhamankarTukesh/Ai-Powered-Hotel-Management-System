import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader2, Home, Hash, Users, Banknote, Layers, Navigation, ChevronDown } from 'lucide-react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

const AddRoomModal = ({ onRoomAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const initialForm = {
    roomNumber: '',
    type: 'Triple',
    capacity: 3,
    price: 4500,
    blockLetter: 'A',
    floor: 1
  };

  const [formData, setFormData] = useState(initialForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        block: `${formData.blockLetter.toUpperCase()}-Block`
      };

      await API.post('/rooms', payload);
      toast.success(`Room ${formData.roomNumber} added to Inventory!`, {
        style: { borderRadius: '20px', background: '#333', color: '#fff' }
      });
      setIsOpen(false);
      onRoomAdded(); 
      setFormData(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  // Prevent negative numbers logic
  const handlePosNumber = (field, value) => {
    const val = parseInt(value);
    if (val < 0) return; 
    setFormData({ ...formData, [field]: value });
  };

  return (
    <>
      {/* Trigger Card with Hover Animation */}
      <motion.div 
        whileHover={{ scale: 1.02, translateY: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="group cursor-pointer p-8 rounded-[2.5rem] border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-white hover:border-orange-400 transition-all flex flex-col items-center justify-center min-h-[250px] shadow-sm hover:shadow-xl hover:shadow-orange-100/50"
      >
        <div className="p-5 bg-white rounded-3xl text-orange-500 shadow-lg group-hover:rotate-90 transition-transform duration-500">
          <Plus size={36} strokeWidth={2.5} />
        </div>
        <p className="mt-5 text-xs font-black text-orange-600 uppercase tracking-[0.2em]">Add New Room</p>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Moving Background Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-[0_20px_70px_-15px_rgba(255,145,0,0.3)] border border-orange-50 overflow-hidden"
            >
              {/* Luxury Header */}
              <div className="p-8 bg-gradient-to-r from-orange-50 via-white to-orange-50 flex justify-between items-center border-b border-orange-100/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Room Configuration</h2>
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-8 bg-orange-500 rounded-full" />
                    <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.3em]">Premium Inventory</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-3 hover:bg-orange-100/50 rounded-2xl text-slate-400 hover:text-orange-600 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Room Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Room Number</label>
                    <div className="relative group">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 group-focus-within:text-orange-500 transition-colors" size={16} />
                      <input 
                        required type="number" min="1"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-100 focus:bg-white transition-all shadow-inner"
                        value={formData.roomNumber}
                        placeholder='Ex.101'
                        onChange={(e) => handlePosNumber('roomNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Room Type Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Room Type</label>
                    <div className="relative">
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      <select 
                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-100 focus:bg-white appearance-none transition-all shadow-inner cursor-pointer"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        {['Single', 'Double', 'Triple'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Block Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Block Letter</label>
                    <div className="relative flex items-center">
                      <Layers className="absolute left-4 text-orange-300" size={16} />
                      <input 
                        required maxLength="1"
                        className="w-full pl-11 pr-12 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-100 focus:bg-white transition-all uppercase shadow-inner"
                        placeholder="A"
                        value={formData.blockLetter}
                        onChange={(e) => setFormData({...formData, blockLetter: e.target.value.toUpperCase()})}
                      />
                      <span className="absolute right-4 text-[9px] font-black text-slate-300 uppercase italic">-Block</span>
                    </div>
                  </div>

                  {/* Floor Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Floor</label>
                    <div className="relative">
                      <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={16} />
                      <input 
                        required type="number" min="0"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-100 focus:bg-white transition-all shadow-inner"
                        value={formData.floor}
                        onChange={(e) => handlePosNumber('floor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   {/* Capacity */}
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Total Beds</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={16} />
                      <input 
                        required type="number" min="1" max="10"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-100 focus:bg-white transition-all shadow-inner"
                        value={formData.capacity}
                        placeholder='Ex. 3'
                        onChange={(e) => handlePosNumber('capacity', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Price / Month</label>
                    <div className="relative">
                      <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={16} />
                      <input 
                        required type="number" min="1"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-100 focus:bg-white transition-all shadow-inner text-orange-600"
                        value={formData.price}
                        onChange={(e) => handlePosNumber('price', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Animated Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-slate-900 hover:bg-orange-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-colors shadow-2xl flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Home size={18} />}
                  Initialize Room
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddRoomModal;
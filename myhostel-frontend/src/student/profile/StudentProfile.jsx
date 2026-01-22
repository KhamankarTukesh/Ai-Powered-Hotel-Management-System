import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';

const StudentProfile = ({ user }) => {
  const [preview, setPreview] = useState(user?.avatar || null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 📸 Image Preview Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Isse image turant UI par dikhegi
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="px-8 pb-8">
          {/* Avatar Upload */}
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative group">
              <img 
                src={preview || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                className="w-32 h-32 rounded-[2.5rem] border-4 border-white object-cover shadow-xl group-hover:brightness-90 transition-all"
                alt="Profile"
              />
              <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-2.5 rounded-xl cursor-pointer hover:bg-indigo-600 transition-all shadow-lg scale-90 hover:scale-100">
                <Camera size={18} />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange} // Yahan handle ho raha hai preview
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2">Identity</h3>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 focus-within:border-indigo-200 transition-all">
                <User className="text-indigo-500" size={20} />
                <input className="bg-transparent border-none font-bold text-slate-700 w-full outline-none" defaultValue={user?.fullName} />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 opacity-70">
                <Mail className="text-slate-400" size={20} />
                <input className="bg-transparent border-none font-bold text-slate-500 w-full outline-none" defaultValue={user?.email} disabled />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2">Contact</h3>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 focus-within:border-indigo-200 transition-all">
                <Phone className="text-indigo-500" size={20} />
                <input className="bg-transparent border-none font-bold text-slate-700 w-full outline-none" defaultValue={user?.phone} />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 opacity-70">
                <MapPin className="text-slate-400" size={20} />
                <input className="bg-transparent border-none font-bold text-slate-500 w-full outline-none" defaultValue="Hostel Block A, Room 204" disabled />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="mt-10 w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-[0.98]">
            <Save size={20} /> Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
import React, { useState ,useEffect} from 'react';
import API from '../../api/axios';
import { Lock, Hash, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ code: '', newPassword: '' });
  const navigate = useNavigate();
  const location = useLocation();
  
  // ForgotPassword page se email pass karna hoga state mein
  const email = location.state?.email || "";


  useEffect(() =>{
    if (!email) {
      toast.error("Invalid session. Please try again.");
      navigate('/forgot-password');
    }
  },[email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/reset-password', { 
        email, 
        code: formData.code, 
        newPassword: formData.newPassword 
      });
      
      toast.success("Password changed! Redirecting to login...", {
        icon: '🎉',
        duration: 4000
      });
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP or Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 mb-2">New Password 🔒</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium italic">
          Resetting for: <span className="text-indigo-600 font-bold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Code Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">6-Digit OTP</label>
            <div className="relative group">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text" 
                maxLength="6"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-600/20 focus:bg-white transition-all font-black tracking-widest text-slate-700 text-lg"
                placeholder="000000"
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
            </div>
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="password" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-600/20 focus:bg-white transition-all font-bold text-slate-700"
                placeholder="Enter your new password"
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-[0.98]">
            Update Password
          </button>
        </form>

        {status.message && (
          <div className={`mt-6 flex items-center gap-3 p-4 rounded-xl font-bold text-xs ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {status.type === 'success' && <CheckCircle2 size={16} />}
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
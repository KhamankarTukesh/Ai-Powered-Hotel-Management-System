import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Mail, RefreshCw } from 'lucide-react';
import API from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Registration page se email uthane ke liye (agar available ho)
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/auth/verify-otp', { email, code: otp });
      alert(response.data.message);
      navigate('/'); // Verification ke baad login par bhejo
    } catch (err) {
      alert(err.response?.data?.message || 'Verification Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-[2.5rem] border border-slate-200 w-full max-w-md p-8 flex flex-col items-center"
      >
        {/* Icon & Header */}
        <div className="bg-indigo-50 p-4 rounded-full mb-6">
          <ShieldCheck className="w-12 h-12 text-indigo-600" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Verify OTP</h1>
        <p className="text-slate-500 text-sm text-center mt-2 font-medium">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleVerify} className="w-full mt-8 space-y-6">
          
          {/* Email Field (ReadOnly if coming from register) */}
          <div className="space-y-1 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-sm"
                required 
              />
            </div>
          </div>

          {/* OTP Input Field */}
          <div className="space-y-1 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verification Code</label>
            <input 
              type="text" 
              maxLength="6"
              placeholder="0 0 0 0 0 0"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-black text-2xl text-center tracking-[0.5em] text-indigo-600"
              required 
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Verify Now <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <button 
          onClick={() => navigate(-1)}
          className="mt-6 text-sm text-slate-400 font-bold hover:text-indigo-600 transition-colors"
        >
          Go Back
        </button>

      </motion.div>
    </div>
  );
};

export default VerifyOTP;
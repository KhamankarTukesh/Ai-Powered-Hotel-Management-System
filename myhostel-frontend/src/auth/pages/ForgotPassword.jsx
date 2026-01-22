import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, SendHorizontal } from 'lucide-react';
import API from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend call: /api/auth/forgot-password
      const res = await API.post('/auth/forgot-password', { email });
      
      // Success: Reset page par bhej rahe hain email ke saath
      // Taaki ResetPassword.jsx ko pata chale ki kis email ka OTP verify karna hai

      toast.success(`Your OTP is: ${res.data.otp}`, {
        duration: 6000, // 6 seconds tak dikhega
        icon: '🔑',
      });
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 6000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100/50 border border-slate-100 relative overflow-hidden">
        
        {/* Background Decorative Circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="group mb-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Login
        </button>
        
        <div className="mb-10">
          <h2 className="text-4xl font-black text-slate-800 leading-tight">Forgot <br />Password?</h2>
          <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed">
            Enter your registered email address below. We will send a <span className="text-indigo-600 font-bold">6-digit OTP</span> to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-focus-within:bg-indigo-50 transition-colors">
                <Mail className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              </div>
              <input 
                type="email" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] py-4 pl-16 pr-4 outline-none focus:border-indigo-600/20 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 animate-shake">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full group relative overflow-hidden bg-slate-900 text-white py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200'}`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? "Sending..." : "Send Reset Code"}
              {!loading && <SendHorizontal size={16} className="group-hover:translate-x-1 transition-transform" />}
            </span>
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-loose">
            Having trouble? Contact your <br /> 
            <span className="text-slate-800">Hostel Administrator</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/auth.services.js';
import AuthLayout from '../components/AuthLayout';
import { Lock, ShieldCheck, CheckCircle, Loader2, KeyRound, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({ code: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) return alert("Passwords do not match!");

    setLoading(true);
    try {
      await resetPassword({ email, code: formData.code, newPassword: formData.newPassword });
      alert("Password changed successfully! Redirecting to login...");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP or request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle={`Enter the 6-digit security code sent to ${email}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* OTP Code Input */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="6-Digit OTP Code" 
            required
            maxLength={6}
            className="w-full pl-6 pr-12 py-4 bg-white rounded-2xl border border-[#ffedd5] outline-none font-medium text-slate-700 focus:ring-2 focus:ring-[#f97415]/10 focus:border-[#f97415] transition-all placeholder:text-slate-300"
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
        </div>

        {/* New Password */}
        <div className="relative group">
          <input 
            type="password" 
            placeholder="New Password" 
            required
            className="w-full pl-6 pr-12 py-4 bg-white rounded-2xl border border-[#ffedd5] outline-none font-medium text-slate-700 focus:ring-2 focus:ring-[#f97415]/10 focus:border-[#f97415] transition-all placeholder:text-slate-300"
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
        </div>

        {/* Confirm Password */}
        <div className="relative group">
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            required
            className="w-full pl-6 pr-12 py-4 bg-white rounded-2xl border border-[#ffedd5] outline-none font-medium text-slate-700 focus:ring-2 focus:ring-[#f97415]/10 focus:border-[#f97415] transition-all placeholder:text-slate-300"
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <CheckCircle className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-[#f97415] text-white py-4 mt-2 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-100 active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>Update Password <ArrowRight size={18} /></>
          )}
        </button>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-slate-400 hover:text-[#f97415] transition-colors uppercase tracking-widest"
          >
            Back to Login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
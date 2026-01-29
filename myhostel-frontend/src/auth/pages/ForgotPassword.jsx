import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/auth.services';
import AuthLayout from '../components/AuthLayout';
import { Mail, Send, Loader2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      alert("Reset OTP sent to your email!");
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="No worries! Enter the email associated with your account and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
            <input 
              type="email" 
              placeholder="name@example.com" 
              required
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#ffedd5] rounded-2xl outline-none font-medium text-slate-600 focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-[#f97415] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200 disabled:opacity-70 disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Send Reset Link 
              <Send size={18} />
            </>
          )}
        </button>

        <button 
          type="button"
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-800 hover:text-[#f97415] transition-colors mt-2"
        >
          <ArrowLeft size={16} />
          Back to log in
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
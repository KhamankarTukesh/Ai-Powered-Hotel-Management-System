import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../services/auth.services.js';
import AuthLayout from '../components/AuthLayout';
import { ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      alert("Email not found. Please register again.");
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);
      alert("Naya OTP bhej diya gaya hai!");
      setOtp(['', '', '', '', '', '']); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return alert("Please enter full 6-digit OTP");

    setLoading(true);
    try {
      await verifyOTP({ email, otp: otpString });
      alert("Account Verified Successfully! You can now login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify Identity" 
      subtitle={`We've sent a 6-digit code to ${email}`}
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* OTP Input Group */}
        <div className="flex justify-between gap-2 md:gap-4">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-11 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-white border border-[#ffedd5] rounded-2xl outline-none focus:ring-2 focus:ring-[#f97415]/20 focus:border-[#f97415] focus:bg-white transition-all text-[#181411] shadow-sm"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <div className="space-y-5">
          <button 
            disabled={loading}
            className="w-full bg-[#f97415] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-100 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Verify Account <ArrowRight size={20} /></>
            )}
          </button>

          <button 
            type="button"
            onClick={handleResend}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#8c725f] uppercase tracking-widest hover:text-[#f97415] transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 
            Resend OTP
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          Didn't receive the code? Check your spam folder or try resending.
        </p>
      </form>
    </AuthLayout>
  );
};

export default VerifyOTP;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../services/auth.services.js';
import AuthLayout from '../components/AuthLayout';
import { ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

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

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace logic: Focus previous input
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);

      // Professional Success Message
      toast.success("Verification code resent successfully to your email. 📧", {
        duration: 5000,
        style: {
          borderRadius: '15px',
          background: '#1e293b', // Dark Slate for premium look
          color: '#fff',
          fontWeight: 'bold',
        },
      });

      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      // Professional Error Message
      toast.error(err.response?.data?.message || "Unable to resend code. Please try again later.", {
        style: {
          borderRadius: '15px',
        }
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return toast.error("Please enter code.");

    setLoading(true);
    try {
      const response = await verifyOTP({ email, otp: otpString });

      // 🚀 Step: Token ko localStorage mein save karo (Iske bina dashboard nahi khulega)
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      toast.success("Identity verified! Welcome. 😊");

      // Ab navigate karo dashboard par
      setTimeout(() => navigate('/student/dashboard'), 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code.");
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

        {/* OTP Input Group - FIXED GRID TO PREVENT OVERFLOW */}
        <div className="grid grid-cols-6 gap-2 max-w-full">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full aspect-[4/5] sm:aspect-square text-center text-xl sm:text-2xl font-black bg-white border border-orange-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-slate-800 shadow-sm"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <div className="space-y-5">
          <button
            disabled={loading}
            className="w-full bg-[#f97415] text-white py-4 rounded-2xl font-[1000] flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all shadow-xl shadow-orange-100 active:scale-[0.98] disabled:opacity-70 uppercase tracking-wider"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Verify Account <ArrowRight size={20} /></>
            )}
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#f97415] transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Resend OTP
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 font-medium leading-relaxed">
          Didn't receive the code? Check your spam folder <br className="hidden sm:block" /> or try resending.
        </p>
      </form>
    </AuthLayout>
  );
};

export default VerifyOTP;
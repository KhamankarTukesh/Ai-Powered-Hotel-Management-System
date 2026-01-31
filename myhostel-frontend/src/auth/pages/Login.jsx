import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth.services.js';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast'; // 1. Import Toast

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Initial Loading Toast (Optional but looks pro)
    const loginToast = toast.loading('Authenticating your credentials...');

    try {
      const { data } = await login(formData);

      // Save Token, Role, and User
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 2. Professional Success Notification
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`, {
        id: loginToast, // Ye purane loading toast ko replace kar dega
        duration: 4000,
        style: {
            borderRadius: '15px',
            background: '#1e293b',
            color: '#fff',
            fontWeight: 'bold',
        },
      });

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      // 3. Professional Error Notification
      const errorMessage = err.response?.data?.message || "Invalid credentials. Please try again.";
      
      toast.error(errorMessage, {
        id: loginToast,
        style: {
            borderRadius: '15px',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Please enter your details to sign in to Dnyanda" // Updated Brand Name
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          {/* Email Input */}
          <div className="relative group">
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-6 pr-12 py-4 bg-white rounded-2xl border border-[#ffedd5] outline-none font-medium text-slate-700 focus:ring-2 focus:ring-[#f97415]/10 focus:border-[#f97415] transition-all placeholder:text-slate-300"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-6 pr-12 py-4 bg-white rounded-2xl border border-[#ffedd5] outline-none font-medium text-slate-700 focus:ring-2 focus:ring-[#f97415]/10 focus:border-[#f97415] transition-all placeholder:text-slate-300"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
          </div>
        </div>

        <div className="flex justify-end pr-1">
          <Link
            to="/forgot-password"
            className="text-xs font-black text-[#f97415] hover:text-[#ea580c] transition-colors uppercase tracking-wider"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="w-full bg-[#f97415] text-white py-4 rounded-2xl font-[1000] flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all shadow-xl shadow-orange-100 active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>Sign In <ArrowRight size={18} /></>
          )}
        </button>

        {/* ... Rest of the UI remains the same ... */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-300 bg-transparent px-2">OR</div>
        </div>

        <p className="text-center text-sm font-medium text-slate-500">
          Don't have an account? <Link to="/register" className="text-[#f97415] font-black hover:underline">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
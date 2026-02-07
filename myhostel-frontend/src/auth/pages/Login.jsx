import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth.services.js';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const loginToast = toast.loading('Authenticating...');

    try {
      // FIX: Yahan formData.email, password alag-alag nahi, 
      // poora 'formData' object bhejna hai jaisa tumhari service mang rahi hai.
      const response = await login(formData);

      const data = response.data || response;

      if (data && data.token) {
        localStorage.clear(); // Purana kachra saaf

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Role check (Normalize to lowercase to avoid Warden vs warden issues)
        const userRole = data.user.role.toLowerCase();
        localStorage.setItem('role', userRole);

        const firstName = data.user.name ? data.user.name.split(' ')[0] : "Warden";

        toast.success(`Welcome back, ${firstName}! 👋`, { id: loginToast });

        // Navigation Logic
        if (userRole === 'warden' || userRole === 'admin') {
          navigate('/warden/dashboard', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      // Agar backend 500 de raha hai toh terminal check karo, par frontend ko crash mat hone do
      const errorMessage = err.response?.data?.message || "Invalid credentials or Server Error";
      toast.error(errorMessage, { id: loginToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to Dnyanda">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-6 pr-12 py-4 bg-white rounded-2xl border border-[#ffedd5] outline-none font-medium text-slate-700"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-6 pr-12 py-4 bg-white rounded-2xl border border-[#ffedd5] outline-none font-medium text-slate-700"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" size="xs" className="text-[#f97415] font-bold">
            Forgot Password?
          </Link>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-[#f97415] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
        </button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-[#f97415] font-black">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
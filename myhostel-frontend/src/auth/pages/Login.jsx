import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth.services.js';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import API from '../../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Role-based navigate helper
  const navigateByRole = (role) => {
    if (role === 'warden' || role === 'admin') {
      navigate('/warden/dashboard', { replace: true });
    } else {
      navigate('/student/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const loginToast = toast.loading('Authenticating...');
    try {
      const response = await login(formData);
      const data = response.data || response;

      if (data && data.token) {
        localStorage.clear();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        const userRole = data.user.role.toLowerCase();
        localStorage.setItem('role', userRole);

        const firstName = data.user.name ? data.user.name.split(' ')[0] : "User";
        toast.success(`Welcome back, ${firstName}! 👋`, { id: loginToast });

        navigateByRole(userRole);
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.message || "Invalid credentials or Server Error";
      toast.error(errorMessage, { id: loginToast });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login — role-based navigate
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGLoading(true);
      const gToast = toast.loading('Signing in with Google...');
      try {
        const { data: googleUser } = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const res = await API.post('/auth/google', {
          email: googleUser.email,
          name:  googleUser.name,
        });

        localStorage.clear();
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        const userRole = res.data.user.role.toLowerCase();
        localStorage.setItem('role', userRole);

        toast.success(`Welcome, ${googleUser.name.split(' ')[0]}! 👋`, { id: gToast });

        // ✅ Role check — warden goes to warden dashboard
        navigateByRole(userRole);

      } catch (err) {
        toast.error(err.response?.data?.message || 'Google Login Failed', { id: gToast });
      } finally {
        setGLoading(false);
      }
    },
    onError: () => toast.error('Google Login Failed'),
  });

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to Dnyanda">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="email" placeholder="Email Address" required
              className="w-full pl-6 pr-12 py-4 bg-white rounded-2xl border border-[#ffedd5] outline-none font-medium text-slate-700"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
          </div>
          <div className="relative">
            <input
              type="password" placeholder="Password" required
              className="w-full pl-6 pr-12 py-4 bg-white rounded-2xl border border-[#ffedd5] outline-none font-medium text-slate-700"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f97415]" size={20} />
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-[#f97415] font-bold text-sm">
            Forgot Password?
          </Link>
        </div>

        <button disabled={loading} type="submit"
          className="w-full bg-[#f97415] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-70">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-orange-100" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-orange-100" />
        </div>

        {/* Google Button */}
        <button type="button" onClick={() => handleGoogleLogin()} disabled={gLoading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-sm text-slate-700 shadow-sm active:scale-95 disabled:opacity-60">
          {gLoading
            ? <Loader2 className="animate-spin text-orange-500" size={18} />
            : <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          }
          {gLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#f97415] font-black">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
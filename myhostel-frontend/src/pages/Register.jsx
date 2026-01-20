import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Phone, Hash, BookOpen,
  Calendar, GraduationCap, Camera, ArrowRight, Layers
} from 'lucide-react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rollNumber: '',
    department: '',
    phone: '',
    course: '',
    batch: '',
    currentYear: '',
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Main fields
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', 'student');

    // studentDetails (schema matched)
    data.append('studentDetails[rollNumber]', formData.rollNumber);
    data.append('studentDetails[department]', formData.department);
    data.append('studentDetails[phone]', formData.phone);
    data.append('studentDetails[course]', formData.course);
    data.append('studentDetails[batch]', formData.batch);
    data.append('studentDetails[currentYear]', formData.currentYear);

    if (image) {
      data.append('idCardImage', image);
    }

    try {
      await API.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Registration Successful');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    // Main Container - overflow-hidden keeps the background static
    <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden">

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        // Scrollbar-hide logic added here
        className="bg-white w-full max-w-5xl h-[95vh] overflow-y-auto no-scrollbar
                   rounded-[2.5rem] shadow-2xl border border-slate-200 p-6 md:p-10 flex flex-col"
      >

        {/* Header */}
        <div className="text-center mb-8 flex-shrink-0">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Student Registration
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">
            Create your university hostel account
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow"
        >

          {/* Account Info Section */}
          <div className="lg:col-span-3 border-b-2 border-indigo-50 pb-2 mb-2">
            <h2 className="flex items-center gap-2 font-black text-indigo-600 uppercase text-xs tracking-widest">
              <User className="w-4 h-4" /> 1. Account Information
            </h2>
          </div>

          <Input label="Full Name" icon={User} name="fullName" placeholder="John Doe" onChange={handleChange} />
          <Input label="Email" icon={Mail} type="email" name="email" placeholder="Enter your email" onChange={handleChange} />
          <Input label="Password" icon={Lock} type="password" name="password" placeholder="Enter your password" onChange={handleChange} />

          {/* Academic Section */}
          <div className="lg:col-span-3 border-b-2 border-indigo-50 pb-2 mt-4 mb-2">
            <h2 className="flex items-center gap-2 font-black text-indigo-600 uppercase text-xs tracking-widest">
              <GraduationCap className="w-4 h-4" /> 2. Academic Details
            </h2>
          </div>

          <Input label="Roll Number" icon={Hash} name="rollNumber" placeholder="2024-CS-01" onChange={handleChange} />
          <Input label="Course" icon={Layers} name="course" placeholder="B.Tech" onChange={handleChange} />
          
          <Select
            label="Department"
            icon={BookOpen}
            name="department"
            onChange={handleChange}
            options={['CS', 'EE', 'ME', 'Civil']}
          />

          <Input label="Batch" icon={Calendar} name="batch" placeholder="2022-2026" onChange={handleChange} />
          <Input label="Current Year" icon={Layers} type="number" name="currentYear" placeholder="2026" onChange={handleChange} />
          <Input label="Phone" icon={Phone} name="phone" placeholder="+91 XXXXXXXXXX" onChange={handleChange} />

          {/* ID Upload Section */}
          <div className="lg:col-span-3 mt-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              ID Card Document
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center bg-slate-50 hover:bg-indigo-50/50 transition-all group">
              <input
                type="file"
                id="idCard"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label htmlFor="idCard" className="cursor-pointer flex flex-col items-center">
                <Camera className="h-10 w-10 text-slate-300 group-hover:text-indigo-400 mb-2 transition-colors" />
                <span className="text-indigo-600 font-bold text-sm">
                  {image ? image.name : 'Upload Student ID Proof'}
                </span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-3 mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700
                         text-white py-4 rounded-2xl font-black text-lg
                         shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              Create Account <ArrowRight className="w-6 h-6" />
            </button>
          </div>

        </form>

        <p className="text-center mt-8 text-slate-500 font-medium pb-2">
          Already have an account? 
          <Link to="/" className="text-indigo-600 font-black ml-2 hover:underline">
            Sign In
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const Input = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
      <input
        {...props}
        required
        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50
                   focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all text-sm font-semibold text-slate-700"
      />
    </div>
  </div>
);

const Select = ({ label, icon: Icon, options, ...props }) => (
  <div className="space-y-1 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
      <select
        {...props}
        required
        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50
                   focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none"
      >
        <option value="">Select Dept</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  </div>
);

export default Register;
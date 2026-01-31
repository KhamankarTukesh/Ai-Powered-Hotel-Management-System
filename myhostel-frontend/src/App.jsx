import React,{ useState , useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet ,useNavigate, useLocation} from 'react-router-dom'
import { Home } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Login from './auth/pages/Login'
import Register from './auth/pages/Register'
import VerifyOTP from './auth/pages/VerifyOTP'
import ForgotPassword from './auth/pages/ForgotPassword'
import ResetPassword from './auth/pages/ResetPassword'

import RoomDetails from './student/pages/RoomDetails'
import Notices from './student/pages/Notices'
import MessPanel from './student/pages/MessPanel'
import StudentActions from './student/pages/StudentActions'
import LeaveManagement from './student/pages/LeaveManagement'
import StudentComplaints from './student/pages/StudentComplaints'
import FeesPage from './student/pages/FeesPage'
import AttendanceAnalytics from './student/pages/AttendanceAnalytics'
import GatePassManager from './student/pages/GatePassManager'
import ActivityHistory from './student/pages/ActivityHistory'
import StudentProfile from './student/pages/StudentProfile'
import Navbar from './student/services/Navbar'
import StudentDashboard from './student/pages/StudentDashboard'
import Settings from './student/pages/Settings';
import ProtectedRoute from './auth/guards/ProtectedRoute'
import API from './api/axios';





//warden
import MarkAttendance from './warden/pages/MarkAttendance';
import WardenComplaintDashboard from './warden/pages/WardenComplaintDashboard';



const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null); // Profile state yahan banai

  // 1. Backend se user data fetch karne ka logic
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Apne actual endpoint ko yahan dalo (jaise /api/users/profile)
        const res = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Fetched Profile:", res.data); // Debugging ke liye
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfileData();
  }, []);

  const isNotDashboard = location.pathname !== '/student/dashboard' && location.pathname !== '/';

  return (
    <div className="min-h-screen bg-[#FFFBF9] relative">
      {/* 2. ✅ Navbar ko fetch kiya hua profile pass kiya */}
      <Navbar profile={profile} /> 

      {/* Back Button Logic... (keep it as it is) */}
      {isNotDashboard && (
        <button
          onClick={() => navigate('/student/dashboard')}
          className="fixed bottom-8 right-8 z-[999] group flex items-center gap-3 bg-slate-900 text-white pl-4 pr-6 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 transition-all duration-500 hover:scale-110 active:scale-95"
        >
          <div className="relative size-10 bg-[#f97415] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/40 group-hover:rotate-[360deg] transition-transform duration-700">
            <Home size={20} strokeWidth={3} />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 leading-none">Return to</span>
            <span className="text-sm font-[1000] tracking-tight">DASHBOARD</span>
          </div>
        </button>
      )}
      
      <main className="pt-28 pb-10 px-4 md:px-8 max-w-[1500px] mx-auto">
        {/* 3. ✅ Outlet ke through child pages ko bhi data bhej sakte hain */}
        <Outlet context={{ profile }} /> 
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword/>} />

        {/* ✅ Protected Student Routes (Logic Applied Here) */}
        <Route 
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          {/* Ye sab tabhi dikhenge jab login hoga */}
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/room-details" element={<RoomDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/mess-panel" element={<MessPanel />} />
          <Route path="/student-actions" element={<StudentActions />} />
          <Route path="/leave-management" element={<LeaveManagement />} />
          <Route path="/complaints" element={<StudentComplaints />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/attendance-analytics" element={<AttendanceAnalytics />} />
          <Route path="/gate-pass-manager" element={<GatePassManager />} />
          <Route path='/activity-history' element={<ActivityHistory/>}/>
          <Route path='/student/profile' element={<StudentProfile/>}/>



          {/* warden */}
          <Route path='/markattendance' element={<MarkAttendance/>}/>
          <Route path='/warden/complaints' element={<WardenComplaintDashboard/>}/>
        </Route>

        <Route path='/navbar-preview' element={<Navbar/>}/>
      </Routes>
    </Router>
  )
}

export default App
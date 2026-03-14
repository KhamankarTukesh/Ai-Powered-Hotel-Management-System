import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home } from "lucide-react";
import { Toaster } from "react-hot-toast";

/* ================= COMPONENTS ================= */
import Footer from "./auth/components/Footer";
import Navbar from "./student/services/Navbar";

/* ================= AUTH ================= */
import Login from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import VerifyOTP from "./auth/pages/VerifyOTP";
import ForgotPassword from "./auth/pages/ForgotPassword";
import ResetPassword from "./auth/pages/ResetPassword";
import ProtectedRoute from "./auth/guards/ProtectedRoute";

/* ================= PAGES ================= */
import LandingPage from "./auth/components/LandingPage";
import ResourcesPage from "./auth/components/resources/Resourcespage";
import LegalPage from "./auth/components/LegalPage";

/* ================= STUDENT ================= */
import StudentDashboard from "./student/pages/StudentDashboard";
import RoomDetails from "./student/pages/RoomDetails";
import Notices from "./student/pages/Notices";
import MessPanel from "./student/pages/MessPanel";
import StudentActions from "./student/pages/StudentActions";
import LeaveManagement from "./student/pages/LeaveManagement";
import StudentComplaints from "./student/pages/StudentComplaints";
import FeesPage from "./student/pages/FeesPage";
import AttendanceAnalytics from "./student/pages/AttendanceAnalytics";
import GatePassManager from "./student/pages/GatePassManager";
import ActivityHistory from "./student/pages/ActivityHistory";
import StudentProfile from "./student/pages/StudentProfile";
import Settings from "./student/pages/Settings";

/* ================= WARDEN ================= */
import WardenDashboard from "./warden/WardenDashboard";
import MarkAttendance from "./warden/pages/MarkAttendance";
import WardenComplaintDashboard from "./warden/pages/WardenComplaintDashboard";
import CreateFee from "./warden/pages/wardenfeedashboard/CreateFee";
import WardenVerifyPayments from "./warden/pages/wardenfeedashboard/WardenVerifyPayments";
import WardenFeeActions from "./warden/pages/wardenfeedashboard/WardenFeeActions";
import WardenManagement from "./warden/pages/wardenfeedashboard/WardenManagement";
import WardenFeeDashboard from "./warden/pages/wardenfeedashboard/WardenFeeDashboard";
import WardenLeaveManagement from "./warden/pages/WardenLeaveManagement";
import MessMenuEditor from "./warden/pages/MessMenuEditor";
import WardenNoticeManager from "./warden/pages/WardenNoticeManager";
import WardenRoomManager from "./warden/pages/WardenRoomManager";
import WardenRoomRequests from "./warden/pages/RoomChangeRequests";
import WardenProfile from "./warden/pages/WardenProfile";
import WardenGatePassPortal from "./warden/pages/WardenGatePassPortal";
import WardenMessActivity from "./warden/pages/WardenMessActivity";
import StudentActivity from "./warden/pages/StudentActivity";

/* ================= BACK BUTTON ================= */
const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed bottom-8 right-8 z-[999] flex items-center gap-3 bg-slate-900 text-white pl-4 pr-6 py-4 rounded-[2rem] hover:bg-slate-800 transition-all shadow-lg active:scale-95"
    >
      <div className="size-10 bg-[#f97415] rounded-2xl flex items-center justify-center">
        <Home size={20} />
      </div>
      <span className="font-bold uppercase tracking-widest text-[10px]">Back</span>
    </button>
  );
};

const getUserProfile = () => {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return null;
  try { return JSON.parse(savedUser); }
  catch (e) { return null; }
};

/* ================= APP LAYOUT ================= */
const AppLayout = () => {
  const location = useLocation();
  const [profile, setProfile] = useState(getUserProfile());

  useEffect(() => {
    setProfile(getUserProfile());
  }, [location.pathname]);

  const isDashboard =
    location.pathname === "/student/dashboard" ||
    location.pathname === "/warden/dashboard";

  return (
    <div className="min-h-screen w-full bg-[#fffaf5] flex flex-col relative overflow-x-hidden">
      <Navbar profile={profile} />
      {!isDashboard && <BackButton />}
      <main className="flex-grow pt-28 pb-10 px-4 sm:px-6 w-full max-w-[1600px] mx-auto transition-all duration-300">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

/* ================= APP ================= */
function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '16px',
            background: '#1e293b',
            color: '#fff',
            fontWeight: '600'
          },
        }}
      />

      <Routes>

        {/* ✅ Landing page — sabse pehle "/" */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes — no Navbar/Footer */}
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/verify-otp"      element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/resources"       element={<ResourcesPage />} />
        <Route path="/legal"           element={<LegalPage />} />

        {/* Protected Routes — with Navbar + Footer */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* STUDENT */}
            <Route path="/student/dashboard"    element={<StudentDashboard />} />
            <Route path="/student/profile"      element={<StudentProfile />} />
            <Route path="/room-details"         element={<RoomDetails />} />
            <Route path="/notices"              element={<Notices />} />
            <Route path="/mess-panel"           element={<MessPanel />} />
            <Route path="/student-actions"      element={<StudentActions />} />
            <Route path="/leave-management"     element={<LeaveManagement />} />
            <Route path="/complaints"           element={<StudentComplaints />} />
            <Route path="/fees"                 element={<FeesPage />} />
            <Route path="/attendance-analytics" element={<AttendanceAnalytics />} />
            <Route path="/gate-pass-manager"    element={<GatePassManager />} />
            <Route path="/activity-history"     element={<ActivityHistory />} />
            <Route path="/settings"             element={<Settings />} />

            {/* WARDEN */}
            <Route path="/warden/dashboard"      element={<WardenDashboard />} />
            <Route path="/warden/profile" element={<WardenProfile />} />
            <Route path="/markattendance"        element={<MarkAttendance />} />
            <Route path="/warden/complaints"     element={<WardenComplaintDashboard />} />
            <Route path="/warden/fees"           element={<CreateFee />} />
            <Route path="/warden/verify"         element={<WardenVerifyPayments />} />
            <Route path="/warden/actions"        element={<WardenFeeActions />} />
            <Route path="/warden/management"     element={<WardenManagement />} />
            <Route path="/warden/feedashboard"   element={<WardenFeeDashboard />} />
            <Route path="/warden/leave"          element={<WardenLeaveManagement />} />
            <Route path="/warden/menu"           element={<MessMenuEditor />} />
            <Route path="/warden/notices"        element={<WardenNoticeManager />} />
            <Route path="/warden/rooms"          element={<WardenRoomManager />} />
            <Route path="/warden/room-requests"  element={<WardenRoomRequests />} />
            <Route path="/warden/gate-pass"      element={<WardenGatePassPortal />} />
            <Route path="/warden/mess/activity"  element={<WardenMessActivity />} />
            <Route path="/warden/student-activity" element={<StudentActivity />} />

          </Route>
        </Route>

        {/* ✅ Fallback — unknown routes → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
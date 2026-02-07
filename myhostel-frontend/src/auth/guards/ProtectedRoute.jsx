import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Agar user Warden ke path par hai par role 'student' hai, toh wapas bhejo
  if (location.pathname.startsWith('/warden') && user.role !== 'warden' && user.role !== 'admin') {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
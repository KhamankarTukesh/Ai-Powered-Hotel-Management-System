import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './auth/pages/Login'
import Register from './auth/pages/Register'

import RoomDetails from './student/pages/RoomDetails'
import Notices from './student/pages/Notices'
import MessPanel from './student/pages/MessPanel'
import StudentActions from './student/pages/StudentActions'
import LeaveManagement from './student/pages/LeaveManagement'
import StudentComplaints from './student/pages/StudentComplaints'
import FeesPage from './student/pages/FeesPage'
import AttendanceAnalytics from './student/pages/AttendanceAnalytics'
import GatePassManager from './student/pages/GatePassManager'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/mess-panel" element={<MessPanel />} />
        <Route path="/student-actions" element={<StudentActions />} />
        <Route path="/leave-management" element={<LeaveManagement />} />
        <Route path="/complaints" element={<StudentComplaints />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="/attendance-analytics" element={<AttendanceAnalytics />} />
        <Route path="/gate-pass-manager" element={<GatePassManager />} />
      </Routes>
    </Router>
  )
}

export default App
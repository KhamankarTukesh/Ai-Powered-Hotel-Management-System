import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './auth/pages/Login';
import Register from './auth/pages/Register';
import VerifyOTP from './auth/pages/VerifyOTP';
import ForgotPassword from './auth/pages/ForgotPassword';
import ResetPassword from './auth/pages/ResetPassword';
import UpdateProfile from './components/Profile/UpdateProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/update-profile' element={<UpdateProfile />} />
      </Routes>
    </Router>
  )
}

export default App
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './auth/pages/Login';
import Register from './auth/pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
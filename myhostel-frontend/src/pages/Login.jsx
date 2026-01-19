import React from "react";
import API from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";




const Login = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    return (
        <div className="flexm items-center justify-center min-h-screen bg-gray-100">
            

        </div>
    )
}

export default Login;
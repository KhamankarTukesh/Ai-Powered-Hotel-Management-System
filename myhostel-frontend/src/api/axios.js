import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api'
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    // Auth routes ke liye token ki zarurat nahi hoti
    const isAuthRoute = config.url.includes('/login') || config.url.includes('/register') || config.url.includes('/verify-otp');

    if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
import axios from 'axios';

// ✅ Fix: hardcoded production URL — no more localhost issue
const BASE_URL = import.meta.env.VITE_API_URL 
    || 'https://ai-powered-hotel-management-system-m8eg.onrender.com/api';

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        const isAuthRoute =
            config.url.includes('/login') ||
            config.url.includes('/register') ||
            config.url.includes('/verify-otp');

        if (token && !isAuthRoute) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Auto handle 401 — redirect to login if token expired
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;
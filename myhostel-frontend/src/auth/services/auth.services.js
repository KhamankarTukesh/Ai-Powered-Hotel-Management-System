import API from "../../api/axios";

export const login = (data) => API.post("/auth/login", data);

export const register = (data) => {
  // Multipart data ke liye (ID Card Upload)
  return API.post("/auth/register", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const verifyOTP = (data) => API.post("/auth/verify-otp", data);
export const resendOTP = (email) => API.post("/auth/resend-otp", { email });
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (data) => API.post("/auth/reset-password", data);

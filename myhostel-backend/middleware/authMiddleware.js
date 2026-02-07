import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protect = async (req, res, next) => {
    let token;

    // 1️⃣ Token extract
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2️⃣ No token
    if (!token) {
        console.log("❌ No token in request");
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // 3️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4️⃣ Attach user to request
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log("❌ User not found for token");
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // 🔥 MOST IMPORTANT LINE

        next(); // ✅ must be reached
    } catch (error) {
        console.error("🔴 JWT Error:", error.message);
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};

// --- ADMIN ONLY ---
export const adminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'warden')) {
        next();
    } else {
        return res.status(403).json({ 
            message: "Access denied: Admin/Warden clearance required" 
        });
    }
};

// --- STAFF ONLY (Corrected Logic) ---
export const staffOnly = (req, res, next) => {
    // Purane code mein brackets ki galti thi, usey sahi kiya:
    const hasAccess = req.user && (
        req.user.role === 'staff' || 
        req.user.role === 'admin' || 
        req.user.role === 'warden'
    );

    if (hasAccess) {
        next();
    } else {
        return res.status(403).json({ 
            message: "Access denied: Staff, Admin or Warden only" 
        });
    }
};
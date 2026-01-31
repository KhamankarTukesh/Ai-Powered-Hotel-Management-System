import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select('-password');
            
            // Check agar user delete toh nahi ho gaya token milne ke baad
            if (!req.user) {
                return res.status(401).json({ message: "User no longer exists" });
            }

            return next(); 
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
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
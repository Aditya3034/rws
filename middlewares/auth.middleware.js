// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import { db } from '../config/firebase.js';
import { doc, getDoc } from 'firebase/firestore';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    
    // Get user from Firestore
    const userDocRef = doc(db, 'users', decoded.id);
    const userSnap = await getDoc(userDocRef);
    
    if (!userSnap.exists()) {
      return next(errorHandler(404, 'User not found'));
    }
    
    // Add user to request
    req.user = { id: decoded.id, ...userSnap.data() };
    delete req.user.password;
    
    next();
  } catch (error) {
    next(errorHandler(401, 'Invalid token'));
  }
};


export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(errorHandler(401, 'Authentication required'));
    }
    
    // Check if user is admin
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Access denied: Admin privileges required'));
    }
    
    next();
  } catch (error) {
    return next(errorHandler(500, 'Server error'));
  }
};
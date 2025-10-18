import jwt from 'jsonwebtoken';
import process from 'process';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided',
        message: 'Authentication required. Please log in.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ 
          success: false,
          error: 'User not found',
          message: 'The user associated with this token no longer exists.'
        });
      }

      // Check if user is active (default to true if field doesn't exist for backward compatibility)
      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          error: 'Account deactivated',
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      let errorMessage = 'Invalid or expired token';
      
      if (error.name === 'TokenExpiredError') {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid authentication token';
      }
      
      return res.status(401).json({
        success: false,
        error: errorMessage,
        message: 'Authentication failed. Please log in again.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Error in authentication middleware' });
  }
}; 
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import process from 'process';

// Protect routes - user must be authenticated
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Check if user is a brand
export const brand = (req, res, next) => {
  if (req.user && req.user.userType === 'brand') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a brand');
  }
};

// Check if user is an influencer
export const influencer = (req, res, next) => {
  if (req.user && req.user.userType === 'influencer') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an influencer');
  }
};

// Check if user is an admin
export const admin = (req, res, next) => {
  if (req.user && req.user.userType === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

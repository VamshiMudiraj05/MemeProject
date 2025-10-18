import User from '../models/User.js';
import Brand from '../models/Brand.js';
import Influencer from '../models/Influencer.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get profile based on user type
    let profile;
    if (user.userType === 'brand') {
      profile = await Brand.findOne({ user: user._id });
    } else if (user.userType === 'influencer') {
      profile = await Influencer.findOne({ user: user._id });
    }

    // Combine user and profile data
    const userData = {
      id: user._id,
      email: user.email,
      userType: user.userType,
      ...profile?.toObject(), // Spread profile data if it exists
    };

    res.json(userData);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: error.message || 'Error fetching user data' });
  }
};

// Register User
export const register = async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userType, email, password, ...profileData } = req.body;

    // Log the incoming request data
    console.log('Registration request:', { userType, email, profileData });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user within transaction
    const user = await User.create([{
      email,
      password,
      userType,
    }], { session });

    // Create profile based on user type within transaction
    let profile;
    if (userType === 'brand') {
      profile = await Brand.create([{
        user: user[0]._id,
        ...profileData,
      }], { session });
    } else if (userType === 'influencer') {
      profile = await Influencer.create([{
        user: user[0]._id,
        ...profileData,
      }], { session });
    } else {
      throw new Error(`Invalid user type: ${userType}`);
    }

    // If everything is successful, commit the transaction
    await session.commitTransaction();

    // Generate token
    const token = generateToken(user[0]._id);

    // Send response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user[0]._id,
        email: user[0].email,
        userType: user[0].userType,
      },
      profile: profile[0],
    });
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate Error',
        details: 'A user with this email already exists'
      });
    }

    res.status(500).json({ 
      error: 'Error registering user',
      details: error.message 
    });
  } finally {
    // End the session
    session.endSession();
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Get profile based on user type
    let profile;
    if (user.userType === 'brand') {
      profile = await Brand.findOne({ user: user._id });
    } else if (user.userType === 'influencer') {
      profile = await Influencer.findOne({ user: user._id });
    }

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
      },
      profile,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Error logging in' });
  }
};

// Update current user
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userType } = req.user;
    const updateData = req.body;

    let profile;
    if (userType === 'brand') {
      profile = await Brand.findOneAndUpdate({ user: userId }, updateData, {
        new: true,
        runValidators: true,
      });
    } else if (userType === 'influencer') {
      profile = await Influencer.findOneAndUpdate({ user: userId }, updateData, {
        new: true,
        runValidators: true,
      });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Update me error:', error);
    res.status(500).json({ error: error.message || 'Error updating user data' });
  }
}; 
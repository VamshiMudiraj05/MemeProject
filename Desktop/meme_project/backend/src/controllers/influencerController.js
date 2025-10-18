import Influencer from '../models/Influencer.js';
import User from '../models/User.js';

export const getAllInfluencers = async (req, res) => {
  try {
    // Get all influencers with user details
    const influencers = await Influencer.find({})
      .populate('user', 'email')
      .select('-__v -createdAt -updatedAt')
      .lean();

    res.status(200).json({
      success: true,
      count: influencers.length,
      data: influencers
    });
  } catch (error) {
    console.error('Error fetching influencers:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch influencers. Please try again later.'
    });
  }
};

export const getInfluencerById = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id)
      .populate('user', 'email')
      .select('-__v -createdAt -updatedAt')
      .lean();

    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Influencer not found with the specified ID'
      });
    }

    res.status(200).json({
      success: true,
      data: influencer
    });
  } catch (error) {
    console.error('Error fetching influencer:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'The provided ID is not valid'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch influencer details. Please try again later.'
    });
  }
};

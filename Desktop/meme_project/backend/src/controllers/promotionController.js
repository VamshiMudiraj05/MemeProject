import asyncHandler from 'express-async-handler';
import Promotion from '../models/Promotion.js';
import { uploadToCloudinary } from '../config/cloudinary.js'; // Assuming this function exists and works
import { Buffer } from 'buffer';

// @desc    Create a new promotion
// @route   POST /api/promotions
// @access  Private (Brands only)
const createPromotion = asyncHandler(async (req, res) => {
  // Assuming user/brand is attached to req by authentication middleware
  const brand = req.user._id; // Adjust based on how user is attached

  if (!brand) {
    res.status(401);
    throw new Error('Not authorized, no brand associated');
  }

  const { title, description, platforms, budget, startDate, endDate } = req.body;
  
  // Check for required fields
  if (!title || !description || !platforms || !budget || !startDate || !endDate) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  let briefUrl = null;
  // Handle file upload if a file is present
  if (req.file) {
    try {
      // Use the existing Cloudinary upload function
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const cloudinaryResult = await uploadToCloudinary(dataURI);
      briefUrl = cloudinaryResult.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500);
      throw new Error('Error uploading file to Cloudinary');
    }
  }

  // Create the promotion in the database
  const promotion = await Promotion.create({
    brand,
    title,
    description,
    platforms: JSON.parse(platforms), // Parse the JSON string back to an array
    budget,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    briefUrl,
  });

  if (promotion) {
    res.status(201).json({
      _id: promotion._id,
      brand: promotion.brand,
      title: promotion.title,
      description: promotion.description,
      platforms: promotion.platforms,
      budget: promotion.budget,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      briefUrl: promotion.briefUrl,
      createdAt: promotion.createdAt,
      updatedAt: promotion.updatedAt,
    });
  } else {
    res.status(400);
    throw new Error('Invalid promotion data');
  }
});

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Private (Influencers)
const getPromotions = asyncHandler(async (req, res) => {
  try {
    // Get current date to filter active promotions
    const currentDate = new Date();
    
    // Find promotions that are active (current date is between start and end date)
    const promotions = await Promotion.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    })
    .populate('brand', 'name email') // Populate brand details
    .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500);
    throw new Error('Error fetching promotions');
  }
});

// @desc    Get promotions by brand
// @route   GET /api/promotions/brand
// @access  Private (Brands only)
const getBrandPromotions = asyncHandler(async (req, res) => {
  try {
    const brandId = req.user._id;
    
    // Find promotions created by this brand
    const promotions = await Promotion.find({ brand: brandId })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(promotions);
  } catch (error) {
    console.error('Error fetching brand promotions:', error);
    res.status(500);
    throw new Error('Error fetching promotions');
  }
});

export { createPromotion, getPromotions, getBrandPromotions }; 
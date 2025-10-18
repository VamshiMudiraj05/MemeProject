import asyncHandler from 'express-async-handler';
import Application from '../models/Application.js';
import Promotion from '../models/Promotion.js';
import Influencer from '../models/Influencer.js';
import User from '../models/User.js';

// @desc    Apply for a promotion
// @route   POST /api/applications
// @access  Private (Influencers only)
const applyForPromotion = asyncHandler(async (req, res) => {
  const { promotionId, message, proposedPrice, proposedContent } = req.body;
  const influencerId = req.user._id; // Assuming user is attached by auth middleware

  // Check if promotion exists and is active
  const promotion = await Promotion.findById(promotionId);
  if (!promotion) {
    res.status(404);
    throw new Error('Promotion not found');
  }

  // Check if promotion is still active
  const currentDate = new Date();
  if (currentDate < promotion.startDate || currentDate > promotion.endDate) {
    res.status(400);
    throw new Error('Promotion is not active');
  }

  // Check if influencer exists
  const influencer = await Influencer.findOne({ user: influencerId });
  if (!influencer) {
    res.status(404);
    throw new Error('Influencer profile not found');
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    promotion: promotionId,
    influencer: influencer._id,
  });

  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied for this promotion');
  }

  // Create application
  const application = await Application.create({
    promotion: promotionId,
    influencer: influencer._id,
    message,
    proposedPrice,
    proposedContent,
  });

  // Populate references for response
  await application.populate([
    { path: 'promotion', select: 'title description budget' },
    { path: 'influencer', select: 'alias followers engagement' },
  ]);

  res.status(201).json({
    success: true,
    data: application,
  });
});

// @desc    Get applications for a promotion (Brand only)
// @route   GET /api/applications/promotion/:promotionId
// @access  Private (Brands only)
const getApplicationsForPromotion = asyncHandler(async (req, res) => {
  const { promotionId } = req.params;
  const brandId = req.user._id;

  // Check if promotion exists and belongs to the brand
  const promotion = await Promotion.findOne({
    _id: promotionId,
    brand: brandId,
  });

  if (!promotion) {
    res.status(404);
    throw new Error('Promotion not found or access denied');
  }

  // Get applications for this promotion
  const applications = await Application.find({ promotion: promotionId })
    .populate('influencer', 'alias followers engagement accountType pricing')
    .populate('promotion', 'title description budget')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Get influencer's applications
// @route   GET /api/applications/influencer
// @access  Private (Influencers only)
const getInfluencerApplications = asyncHandler(async (req, res) => {
  const influencerId = req.user._id;

  // Get influencer profile
  const influencer = await Influencer.findOne({ user: influencerId });
  if (!influencer) {
    res.status(404);
    throw new Error('Influencer profile not found');
  }

  // Get applications by this influencer
  const applications = await Application.find({ influencer: influencer._id })
    .populate('promotion', 'title description budget platforms startDate endDate')
    .populate('promotion.brand', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// @desc    Update application status (Brand only)
// @route   PUT /api/applications/:applicationId/status
// @access  Private (Brands only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  const brandId = req.user._id;

  // Validate status
  if (!['pending', 'accepted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  // Find application and check if promotion belongs to brand
  const application = await Application.findById(applicationId)
    .populate('promotion');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.promotion.brand.toString() !== brandId.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  // Update status
  application.status = status;
  await application.save();

  // Populate references for response
  await application.populate([
    { path: 'promotion', select: 'title description budget' },
    { path: 'influencer', select: 'alias followers engagement' },
  ]);

  res.status(200).json({
    success: true,
    data: application,
  });
});

export {
  applyForPromotion,
  getApplicationsForPromotion,
  getInfluencerApplications,
  updateApplicationStatus,
}; 
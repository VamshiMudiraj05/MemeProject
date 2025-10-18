import express from 'express';
import {
  applyForPromotion,
  getApplicationsForPromotion,
  getInfluencerApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply for a promotion (Influencers only)
router.post('/', protect, applyForPromotion);

// Get applications for a specific promotion (Brands only)
router.get('/promotion/:promotionId', protect, getApplicationsForPromotion);

// Get influencer's applications (Influencers only)
router.get('/influencer', protect, getInfluencerApplications);

// Update application status (Brands only)
router.put('/:applicationId/status', protect, updateApplicationStatus);

export default router; 
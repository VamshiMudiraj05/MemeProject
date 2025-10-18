import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getAllInfluencers, 
  getInfluencerById 
} from '../controllers/influencerController.js';

const router = express.Router();

// Protected routes - require authentication
router.get('/', protect, getAllInfluencers);
router.get('/:id', protect, getInfluencerById);

export default router;

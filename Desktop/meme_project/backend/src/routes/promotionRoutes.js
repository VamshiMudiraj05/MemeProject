import express from 'express';
import { createPromotion, getPromotions, getBrandPromotions } from '../controllers/promotionController.js';
import multer from 'multer';
import { protect, brand } from '../middleware/authMiddleware.js'; // Assuming you have auth middleware

const router = express.Router();

// Configure multer storage - using memoryStorage like in server.js
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET /api/promotions
// @access  Private (Influencers)
router.route('/').get(protect, getPromotions);

// @route   POST /api/promotions
// @access  Private (Brands only)
router.route('/').post(protect, brand, upload.single('briefFile'), createPromotion);

// @route   GET /api/promotions/brand
// @access  Private (Brands only)
router.route('/brand').get(protect, brand, getBrandPromotions);

export default router; 
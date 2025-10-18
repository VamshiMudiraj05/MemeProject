import express from 'express';
import {
  sendMessage,
  getConversations,
  getConversationMessages,
  markAsRead,
  getUnreadCount,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Send a message (with optional file upload)
router.post('/', protect, upload.single('attachment'), sendMessage);

// Get all conversations for current user
router.get('/conversations', protect, getConversations);

// Get messages for a specific conversation
router.get('/conversation/:conversationId', protect, getConversationMessages);

// Mark messages as read
router.put('/read', protect, markAsRead);

// Get unread message count
router.get('/unread-count', protect, getUnreadCount);

export default router; 
import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';
import Brand from '../models/Brand.js';
import Influencer from '../models/Influencer.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { Buffer } from 'buffer';
import User from '../models/User.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, recipientType, content, messageType = 'text' } = req.body;
  const senderId = req.user._id;
  
  // Determine sender type based on user
  const brand = await Brand.findOne({ user: senderId });
  const influencer = await Influencer.findOne({ user: senderId });
  
  let senderType;
  if (brand) senderType = 'Brand';
  else if (influencer) senderType = 'Influencer';
  else {
    res.status(400);
    throw new Error('User profile not found');
  }

  // Validate recipient
  if (!recipientId || !recipientType) {
    res.status(400);
    throw new Error('Recipient information is required');
  }

  // Check if recipient exists
  let recipientProfile;
  if (recipientType === 'Brand') {
    recipientProfile = await Brand.findById(recipientId);
  } else if (recipientType === 'Influencer') {
    recipientProfile = await Influencer.findById(recipientId);
  } else {
    res.status(400);
    throw new Error('Invalid recipient type');
  }

  if (!recipientProfile) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  // Handle file upload if present
  let attachment = null;
  if (req.file && messageType !== 'text') {
    try {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const cloudinaryResult = await uploadToCloudinary(dataURI);
      attachment = {
        url: cloudinaryResult.secure_url,
        filename: req.file.originalname,
        fileType: req.file.mimetype,
      };
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500);
      throw new Error('Error uploading file');
    }
  }

  // Create message
  const message = new Message({
    sender: senderType === 'Brand' ? brand._id : influencer._id,
    senderModel: senderType,
    recipient: recipientId,
    recipientModel: recipientType,
    content,
    messageType,
    attachment,
  });
  await message.save();

  // Populate sender and recipient details
  await message.populate([
    { path: 'sender', select: 'name alias email' },
    { path: 'recipient', select: 'name alias email' },
  ]);

  res.status(201).json({
    success: true,
    data: message,
  });
});

// @desc    Get conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Get user profile
  const brand = await Brand.findOne({ user: userId });
  const influencer = await Influencer.findOne({ user: userId });
  
  let userProfile;
  
  if (brand) {
    userProfile = brand;
  } else if (influencer) {
    userProfile = influencer;
  } else {
    res.status(400);
    throw new Error('User profile not found');
  }

  // Get all conversations where user is either sender or recipient
  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: userProfile._id },
          { recipient: userProfile._id },
        ],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$recipient', userProfile._id] },
                  { $eq: ['$read', false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: { 'lastMessage.createdAt': -1 },
    },
  ]);

  // Populate conversation details (sender and recipient)
  const populatedConversations = await Promise.all(
    conversations.map(async (conv) => {
      const lastMsg = await Message.findById(conv.lastMessage._id)
        .populate('sender', 'name alias email')
        .populate('recipient', 'name alias email');
      const otherParticipantId = 
        lastMsg.sender._id.toString() === userProfile._id.toString()
          ? lastMsg.recipient._id
          : lastMsg.sender._id;
      const otherParticipantType = 
        lastMsg.sender._id.toString() === userProfile._id.toString()
          ? lastMsg.recipientModel
          : lastMsg.senderModel;
      let otherParticipant;
      if (otherParticipantType === 'Brand') {
        const brand = await Brand.findById(otherParticipantId).lean();
        const userDoc = await (brand ? User.findById(brand.user).lean() : null);
        otherParticipant = {
          ...brand,
          email: userDoc?.email || '',
        };
      } else {
        const influencer = await Influencer.findById(otherParticipantId).lean();
        const userDoc = await (influencer ? User.findById(influencer.user).lean() : null);
        otherParticipant = {
          ...influencer,
          email: userDoc?.email || '',
        };
      }
      return {
        conversationId: conv._id,
        lastMessage: lastMsg,
        unreadCount: conv.unreadCount,
        otherParticipant,
        otherParticipantType,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: populatedConversations,
  });
});

// @desc    Get messages for a specific conversation
// @route   GET /api/messages/conversation/:conversationId
// @access  Private
const getConversationMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  // Get user profile
  const brand = await Brand.findOne({ user: userId });
  const influencer = await Influencer.findOne({ user: userId });
  
  let userProfile;
  if (brand) userProfile = brand;
  else if (influencer) userProfile = influencer;
  else {
    res.status(400);
    throw new Error('User profile not found');
  }

  // Verify user is part of this conversation
  const conversation = await Message.findOne({
    conversationId,
    $or: [
      { sender: userProfile._id },
      { recipient: userProfile._id },
    ],
  });

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Get all messages in conversation, populate sender and recipient
  const messages = await Message.find({ conversationId })
    .populate('sender', 'name alias email')
    .populate('recipient', 'name alias email')
    .sort({ createdAt: 1 });

  // Mark messages as read
  await Message.updateMany(
    {
      conversationId,
      recipient: userProfile._id,
      read: false,
    },
    { read: true }
  );

  res.status(200).json({
    success: true,
    data: messages,
  });
});

// @desc    Mark messages as read
// @route   PUT /api/messages/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.body;
  const userId = req.user._id;

  // Get user profile
  const brand = await Brand.findOne({ user: userId });
  const influencer = await Influencer.findOne({ user: userId });
  
  let userProfile;
  if (brand) userProfile = brand;
  else if (influencer) userProfile = influencer;
  else {
    res.status(400);
    throw new Error('User profile not found');
  }

  // Mark messages as read
  const result = await Message.updateMany(
    {
      conversationId,
      recipient: userProfile._id,
      read: false,
    },
    { read: true }
  );

  res.status(200).json({
    success: true,
    message: 'Messages marked as read',
    updatedCount: result.modifiedCount,
  });
});

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user profile
  const brand = await Brand.findOne({ user: userId });
  const influencer = await Influencer.findOne({ user: userId });
  
  let userProfile;
  if (brand) userProfile = brand;
  else if (influencer) userProfile = influencer;
  else {
    res.status(400);
    throw new Error('User profile not found');
  }

  // Count unread messages
  const unreadCount = await Message.countDocuments({
    recipient: userProfile._id,
    read: false,
  });

  res.status(200).json({
    success: true,
    unreadCount,
  });
});

export {
  sendMessage,
  getConversations,
  getConversationMessages,
  markAsRead,
  getUnreadCount,
}; 
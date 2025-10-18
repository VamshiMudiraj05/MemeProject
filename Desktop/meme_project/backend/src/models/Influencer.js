import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  alias: {
    type: String,
    required: [true, 'Alias is required'],
    trim: true,
  },
  instagram: {
    type: String,
    required: [true, 'Instagram handle is required'],
    trim: true,
  },
  followers: {
    type: Number,
    required: [true, 'Followers count is required'],
    min: [0, 'Followers count cannot be negative'],
  },
  engagement: {
    type: Number,
    required: [true, 'Engagement rate is required'],
    min: [0, 'Engagement rate cannot be negative'],
  },
  accountType: {
    type: String,
    required: [true, 'Account type is required'],
    enum: ['Meme Page', 'Fan Page', 'Fitness', 'Fashion', 'Cricket', 'Other'],
  },
  pricing: {
    storyPrice: {
      type: Number,
      required: [true, 'Story price is required'],
      min: [0, 'Price cannot be negative'],
    },
    postPrice: {
      type: Number,
      required: [true, 'Post price is required'],
      min: [0, 'Price cannot be negative'],
    },
    reelPrice: {
      type: Number,
      required: [true, 'Reel price is required'],
      min: [0, 'Price cannot be negative'],
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    pricingNotes: String,
  },
  samplePosts: [{
    url: String,
    public_id: String,
  }],
  verificationScreenshot: {
    url: String,
    public_id: String,
  },
  profilePic: {
    url: String,
    public_id: String,
  },
  bio: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
influencerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Influencer', influencerSchema); 
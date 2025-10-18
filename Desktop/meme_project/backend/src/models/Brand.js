import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  instagram: {
    type: String,
    required: [true, 'Instagram handle is required'],
    trim: true,
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: ['Tech', 'Fashion', 'Food', 'Education', 'Finance', 'Health', 'Entertainment', 'Other'],
  },
  monthlyBudget: {
    type: Number,
    required: [true, 'Monthly budget is required'],
    min: [0, 'Budget cannot be negative'],
  },
  campaignDescription: {
    type: String,
    required: [true, 'Campaign description is required'],
    trim: true,
  },
  logo: {
    url: String,
    public_id: String,
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
brandSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Brand', brandSchema); 
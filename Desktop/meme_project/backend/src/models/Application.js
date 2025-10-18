import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema(
  {
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Promotion',
    },
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Influencer',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      required: false,
    },
    proposedPrice: {
      type: Number,
      required: false,
    },
    proposedContent: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications from the same influencer for the same promotion
applicationSchema.index({ promotion: 1, influencer: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application; 
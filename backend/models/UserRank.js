import mongoose from 'mongoose';

const userRankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze',
  },
  points: {
    type: Number,
    default: 0,
  },
  nextTierPoints: {
    type: Number,
    default: 1000,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

userRankSchema.pre('save', function(next) {
  // Update tier and next tier points based on current points
  if (this.points >= 50000) {
    this.tier = 'diamond';
    this.nextTierPoints = Infinity;
  } else if (this.points >= 15000) {
    this.tier = 'platinum';
    this.nextTierPoints = 50000;
  } else if (this.points >= 5000) {
    this.tier = 'gold';
    this.nextTierPoints = 15000;
  } else if (this.points >= 1000) {
    this.tier = 'silver';
    this.nextTierPoints = 5000;
  } else {
    this.tier = 'bronze';
    this.nextTierPoints = 1000;
  }
  
  this.updatedAt = Date.now();
  next();
});

const UserRank = mongoose.model('UserRank', userRankSchema);

export default UserRank;
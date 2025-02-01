import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  maxProgress: {
    type: Number,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

achievementSchema.pre('save', function(next) {
  this.isCompleted = this.progress >= this.maxProgress;
  this.updatedAt = Date.now();
  next();
});

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['canteen', 'library', 'lab', 'club', 'other'],
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  month: {
    type: Number,
    required: true,
    min: 0,
    max: 11,
  },
  year: {
    type: Number,
    required: true,
  },
});

// Compound index for faster queries
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
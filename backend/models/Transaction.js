import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    default: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ['deposit', 'purchase'],
    required: true,
  },
  category: {
    type: String,
    enum: ['canteen', 'library', 'lab', 'club', 'other'],
    required: function() {
      return this.transactionType === 'purchase';
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  stripePaymentId: {
    type: String,
    sparse: true
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  }
});

// Create compound index for faster queries
transactionSchema.index({ userId: 1, transactionDate: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
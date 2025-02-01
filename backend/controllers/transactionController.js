import Transaction from '../models/Transaction.js';

export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ transactionDate: -1 })
      .limit(50); // Limit to last 50 transactions for performance

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transaction history' });
  }
};
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { createNotification } from './notificationController.js';

export const updateBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;
    const userId = req.user._id;
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const budget = await Budget.findOneAndUpdate(
      { userId, category, month, year },
      { amount },
      { upsert: true, new: true }
    );

    // Check if spending exceeds budget
    const transactions = await Transaction.find({
      userId,
      category,
      transactionType: 'purchase',
      transactionDate: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1)
      }
    });

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    if (totalSpent >= amount * 0.9) {
      await createNotification({
        userId,
        title: 'Budget Alert',
        message: `Your spending in ${category} has reached ${Math.round((totalSpent/amount) * 100)}% of your budget.`,
        type: 'budget'
      });
    }

    res.json(budget);
  } catch (error) {
    console.error('Budget update error:', error);
    res.status(500).json({ message: 'Failed to update budget' });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = parseInt(req.query.month) || new Date().getMonth();
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const budgets = await Budget.find({ userId, month, year });
    
    // Get spending for each category
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const transactions = await Transaction.find({
      userId,
      transactionType: 'purchase',
      transactionDate: { $gte: startDate, $lte: endDate }
    });

    const spending = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    // Convert to response format
    const response = {
      budgets: budgets.reduce((acc, budget) => {
        acc[budget.category] = {
          amount: budget.amount,
          spent: spending[budget.category] || 0
        };
        return acc;
      }, {}),
      month,
      year
    };

    res.json(response);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
};

export const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = parseInt(req.query.month) || new Date().getMonth();
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const [budgets, transactions] = await Promise.all([
      Budget.find({ userId, month, year }),
      Transaction.find({
        userId,
        transactionType: 'purchase',
        transactionDate: { $gte: startDate, $lte: endDate }
      })
    ]);

    const report = {
      totalBudget: budgets.reduce((sum, b) => sum + b.amount, 0),
      totalSpent: transactions.reduce((sum, t) => sum + t.amount, 0),
      categories: {}
    };

    // Calculate category-wise stats
    budgets.forEach(budget => {
      const categoryTransactions = transactions.filter(t => t.category === budget.category);
      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      report.categories[budget.category] = {
        budget: budget.amount,
        spent,
        remaining: budget.amount - spent,
        percentage: (spent / budget.amount) * 100
      };
    });

    res.json(report);
  } catch (error) {
    console.error('Monthly report error:', error);
    res.status(500).json({ message: 'Failed to generate monthly report' });
  }
};

import Budget from '../models/Budget.js';

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

    res.json(budget);
  } catch (error) {
    console.error('Budget update error:', error);
    res.status(500).json({ message: 'Failed to update budget' });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const budgets = await Budget.find({ userId, month, year });
    
    // Convert to object format
    const budgetMap = budgets.reduce((acc, budget) => {
      acc[budget.category] = budget.amount;
      return acc;
    }, {});

    res.json(budgetMap);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
};
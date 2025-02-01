import Achievement from '../models/Achievement.js';
import UserRank from '../models/UserRank.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';

const ACHIEVEMENT_TEMPLATES = {
  FIRST_TRANSACTION: {
    title: 'First Transaction',
    description: 'Complete your first transaction',
    icon: 'credit-card',
    maxProgress: 1
  },
  BIG_SPENDER: {
    title: 'Big Spender',
    description: 'Spend over 10,000 Taka',
    icon: 'wallet',
    maxProgress: 10000
  },
  SAVINGS_MASTER: {
    title: 'Savings Master',
    description: 'Maintain a wallet balance of 50,000 Taka',
    icon: 'star',
    maxProgress: 50000
  },
  EARLY_BIRD: {
    title: 'Early Bird',
    description: 'Complete 10 transactions before 9 AM',
    icon: 'zap',
    maxProgress: 10
  }
};

export const initializeUserAchievements = async (userId) => {
  try {
    // Create initial achievements
    const achievements = await Promise.all(
      Object.values(ACHIEVEMENT_TEMPLATES).map(template =>
        Achievement.create({
          userId,
          ...template,
          progress: 0,
          isCompleted: false
        })
      )
    );

    // Create initial rank
    await UserRank.create({
      userId,
      tier: 'bronze',
      points: 0,
      nextTierPoints: 1000
    });

    // Update achievements with historical data
    await updateAchievements(userId);

    return achievements;
  } catch (error) {
    console.error('Failed to initialize achievements:', error);
    throw error;
  }
};

export const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's achievements and rank
    const [achievements, rank] = await Promise.all([
      Achievement.find({ userId }),
      UserRank.findOne({ userId })
    ]);

    // If no achievements found, initialize them
    if (achievements.length === 0) {
      const newAchievements = await initializeUserAchievements(userId);
      return res.json({
        achievements: newAchievements,
        rank: await UserRank.findOne({ userId })
      });
    }

    // Update achievements with historical data on each fetch
    await updateAchievements(userId);
    
    // Fetch updated achievements and rank
    const [updatedAchievements, updatedRank] = await Promise.all([
      Achievement.find({ userId }),
      UserRank.findOne({ userId })
    ]);

    res.json({ 
      achievements: updatedAchievements, 
      rank: updatedRank 
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
};

export const updateAchievements = async (userId) => {
  try {
    // Fetch all historical data
    const [transactions, wallet] = await Promise.all([
      Transaction.find({ 
        userId,
        status: 'completed' // Only consider completed transactions
      }),
      Wallet.findOne({ userId })
    ]);

    // Update First Transaction achievement
    const firstTransactionAchievement = await Achievement.findOne({
      userId,
      title: ACHIEVEMENT_TEMPLATES.FIRST_TRANSACTION.title
    });
    if (firstTransactionAchievement) {
      firstTransactionAchievement.progress = transactions.length > 0 ? 1 : 0;
      await firstTransactionAchievement.save();
    }

    // Update Big Spender achievement - consider all historical spending
    const totalSpent = transactions
      .filter(t => t.transactionType === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);
    const bigSpenderAchievement = await Achievement.findOne({
      userId,
      title: ACHIEVEMENT_TEMPLATES.BIG_SPENDER.title
    });
    if (bigSpenderAchievement) {
      bigSpenderAchievement.progress = totalSpent;
      await bigSpenderAchievement.save();
    }

    // Update Savings Master achievement - based on current balance
    const savingsMasterAchievement = await Achievement.findOne({
      userId,
      title: ACHIEVEMENT_TEMPLATES.SAVINGS_MASTER.title
    });
    if (savingsMasterAchievement) {
      savingsMasterAchievement.progress = wallet?.balance || 0;
      await savingsMasterAchievement.save();
    }

    // Update Early Bird achievement - count all historical early transactions
    const earlyTransactions = transactions.filter(t => {
      const hour = new Date(t.transactionDate).getHours();
      return hour < 9;
    });
    const earlyBirdAchievement = await Achievement.findOne({
      userId,
      title: ACHIEVEMENT_TEMPLATES.EARLY_BIRD.title
    });
    if (earlyBirdAchievement) {
      earlyBirdAchievement.progress = earlyTransactions.length;
      await earlyBirdAchievement.save();
    }

    // Update user rank points based on completed achievements
    const completedAchievements = await Achievement.find({
      userId,
      isCompleted: true
    });
    
    // Calculate points based on achievements and transaction volume
    let points = completedAchievements.length * 250; // Base points from achievements
    points += Math.floor(totalSpent / 1000) * 10; // Additional points based on spending
    
    const userRank = await UserRank.findOne({ userId });
    if (userRank) {
      userRank.points = points;
      await userRank.save();
    }

  } catch (error) {
    console.error('Update achievements error:', error);
    throw error;
  }
};
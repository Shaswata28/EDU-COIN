import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import Budget from '../models/Budget.js';


export const getAnalytics = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments({ role: 'student' });

    // Get transaction stats
    const transactions = await Transaction.find();
    const totalTransactions = transactions.length;
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTransaction = totalVolume / totalTransactions || 0;

    // Get transaction trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const transactionTrends = await Transaction.aggregate([
      {
        $match: {
          transactionDate: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Get user activity by hour
    const userActivity = await Transaction.aggregate([
      {
        $group: {
          _id: { $hour: "$transactionDate" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          hour: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Get category distribution
    const categoryDistribution = await Transaction.aggregate([
      {
        $match: {
          category: { $exists: true }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1
        }
      }
    ]).then(results => {
      return results.reduce((acc, { category, count }) => {
        acc[category] = count;
        return acc;
      }, {});
    });

    // Get recent activity with user information
    const recentActivity = await Transaction.find()
      .sort({ transactionDate: -1 })
      .limit(5)
      .populate('userId', 'firstName lastName studentId email')
      .lean()
      .then(transactions => transactions.map(t => ({
        description: t.description,
        amount: t.amount,
        type: t.transactionType,
        timestamp: t.transactionDate,
        user: {
          name: `${t.userId.firstName} ${t.userId.lastName}`,
          studentId: t.userId.studentId,
          email: t.userId.email
        }
      })));

    res.json({
      totalUsers,
      totalTransactions,
      totalVolume,
      averageTransaction,
      transactionTrends,
      userActivity,
      categoryDistribution,
      recentActivity
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    // Get all transactions for the user
    const transactions = await Transaction.find({ 
      userId,
      transactionDate: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(parseInt(year) + 1, 0, 1)
      }
    });

    // Get user's budgets
    const budgets = await Budget.find({
      userId,
      month: parseInt(month),
      year: parseInt(year)
    });

    // Create default budgets if none exist
    const defaultBudgets = {
      'canteen': 2000,
      'library': 1000,
      'lab': 1500,
      'club': 1000,
      'other': 1000
    };

    const budgetMap = {};
    budgets.forEach(budget => {
      budgetMap[budget.category] = budget.amount;
    });

    // Use default values for categories without budgets
    Object.entries(defaultBudgets).forEach(([category, amount]) => {
      if (!budgetMap[category]) {
        budgetMap[category] = amount;
      }
    });

    // Calculate monthly spending
    const monthlySpending = Array(12).fill(0);
    transactions.forEach(t => {
      if (t.transactionType === 'purchase') {
        const month = new Date(t.transactionDate).getMonth();
        monthlySpending[month] += t.amount;
      }
    });

    // Calculate category spending
    const categorySpending = {};
    const budgetProgress = {};
    transactions
      .filter(t => t.transactionType === 'purchase')
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    // Calculate budget progress
    Object.keys(budgetMap).forEach(category => {
      const spent = categorySpending[category] || 0;
      budgetProgress[category] = Math.min((spent / budgetMap[category]) * 100, 100);
    });

    // Calculate total spent and budget
    const totalSpent = transactions
      .filter(t => t.transactionType === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalBudget = Object.values(budgetMap).reduce((sum, amount) => sum + amount, 0);

    // Calculate average daily spending
    const daysInYear = new Date(year, 11, 31).getDate();
    const averageDaily = totalSpent / daysInYear;

    // Find most active day
    const dayCount = {};
    transactions.forEach(t => {
      const day = new Date(t.transactionDate).toLocaleDateString('en-US', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    res.json({
      monthlySpending,
      categorySpending: Object.values(categorySpending),
      totalSpent,
      averageDaily,
      mostActiveDay,
      budgets: budgetMap,
      budgetProgress,
      budgetStatus: Math.round((totalSpent / totalBudget) * 100)
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

export const exportTransactionsPDF = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const transactions = await Transaction.find({
      userId,
      transactionDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ transactionDate: -1 });

    // Create PDF document with font configuration
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'Transaction Report',
        Author: 'EDU COIN'
      }
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(24).text('Transaction Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date Range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`);
    doc.moveDown();

    // Add table headers
    const tableTop = 200;
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const columnWidths = [100, 80, 80, 100, 140];
    let currentY = tableTop;

    // Draw table header
    doc.font('Helvetica-Bold');
    headers.forEach((header, i) => {
      let x = 50;
      for (let j = 0; j < i; j++) {
        x += columnWidths[j];
      }
      doc.text(header, x, currentY);
    });

    // Draw transactions
    currentY += 30;
    doc.font('Helvetica');

    transactions.forEach((t, index) => {
      // Add new page if needed
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }

      let x = 50;
      // Date
      doc.text(new Date(t.transactionDate).toLocaleDateString(), x, currentY);
      
      // Type
      x += columnWidths[0];
      doc.text(t.transactionType, x, currentY);
      
      // Category
      x += columnWidths[1];
      doc.text(t.category || '-', x, currentY);
      
      // Amount (using BDT instead of ৳)
      x += columnWidths[2];
      doc.text(`BDT ${t.amount.toFixed(2)}`, x, currentY);
      
      // Description
      x += columnWidths[3];
      doc.text(t.description, x, currentY, {
        width: columnWidths[4],
        align: 'left'
      });

      currentY += 20;
    });

    // Add total at the bottom
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    doc.moveDown();
    doc.font('Helvetica-Bold').text(
      `Total: BDT ${total.toFixed(2)}`,
      50,
      currentY + 20
    );

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Failed to export PDF' });
  }
};

export const exportTransactionsExcel = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const transactions = await Transaction.find({
      userId,
      transactionDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ transactionDate: -1 });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Add headers
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Transaction ID', key: 'id', width: 20 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Description', key: 'description', width: 30 }
    ];

    // Add data
    transactions.forEach(t => {
      worksheet.addRow({
        date: new Date(t.transactionDate).toLocaleDateString(),
        id: t.transactionId,
        type: t.transactionType,
        category: t.category || '-',
        amount: t.amount,
        description: t.description
      });
    });

    // Style headers
    worksheet.getRow(1).font = { bold: true };

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Failed to export Excel' });
  }
};


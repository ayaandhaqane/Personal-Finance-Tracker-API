import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

//  Get admin overview

const getAdminOverview = async (req, res, next) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total transactions count
    const totalTransactions = await Transaction.countDocuments();
    
    // Get total income and expense
    const incomeStats = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    const expenseStats = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    // Get top spending categories
    const topCategories = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { 
          _id: '$category', 
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);
    
    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get monthly transaction trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrends = await Transaction.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTransactions,
          recentUsers,
          totalIncome: incomeStats[0]?.total || 0,
          totalExpense: expenseStats[0]?.total || 0,
          netAmount: (incomeStats[0]?.total || 0) - (expenseStats[0]?.total || 0)
        },
        topCategories,
        monthlyTrends
      }
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAdminOverview
};


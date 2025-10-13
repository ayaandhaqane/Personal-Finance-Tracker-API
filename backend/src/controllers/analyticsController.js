import Transaction from '../models/Transaction.js';

// Get comprehensive analytics for reports page
const getAnalytics = async (req, res, next) => {
  try {
    const { period = '6months' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    }

    // Get all transactions for the user in the period
    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    // Calculate summary statistics
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const currentMonthTransactions = transactions.filter(t => 
      new Date(t.date) >= currentMonth && new Date(t.date) < new Date(now.getFullYear(), now.getMonth() + 1, 1)
    );
    
    const previousMonthTransactions = transactions.filter(t => 
      new Date(t.date) >= previousMonth && new Date(t.date) < currentMonth
    );

    // Calculate current month stats
    const currentIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Calculate previous month stats
    const previousIncome = previousMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousExpenses = previousMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Calculate growth rates
    const incomeGrowth = previousIncome > 0 ? 
      ((currentIncome - previousIncome) / previousIncome * 100) : 0;
    
    const expenseReduction = previousExpenses > 0 ? 
      ((previousExpenses - currentExpenses) / previousExpenses * 100) : 0;

    // Calculate savings rate
    const savingsRate = currentIncome > 0 ? 
      ((currentIncome - currentExpenses) / currentIncome * 100) : 0;

    // Calculate average transaction
    const totalTransactions = currentMonthTransactions.length;
    const averageTransaction = totalTransactions > 0 ? 
      (currentIncome + currentExpenses) / totalTransactions : 0;

    // Monthly breakdown (last 6 months)
    const monthlyBreakdown = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      
      const monthTransactions = transactions.filter(t => 
        new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd
      );
      
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const monthSavings = monthIncome - monthExpenses;
      
      monthlyBreakdown.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        income: monthIncome,
        expenses: monthExpenses,
        savings: monthSavings
      });
    }

    // Category breakdown for current month
    const categoryBreakdown = {};
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category;
        if (!categoryBreakdown[category]) {
          categoryBreakdown[category] = 0;
        }
        categoryBreakdown[category] += Math.abs(transaction.amount);
      });

    // Convert to array and calculate percentages
    const categoryArray = Object.entries(categoryBreakdown).map(([name, amount]) => ({
      name,
      amount,
      percentage: currentExpenses > 0 ? (amount / currentExpenses * 100) : 0
    })).sort((a, b) => b.amount - a.amount);

    res.json({
      success: true,
      data: {
        summary: {
          incomeGrowth: Math.round(incomeGrowth * 10) / 10,
          expenseReduction: Math.round(expenseReduction * 10) / 10,
          savingsRate: Math.round(savingsRate * 10) / 10,
          averageTransaction: Math.round(averageTransaction * 100) / 100
        },
        monthlyBreakdown,
        categoryBreakdown: categoryArray,
        totals: {
          currentIncome,
          currentExpenses,
          currentSavings: currentIncome - currentExpenses
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get monthly summary for a specific month
const getMonthlySummary = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate summary by category
    const summary = {};
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
      const { category, amount, type } = transaction;
      
      if (!summary[category]) {
        summary[category] = { income: 0, expense: 0 };
      }
      
      if (type === 'income') {
        summary[category].income += amount;
        totalIncome += amount;
      } else {
        summary[category].expense += Math.abs(amount);
        totalExpense += Math.abs(amount);
      }
    });

    res.json({
      success: true,
      data: {
        year: parseInt(year),
        month: parseInt(month),
        summary,
        totals: {
          totalIncome,
          totalExpense,
          netAmount: totalIncome - totalExpense
        },
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get category analytics
const getCategoryAnalytics = async (req, res, next) => {
  try {
    const { period = '1month' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: startDate }
    });

    // Group by category and type
    const categoryStats = {};
    
    transactions.forEach(transaction => {
      const { category, amount, type } = transaction;
      
      if (!categoryStats[category]) {
        categoryStats[category] = {
          income: 0,
          expense: 0,
          transactionCount: 0
        };
      }
      
      categoryStats[category][type] += Math.abs(amount);
      categoryStats[category].transactionCount += 1;
    });

    // Convert to array and calculate totals
    const categoryArray = Object.entries(categoryStats).map(([name, stats]) => ({
      name,
      income: stats.income,
      expense: stats.expense,
      net: stats.income - stats.expense,
      transactionCount: stats.transactionCount
    })).sort((a, b) => b.expense - a.expense);

    const totalIncome = categoryArray.reduce((sum, cat) => sum + cat.income, 0);
    const totalExpense = categoryArray.reduce((sum, cat) => sum + cat.expense, 0);

    res.json({
      success: true,
      data: {
        categories: categoryArray,
        totals: {
          totalIncome,
          totalExpense,
          netAmount: totalIncome - totalExpense
        },
        period
      }
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAnalytics,
  getMonthlySummary,
  getCategoryAnalytics
};

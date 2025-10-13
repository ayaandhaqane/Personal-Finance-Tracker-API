import Transaction from '../models/Transaction.js';

// Get all transactions for user

const getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, category, sort = '-date' } = req.query;
    
    // Build filter object
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = new RegExp(category, 'i');

    const transactions = await Transaction.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');

    const total = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      count: transactions.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// Get single transaction

const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('user', 'name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if transaction belongs to user
    if (transaction.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this transaction'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Create new transaction

const createTransaction = async (req, res, next) => {
  try {
    const transactionData = {
      ...req.body,
      user: req.user._id
    };

    // Convert date string to Date object if provided
    if (req.body.date) {
      transactionData.date = new Date(req.body.date);
    }

    const transaction = await Transaction.create(transactionData);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Update transaction

const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if transaction belongs to user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this transaction'
      });
    }

    // Convert date string to Date object if provided
    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Delete transaction

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if transaction belongs to user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction'
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get transaction statistics for dashboard

const getStats = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Get current month transactions
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const monthlyTransactions = await Transaction.find({
      user: req.user._id,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Get all transactions for total balance calculation
    const allTransactions = await Transaction.find({
      user: req.user._id
    });

    // Calculate stats
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    let totalBalance = 0;

    monthlyTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        monthlyIncome += transaction.amount;
      } else {
        monthlyExpenses += transaction.amount;
      }
    });

    allTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalBalance += transaction.amount;
      } else {
        totalBalance -= transaction.amount;
      }
    });

    // Get category breakdown for current month
    const categoryBreakdown = {};
    monthlyTransactions.forEach(transaction => {
      const category = transaction.category;
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = 0;
      }
      if (transaction.type === 'expense') {
        categoryBreakdown[category] += transaction.amount;
      }
    });

    res.json({
      success: true,
      data: {
        monthlyIncome,
        monthlyExpenses,
        monthlyNet: monthlyIncome - monthlyExpenses,
        totalBalance,
        transactionCount: monthlyTransactions.length,
        categoryBreakdown,
        period: {
          month: currentMonth + 1,
          year: currentYear
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get monthly summary

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
      date: {
        $gte: startDate,
        $lte: endDate
      }
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
        summary[category].expense += amount;
        totalExpense += amount;
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

export {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
  getMonthlySummary
};


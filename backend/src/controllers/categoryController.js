import Transaction from '../models/Transaction.js';

// Get all categories for a user
const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    
    // Get all transactions for the user
    const transactions = await Transaction.find({ user: req.user._id });
    
    // Extract unique categories
    const categoryMap = {};
    
    transactions.forEach(transaction => {
      const { category, type: transactionType } = transaction;
      
      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          type: transactionType,
          transactionCount: 0,
          totalAmount: 0
        };
      }
      
      categoryMap[category].transactionCount += 1;
      categoryMap[category].totalAmount += Math.abs(transaction.amount);
    });
    
    // Convert to array
    let categories = Object.values(categoryMap);
    
    // Filter by type if specified
    if (type && (type === 'income' || type === 'expense')) {
      categories = categories.filter(cat => cat.type === type);
    }
    
    // Sort by transaction count
    categories.sort((a, b) => b.transactionCount - a.transactionCount);
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Get category details with transactions
const getCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    
    // Get all transactions for this category
    const transactions = await Transaction.find({
      user: req.user._id,
      category: categoryName
    }).sort({ date: -1 });
    
    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Calculate category statistics
    const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    // Get date range
    const dates = transactions.map(t => new Date(t.date));
    const oldestDate = new Date(Math.min(...dates));
    const newestDate = new Date(Math.max(...dates));
    
    res.json({
      success: true,
      data: {
        category: categoryName,
        type: transactions[0].type,
        statistics: {
          totalTransactions: transactions.length,
          totalAmount,
          totalIncome,
          totalExpense,
          averageAmount: totalAmount / transactions.length
        },
        dateRange: {
          oldest: oldestDate,
          newest: newestDate
        },
        transactions: transactions.slice(0, 10) // Return last 10 transactions
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new category (by creating a transaction with that category)
const createCategory = async (req, res, next) => {
  try {
    const { name, type, description } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Category name and type are required'
      });
    }
    
    // Check if category already exists
    const existingTransaction = await Transaction.findOne({
      user: req.user._id,
      category: name
    });
    
    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }
    
    // Create a sample transaction to establish the category
    const sampleTransaction = await Transaction.create({
      title: `Sample ${type} for ${name}`,
      description: description || `Initial ${type} transaction for ${name} category`,
      amount: 0.01, // Very small amount
      type,
      category: name,
      date: new Date(),
      user: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        name,
        type,
        transactionCount: 1,
        totalAmount: 0.01
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update category (rename it across all transactions)
const updateCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    const { newName } = req.body;
    
    if (!newName) {
      return res.status(400).json({
        success: false,
        message: 'New category name is required'
      });
    }
    
    // Check if new category name already exists
    const existingCategory = await Transaction.findOne({
      user: req.user._id,
      category: newName
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    
    // Update all transactions with the old category name
    const result = await Transaction.updateMany(
      { user: req.user._id, category: categoryName },
      { category: newName }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        oldName: categoryName,
        newName,
        updatedTransactions: result.modifiedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete category (delete all transactions in this category)
const deleteCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    
    // Get count of transactions in this category
    const transactionCount = await Transaction.countDocuments({
      user: req.user._id,
      category: categoryName
    });
    
    if (transactionCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Delete all transactions in this category
    const result = await Transaction.deleteMany({
      user: req.user._id,
      category: categoryName
    });
    
    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: {
        category: categoryName,
        deletedTransactions: result.deletedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
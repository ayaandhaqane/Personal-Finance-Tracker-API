// @desc    Get predefined categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = {
      income: [
        'Salary',
        'Freelance',
        'Investment',
        'Business',
        'Rental Income',
        'Bonus',
        'Gift',
        'Other Income'
      ],
      expense: [
        'Food & Dining',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Bills & Utilities',
        'Healthcare',
        'Education',
        'Travel',
        'Insurance',
        'Savings',
        'Charity',
        'Other Expense'
      ]
    };

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

export {
  getCategories
};


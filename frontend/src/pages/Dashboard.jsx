import { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext';
import QuickTransactionForm from '../components/QuickTransactionForm';

const mockRecentTransactions = [
  {
    id: 1,
    description: 'Grocery Shopping',
    amount: -125.50,
    category: 'Food & Dining',
    date: '2024-01-15',
    type: 'expense'
  },
  {
    id: 2,
    description: 'Salary',
    amount: 3500.00,
    category: 'Income',
    date: '2024-01-14',
    type: 'income'
  },
  {
    id: 3,
    description: 'Gas Station',
    amount: -45.20,
    category: 'Transportation',
    date: '2024-01-13',
    type: 'expense'
  },
  {
    id: 4,
    description: 'Freelance Work',
    amount: 850.00,
    category: 'Income',
    date: '2024-01-12',
    type: 'income'
  },
];

const mockCategories = [
  { name: 'Food & Dining', amount: 850.50, percentage: 26.6, color: 'bg-blue-500' },
  { name: 'Transportation', amount: 420.25, percentage: 13.1, color: 'bg-green-500' },
  { name: 'Entertainment', amount: 320.00, percentage: 10.0, color: 'bg-purple-500' },
  { name: 'Shopping', amount: 280.75, percentage: 8.8, color: 'bg-yellow-500' },
  { name: 'Bills & Utilities', amount: 450.00, percentage: 14.1, color: 'bg-red-500' },
  { name: 'Others', amount: 879.25, percentage: 27.4, color: 'bg-gray-500' },
];

function StatCard({ title, value, change, changeType, icon: Icon, color = 'bg-blue-500' }) {
  const isPositive = changeType === 'positive';
  const ChangeIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">${value.toLocaleString()}</p>
            {change !== undefined && (
              <div className={`flex items-center mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <ChangeIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{Math.abs(change)}%</span>
                <span className="text-xs ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionItem({ transaction }) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  const amountPrefix = isIncome ? '+' : '';
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isIncome ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isIncome ? (
            <ArrowUpIcon className="w-5 h-5 text-green-600" />
          ) : (
            <ArrowDownIcon className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
          <p className="text-xs text-gray-500">{transaction.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${amountColor}`}>
          {amountPrefix}${Math.abs(transaction.amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

function CategoryChart({ categories }) {
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  if (safeCategories.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No categories found</p>
        <p className="text-sm">Create categories to see spending breakdown</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {safeCategories.map((category, index) => (
        <div key={category._id || index} className="flex items-center">
          <div className="flex items-center flex-1">
            <div 
              className="w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: category.color || '#6B7280' }}
            ></div>
            <span className="text-sm text-gray-600 flex-1">{category.name}</span>
            <span className="text-sm font-medium text-gray-900">
              ${(category.amount || 0).toFixed(2)}
            </span>
          </div>
          <div className="ml-4 w-20 bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{ 
                width: `${category.percentage || 0}%`,
                backgroundColor: category.color || '#6B7280'
              }}
            ></div>
          </div>
          <span className="ml-2 text-xs text-gray-500 w-12 text-right">
            {category.percentage || 0}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyNet: 0,
    transactionCount: 0,
    categoryBreakdown: {}
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [quickFormType, setQuickFormType] = useState('transaction');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats and recent transactions in parallel
        const [statsResult, transactionsResult, categoriesResult] = await Promise.all([
          apiService.transactions.getStats(),
          apiService.transactions.getAll(),
          apiService.categories.getAll()
        ]);

        if (statsResult.success) {
          setStats(statsResult.data);
        }

        if (transactionsResult.success) {
          // Get only the 5 most recent transactions
          setRecentTransactions(transactionsResult.data.slice(0, 5));
        }

        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleQuickAction = (type) => {
    setQuickFormType(type);
    setShowQuickForm(true);
  };

  const handleFormSuccess = () => {
    // Refresh dashboard data after successful transaction
    const fetchDashboardData = async () => {
      try {
        const [statsResult, transactionsResult, categoriesResult] = await Promise.all([
          apiService.transactions.getStats(),
          apiService.transactions.getAll(),
          apiService.categories.getAll()
        ]);

        if (statsResult.success) { setStats(statsResult.data); }
        if (transactionsResult.success) { setRecentTransactions(transactionsResult.data.slice(0, 5)); }
        if (categoriesResult.success) { setCategories(categoriesResult.data); }
      } catch (error) {
        console.error('Error refreshing dashboard data:', error);
      }
    };

    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your personal finances
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={stats.totalBalance}
          icon={BanknotesIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Monthly Income"
          value={stats.monthlyIncome}
          icon={ArrowUpIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Monthly Expenses"
          value={stats.monthlyExpenses}
          icon={ArrowDownIcon}
          color="bg-red-500"
        />
        <StatCard
          title="Net This Month"
          value={stats.monthlyNet}
          icon={CurrencyDollarIcon}
          color={stats.monthlyNet >= 0 ? "bg-purple-500" : "bg-red-500"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="px-6">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <TransactionItem key={transaction._id || transaction.id} transaction={transaction} />
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Start by adding your first transaction</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expense Categories */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
            <div className="card-body">
              <CategoryChart categories={categories} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => handleQuickAction('transaction')}
              className="btn btn-primary flex items-center justify-center"
            >
              <CreditCardIcon className="w-5 h-5 mr-2" />
              Add Transaction
            </button>
            <button 
              onClick={() => handleQuickAction('income')}
              className="btn btn-secondary flex items-center justify-center"
            >
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Add Income
            </button>
            <button 
              onClick={() => handleQuickAction('expense')}
              className="btn btn-secondary flex items-center justify-center"
            >
              <ArrowDownIcon className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Quick Transaction Form Modal */}
      <QuickTransactionForm
        isOpen={showQuickForm}
        onClose={() => setShowQuickForm(false)}
        type={quickFormType}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
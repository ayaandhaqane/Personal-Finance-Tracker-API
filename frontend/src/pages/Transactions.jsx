import { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext';

// Mock data - replace with actual API calls
const mockTransactions = [
  {
    id: 1,
    description: 'Grocery Shopping',
    amount: -125.50,
    category: 'Food & Dining',
    date: '2024-01-15',
    type: 'expense',
    tags: ['groceries', 'food']
  },
  {
    id: 2,
    description: 'Salary',
    amount: 3500.00,
    category: 'Income',
    date: '2024-01-14',
    type: 'income',
    tags: ['salary']
  },
  {
    id: 3,
    description: 'Gas Station',
    amount: -45.20,
    category: 'Transportation',
    date: '2024-01-13',
    type: 'expense',
    tags: ['gas', 'transportation']
  },
  {
    id: 4,
    description: 'Freelance Work',
    amount: 850.00,
    category: 'Income',
    date: '2024-01-12',
    type: 'income',
    tags: ['freelance']
  },
  {
    id: 5,
    description: 'Netflix Subscription',
    amount: -15.99,
    category: 'Entertainment',
    date: '2024-01-10',
    type: 'expense',
    tags: ['subscription', 'entertainment']
  },
  {
    id: 6,
    description: 'Coffee Shop',
    amount: -8.50,
    category: 'Food & Dining',
    date: '2024-01-09',
    type: 'expense',
    tags: ['coffee', 'food']
  },
];

const mockCategories = [
  'All Categories',
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Income',
  'Others'
];

const mockTypes = [
  'All Types',
  'Income',
  'Expense'
];

function TransactionModal({ isOpen, onClose, transaction = null, onSave }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    tags: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
        tags: transaction.tags.join(', ')
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        tags: ''
      });
    }
  }, [transaction, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate amount based on transaction type
    const amount = parseFloat(formData.amount);
    
    // Prepare transaction data to match backend schema
    const transactionData = {
      title: formData.description, // Backend expects 'title', not 'description'
      amount: amount,
      category: formData.category,
      type: formData.type,
      description: formData.description, // Keep description as well
      date: new Date(formData.date).toISOString() // Convert to ISO string format
    };
    
    onSave(transactionData);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {transaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-4">
              
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter transaction description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter category"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {transaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TransactionRow({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  const amountPrefix = isIncome ? '+' : '';
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isIncome ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isIncome ? (
              <ArrowUpIcon className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {transaction.description}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="badge badge-info">{transaction.category}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {transaction.tags && Array.isArray(transaction.tags) ? transaction.tags.map((tag, index) => (
            <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1">
              {tag}
            </span>
          )) : (
            <span className="text-gray-400 text-xs">No tags</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className={`text-sm font-medium ${amountColor}`}>
          {amountPrefix}${Math.abs(transaction.amount).toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(transaction)}
            className="text-primary-color hover:text-primary-dark"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="text-red-600 hover:text-red-800"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const result = await apiService.transactions.getAll();
        
        if (result.success) {
          setTransactions(result.data);
        } else {
          console.error('Failed to fetch transactions:', result.message);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.category && transaction.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.tags && Array.isArray(transaction.tags) && transaction.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(transaction => transaction.category && transaction.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'All Types') {
      filtered = filtered.filter(transaction => transaction.type && transaction.type === selectedType);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedCategory, selectedType]);

  const handleSaveTransaction = async (transactionData) => {
    try {
      let result;
      
      if (editingTransaction) {
        result = await apiService.transactions.update(editingTransaction._id || editingTransaction.id, transactionData);
      } else {
        result = await apiService.transactions.create(transactionData);
      }

      if (result.success) {
        // Refresh transactions list
        const fetchResult = await apiService.transactions.getAll();
        if (fetchResult.success) {
          setTransactions(fetchResult.data);
        }
        setEditingTransaction(null);
      } else {
        console.error('Failed to save transaction:', result.message);
        alert('Failed to save transaction: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Error saving transaction. Please try again.');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const result = await apiService.transactions.delete(id);
        
        if (result.success) {
          // Refresh transactions list
          const fetchResult = await apiService.transactions.getAll();
          if (fetchResult.success) {
            setTransactions(fetchResult.data);
          }
        } else {
          console.error('Failed to delete transaction:', result.message);
          alert('Failed to delete transaction: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Error deleting transaction. Please try again.');
      }
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;

  return (
    <div className="px-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">
            Manage your income and expenses
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  +${totalIncome.toFixed(2)}
                </p>
              </div>
              <ArrowUpIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  -${totalExpenses.toFixed(2)}
                </p>
              </div>
              <ArrowDownIcon className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Amount</p>
                <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netAmount >= 0 ? '+' : ''}${netAmount.toFixed(2)}
                </p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-group">
              <label className="form-label">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Search transactions..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                {mockCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="form-select"
              >
                {mockTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">&nbsp;</label>
              <button className="btn btn-secondary w-full flex items-center justify-center">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions && Array.isArray(filteredTransactions) ? filteredTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction._id || transaction.id}
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No transactions to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory !== 'All Categories' || selectedType !== 'All Types'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by adding your first transaction.'
              }
            </p>
            {!searchTerm && selectedCategory === 'All Categories' && selectedType === 'All Types' && (
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Transaction
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext';

// Mock data - replace with actual API calls
const mockCategories = [
  { id: 1, name: 'Food & Dining', type: 'expense', color: '#3B82F6', icon: '🍽️' },
  { id: 2, name: 'Transportation', type: 'expense', color: '#10B981', icon: '🚗' },
  { id: 3, name: 'Entertainment', type: 'expense', color: '#8B5CF6', icon: '🎬' },
  { id: 4, name: 'Shopping', type: 'expense', color: '#F59E0B', icon: '🛍️' },
  { id: 5, name: 'Bills & Utilities', type: 'expense', color: '#EF4444', icon: '💡' },
  { id: 6, name: 'Income', type: 'income', color: '#10B981', icon: '💰' },
  { id: 7, name: 'Freelance', type: 'income', color: '#06B6D4', icon: '💼' },
  { id: 8, name: 'Investment', type: 'income', color: '#84CC16', icon: '📈' },
];

function CategoryModal({ isOpen, onClose, category = null, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#3B82F6',
    icon: '📁'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const predefinedColors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'
  ];

  const predefinedIcons = [
    '🍽️', '🚗', '🎬', '🛍️', '💡', '💰', '💼', '📈', '🏠', '🏥', '🎓', '✈️', '🍕', '☕', '📱', '💻'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {category ? 'Edit Category' : 'Add New Category'}
              </h3>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <div className="grid grid-cols-8 gap-2">
                    {predefinedIcons.map((icon, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-2 text-xl rounded-lg border-2 ${
                          formData.icon === icon ? 'border-primary-color' : 'border-gray-200'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {predefinedColors.map((color, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? 'border-gray-400' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-12 h-8 rounded border border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="btn btn-primary sm:ml-3"
              >
                {category ? 'Update Category' : 'Add Category'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiService.categories.getAll();
        
        if (result.success) {
          // Add mock icons and colors to the categories
          const categoriesWithIcons = result.data.map((cat, index) => ({
            ...cat,
            id: cat.name, // Use name as ID since backend doesn't have IDs
            color: `hsl(${index * 60}, 70%, 50%)`,
            icon: ['🍽️', '🚗', '🎬', '🛍️', '💡', '💰', '💼', '📈'][index % 8]
          }));
          setCategories(categoriesWithIcons);
        } else {
          setError(result.message || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error loading categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  const handleSaveCategory = async (categoryData) => {
    try {
      let result;
      
      if (editingCategory) {
        // Update existing category
        result = await apiService.categories.update(editingCategory.id, {
          name: categoryData.name,
          type: categoryData.type
        });
        
        if (result.success) {
          setCategories(prev => prev.map(c => 
            c.id === editingCategory.id 
              ? { ...c, ...categoryData }
              : c
          ));
        } else {
          setError(result.message || 'Failed to update category');
          return;
        }
      } else {
        // Create new category
        result = await apiService.categories.create({
          name: categoryData.name,
          type: categoryData.type,
          description: `Category for ${categoryData.type} transactions`
        });
        
        if (result.success) {
          const newCategory = {
            ...categoryData,
            id: categoryData.name,
            transactionCount: 1,
            totalAmount: 0.01
          };
          setCategories(prev => [...prev, newCategory]);
        } else {
          setError(result.message || 'Failed to create category');
          return;
        }
      }
      
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Error saving category');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all transactions in this category.')) {
      try {
        const result = await apiService.categories.delete(id);
        
        if (result.success) {
          setCategories(prev => prev.filter(c => c.id !== id));
        } else {
          setError(result.message || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('Error deleting category');
      }
    }
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <div className="px-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">
            Organize your transactions with custom categories
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading categories...</span>
        </div>
      )}

      {/* Categories Content */}
      {!loading && !error && (
        <>
          {/* Expense Categories */}
          <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
          <p className="text-sm text-gray-500 mt-1">
            Categories for tracking your spending
          </p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                    <p className="text-xs text-gray-500">Expense</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-1 text-gray-400 hover:text-primary-color"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income Categories */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Income Categories</h3>
          <p className="text-sm text-gray-500 mt-1">
            Categories for tracking your income sources
          </p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                    <p className="text-xs text-gray-500">Income</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-1 text-gray-400 hover:text-primary-color"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}

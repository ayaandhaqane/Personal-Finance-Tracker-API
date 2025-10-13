import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext';

function SimpleBarChart({ data, title }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expenses)));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="card-body">
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.month}</span>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Income: ${item.income}</span>
                  <span>Expenses: ${item.expenses}</span>
                  <span>Savings: ${item.savings}</span>
                </div>
              </div>
              <div className="flex items-end space-x-1 h-8">
                {/* Income Bar */}
                <div
                  className="bg-green-500 rounded-t"
                  style={{ width: `${(item.income / maxValue) * 100}%`, height: '100%' }}
                  title={`Income: $${item.income}`}
                />
                {/* Expense Bar */}
                <div
                  className="bg-red-500 rounded-t"
                  style={{ width: `${(item.expenses / maxValue) * 100}%`, height: '100%' }}
                  title={`Expenses: $${item.expenses}`}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryPieChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
        <p className="text-sm text-gray-500 mt-1">Current month breakdown</p>
      </div>
      <div className="card-body">
        <div className="space-y-3">
          {data.length > 0 ? data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center flex-1">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                ></div>
                <span className="text-sm text-gray-600 flex-1">{item.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  ${item.amount.toFixed(2)}
                </span>
              </div>
              <div className="ml-4 w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                  }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500 w-12 text-right">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              No expense data available for this period
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Expenses</span>
            <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendCard({ trend }) {
  const Icon = trend.icon;
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{trend.title}</p>
            <p className="text-2xl font-bold text-gray-900">{trend.value}</p>
            <p className="text-xs text-gray-500">{trend.description}</p>
          </div>
          <div className={`p-3 rounded-lg ${
            trend.change === 'positive' ? 'bg-green-100' : 
            trend.change === 'negative' ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              trend.change === 'positive' ? 'text-green-600' : 
              trend.change === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiService.analytics.getAnalytics(selectedPeriod);
        
        if (result.success) {
          setAnalytics(result.data);
        } else {
          setError(result.message || 'Failed to fetch analytics data');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Error loading analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, selectedPeriod]);

  const periods = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
  ];

  const reportTypes = [
    { value: 'overview', label: 'Overview' },
    { value: 'categories', label: 'Categories' },
    { value: 'trends', label: 'Trends' },
    { value: 'budget', label: 'Budget' },
  ];

  return (
    <div className="px-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">
            Analyze your financial patterns and trends
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="form-select"
          >
            {reportTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-select"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Analytics Content */}
      {!loading && !error && analytics && (
        <>
          {/* Trend Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TrendCard 
              trend={{
                title: 'Income Growth',
                value: `+${analytics.summary.incomeGrowth}%`,
                change: 'positive',
                description: 'Compared to last month',
                icon: ArrowUpIcon,
              }} 
            />
            <TrendCard 
              trend={{
                title: 'Expense Reduction',
                value: `-${analytics.summary.expenseReduction}%`,
                change: 'positive',
                description: 'Compared to last month',
                icon: ArrowDownIcon,
              }} 
            />
            <TrendCard 
              trend={{
                title: 'Savings Rate',
                value: `${analytics.summary.savingsRate}%`,
                change: 'positive',
                description: 'Of total income',
                icon: CurrencyDollarIcon,
              }} 
            />
            <TrendCard 
              trend={{
                title: 'Average Transaction',
                value: `$${analytics.summary.averageTransaction}`,
                change: 'neutral',
                description: 'Per transaction',
                icon: ChartBarIcon,
              }} 
            />
          </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend Chart */}
        <SimpleBarChart 
          data={analytics.monthlyBreakdown} 
          title="Monthly Income vs Expenses" 
        />
        
        {/* Category Breakdown */}
        <CategoryPieChart data={analytics.categoryBreakdown} />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Expenses */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Top Expense Categories</h3>
            <p className="text-sm text-gray-500 mt-1">Highest spending areas</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {analytics.categoryBreakdown && analytics.categoryBreakdown.length > 0 ? (
                analytics.categoryBreakdown.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        ${category.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No expense data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Financial Health Score</h3>
            <p className="text-sm text-gray-500 mt-1">Based on your spending patterns</p>
          </div>
          <div className="card-body">
            {(() => {
              // Calculate financial health score
              const savingsRate = analytics.summary.savingsRate;
              const expenseReduction = analytics.summary.expenseReduction;
              
              // Score components (out of 100)
              const savingsScore = Math.min((savingsRate / 30) * 40, 40); // 40 points max (30% savings = excellent)
              const expenseControlScore = Math.min(Math.max(expenseReduction, -20) + 20, 30); // 30 points max
              const consistencyScore = 30; // Base score for having transactions
              
              const totalScore = Math.round(savingsScore + expenseControlScore + consistencyScore);
              
              // Determine rating and color
              let rating, ratingColor, circleColor, description;
              if (totalScore >= 80) {
                rating = 'Excellent';
                ratingColor = 'text-green-600';
                circleColor = 'text-green-500';
                description = 'Your financial habits are outstanding!';
              } else if (totalScore >= 60) {
                rating = 'Good';
                ratingColor = 'text-blue-600';
                circleColor = 'text-blue-500';
                description = 'Your financial habits are on track with room for improvement.';
              } else if (totalScore >= 40) {
                rating = 'Fair';
                ratingColor = 'text-yellow-600';
                circleColor = 'text-yellow-500';
                description = 'Consider improving your saving and spending habits.';
              } else {
                rating = 'Needs Improvement';
                ratingColor = 'text-red-600';
                circleColor = 'text-red-500';
                description = 'Focus on building better financial habits.';
              }
              
              // Rating helpers
              const getSavingsRating = (rate) => {
                if (rate >= 20) return { text: 'Excellent', color: 'text-green-600' };
                if (rate >= 10) return { text: 'Good', color: 'text-blue-600' };
                if (rate >= 5) return { text: 'Fair', color: 'text-yellow-600' };
                return { text: 'Poor', color: 'text-red-600' };
              };
              
              const getExpenseRating = (reduction) => {
                if (reduction >= 10) return { text: 'Excellent', color: 'text-green-600' };
                if (reduction >= 0) return { text: 'Good', color: 'text-blue-600' };
                if (reduction >= -10) return { text: 'Fair', color: 'text-yellow-600' };
                return { text: 'Poor', color: 'text-red-600' };
              };
              
              const savingsRating = getSavingsRating(savingsRate);
              const expenseRating = getExpenseRating(expenseReduction);
              
              return (
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - totalScore / 100)}`}
                        className={circleColor}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{totalScore}</span>
                    </div>
                  </div>
                  <h4 className={`text-lg font-semibold ${ratingColor} mb-2`}>{rating}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {description}
                  </p>
                  
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Savings Rate ({savingsRate.toFixed(1)}%)</span>
                      <span className={`font-medium ${savingsRating.color}`}>{savingsRating.text}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Expense Control</span>
                      <span className={`font-medium ${expenseRating.color}`}>{expenseRating.text}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Income Growth</span>
                      <span className={`font-medium ${analytics.summary.incomeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analytics.summary.incomeGrowth >= 0 ? 'Positive' : 'Negative'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Financial Recommendations</h3>
          <p className="text-sm text-gray-500 mt-1">Based on your spending patterns</p>
        </div>
        <div className="card-body">
          {(() => {
            const recommendations = [];
            const savingsRate = analytics.summary.savingsRate;
            const topCategory = analytics.categoryBreakdown && analytics.categoryBreakdown.length > 0 
              ? analytics.categoryBreakdown[0] 
              : null;
            
            // Savings recommendation
            if (savingsRate < 10) {
              recommendations.push({
                title: 'Increase Emergency Fund',
                description: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider building a 3-6 month emergency fund based on your current expenses.`,
                color: 'blue'
              });
            } else if (savingsRate >= 20) {
              recommendations.push({
                title: 'Investment Opportunity',
                description: `With your strong savings rate of ${savingsRate.toFixed(1)}%, consider starting or growing an investment portfolio.`,
                color: 'purple'
              });
            } else {
              recommendations.push({
                title: 'Good Savings Habits',
                description: `Your savings rate of ${savingsRate.toFixed(1)}% is healthy. Keep up the good work and consider increasing it to 20%+.`,
                color: 'green'
              });
            }
            
            // Top spending category recommendation
            if (topCategory && topCategory.percentage > 25) {
              recommendations.push({
                title: `Optimize ${topCategory.name} Spending`,
                description: `Your ${topCategory.name} expenses are ${topCategory.percentage.toFixed(1)}% of total spending ($${topCategory.amount.toFixed(2)}). Consider ways to reduce costs in this area.`,
                color: 'orange'
              });
            }
            
            // Income growth recommendation
            if (analytics.summary.incomeGrowth < 0) {
              recommendations.push({
                title: 'Income Opportunity',
                description: 'Your income has decreased. Consider exploring side income opportunities or discussing a raise with your employer.',
                color: 'red'
              });
            } else if (analytics.summary.incomeGrowth > 10) {
              recommendations.push({
                title: 'Excellent Income Growth',
                description: `Your income grew by ${analytics.summary.incomeGrowth.toFixed(1)}%! Consider allocating the extra income to savings or investments.`,
                color: 'green'
              });
            }
            
            // Expense control recommendation
            if (analytics.summary.expenseReduction < -10) {
              recommendations.push({
                title: 'Control Rising Expenses',
                description: 'Your expenses have increased significantly. Review your spending and identify areas where you can cut back.',
                color: 'red'
              });
            }
            
            // Ensure we have at least 3 recommendations
            if (recommendations.length < 3) {
              recommendations.push({
                title: 'Track Your Progress',
                description: 'Keep monitoring your financial health regularly and adjust your habits as needed to reach your goals.',
                color: 'blue'
              });
            }
            
            const colorMap = {
              blue: { bg: 'bg-blue-50', title: 'text-blue-900', text: 'text-blue-700' },
              green: { bg: 'bg-green-50', title: 'text-green-900', text: 'text-green-700' },
              purple: { bg: 'bg-purple-50', title: 'text-purple-900', text: 'text-purple-700' },
              orange: { bg: 'bg-orange-50', title: 'text-orange-900', text: 'text-orange-700' },
              red: { bg: 'bg-red-50', title: 'text-red-900', text: 'text-red-700' }
            };
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.slice(0, 3).map((rec, index) => {
                  const colors = colorMap[rec.color];
                  return (
                    <div key={index} className={`p-4 ${colors.bg} rounded-lg`}>
                      <h4 className={`font-medium ${colors.title} mb-2`}>{rec.title}</h4>
                      <p className={`text-sm ${colors.text}`}>
                        {rec.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import IncomeExpenseForm from './IncomeExpenseForm';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('savingsGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    category: 'custom',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [editingId, setEditingId] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [showBudgets, setShowBudgets] = useState(false);
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : {};
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: Date.now() };
    setTransactions([...transactions, newTransaction]);
    
    // Update linked savings goal with the exact transaction amount
    if (transaction.linkedGoalId && transaction.linkedGoalId !== '') {
      updateGoalAmount(transaction.linkedGoalId, Number(transaction.amount));
    }
  };

  const deleteTransaction = (id) => {
    const toDelete = transactions.find(t => t.id === id);
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      // If transaction was linked to a goal, subtract the amount
      if (toDelete.linkedGoalId && toDelete.linkedGoalId !== '') {
        updateGoalAmount(toDelete.linkedGoalId, -Number(toDelete.amount));
      }
      
      setLastDeleted(toDelete);
      setTransactions(transactions.filter(t => t.id !== id));
      setTimeout(() => setLastDeleted(null), 5000);
    }
  };

  const undoDelete = () => {
    if (lastDeleted) {
      setTransactions([...transactions, lastDeleted]);
      // Re-add amount to goal if it was linked
      if (lastDeleted.linkedGoalId && lastDeleted.linkedGoalId !== '') {
        updateGoalAmount(lastDeleted.linkedGoalId, Number(lastDeleted.amount));
      }
      setLastDeleted(null);
    }
  };

  const updateTransaction = (id, updatedData) => {
    const oldTransaction = transactions.find(t => t.id === id);
    const updatedTransaction = { ...oldTransaction, ...updatedData };
    
    setTransactions(transactions.map(t => 
      t.id === id ? updatedTransaction : t
    ));
    
    // Handle goal updates when transaction changes
    if (oldTransaction.linkedGoalId !== updatedTransaction.linkedGoalId ||
        oldTransaction.amount !== updatedTransaction.amount) {
      
      // Remove from old goal
      if (oldTransaction.linkedGoalId && oldTransaction.linkedGoalId !== '') {
        updateGoalAmount(oldTransaction.linkedGoalId, -Number(oldTransaction.amount));
      }
      
      // Add to new goal
      if (updatedTransaction.linkedGoalId && updatedTransaction.linkedGoalId !== '') {
        updateGoalAmount(updatedTransaction.linkedGoalId, Number(updatedTransaction.amount));
      }
    }
    
    setEditingId(null);
  };

  // Helper function to update goal amount
  const updateGoalAmount = (goalId, amount) => {
    setSavingsGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.id === Number(goalId)) {
          const newAmount = Math.max(0, Math.min(
            goal.currentAmount + amount,
            goal.targetAmount
          ));
          return { ...goal, currentAmount: newAmount };
        }
        return goal;
      })
    );
  };

  // Goal Templates
  const goalTemplates = [
    { name: 'Buy a New Car', amount: 25000, category: 'vehicle', icon: '🚗', description: 'Save for your dream car' },
    { name: 'Buy a House', amount: 200000, category: 'property', icon: '🏠', description: 'Down payment for a home' },
    { name: 'Vacation Trip', amount: 5000, category: 'travel', icon: '✈️', description: 'Plan your dream vacation' },
    { name: 'Emergency Fund', amount: 10000, category: 'emergency', icon: '🏦', description: '3-6 months of expenses' },
    { name: 'Wedding', amount: 30000, category: 'event', icon: '💒', description: 'Save for your special day' },
    { name: 'Education', amount: 15000, category: 'education', icon: '🎓', description: 'Invest in learning' },
    { name: 'Start a Business', amount: 50000, category: 'business', icon: '💼', description: 'Launch your startup' },
    { name: 'Home Renovation', amount: 20000, category: 'property', icon: '🔨', description: 'Upgrade your home' }
  ];

  const applyGoalTemplate = (template) => {
    setNewGoal({
      name: template.name,
      targetAmount: template.amount,
      currentAmount: 0,
      deadline: '',
      category: template.category,
      description: template.description,
      icon: template.icon
    });
  };

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount) {
      const goal = {
        ...newGoal,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        targetAmount: Number(newGoal.targetAmount),
        currentAmount: Number(newGoal.currentAmount || 0),
        icon: newGoal.icon || '🎯'
      };
      setSavingsGoals([...savingsGoals, goal]);
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: 0,
        deadline: '',
        category: 'custom',
        description: ''
      });
      setShowGoalForm(false);
    }
  };

  const deleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setSavingsGoals(savingsGoals.filter(g => g.id !== id));
    }
  };

  const updateGoalProgress = (id, amount) => {
    setSavingsGoals(savingsGoals.map(g => 
      g.id === id ? { ...g, currentAmount: Number(amount) } : g
    ));
  };

  const exportData = (format) => {
    const dataStr = format === 'json' 
      ? JSON.stringify(transactions, null, 2)
      : convertToCSV(transactions);
    
    const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = data.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.description,
      t.amount
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const filterByDate = (transaction) => {
    const transDate = new Date(transaction.date);
    const now = new Date();
    
    switch(dateFilter) {
      case 'today':
        return transDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transDate >= weekAgo;
      case 'month':
        return transDate.getMonth() === now.getMonth() && 
               transDate.getFullYear() === now.getFullYear();
      case 'year':
        return transDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const getFilteredTransactions = () => {
    return transactions
      .filter(t => filterType === 'all' || t.type === filterType)
      .filter(t => filterCategory === 'all' || t.category === filterCategory)
      .filter(t => filterByDate(t))
      .filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch(sortBy) {
          case 'date-desc':
            return new Date(b.date) - new Date(a.date);
          case 'date-asc':
            return new Date(a.date) - new Date(b.date);
          case 'amount-desc':
            return b.amount - a.amount;
          case 'amount-asc':
            return a.amount - b.amount;
          default:
            return 0;
        }
      });
  };

  const filteredTransactions = getFilteredTransactions();

  const calculateTotals = () => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  };

  const calculateUnlinkedSavings = () => {
    // Calculate income not linked to goals
    const unlinkedIncome = transactions
      .filter(t => t.type === 'income' && (!t.linkedGoalId || t.linkedGoalId === ''))
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate total expenses
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Unlinked savings = unlinked income - expenses
    return Math.max(0, unlinkedIncome - totalExpenses);
  };

  const getQuickStats = () => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const highestExpense = expenses.length > 0 
      ? Math.max(...expenses.map(t => t.amount)) 
      : 0;
    const avgExpense = expenses.length > 0
      ? expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length
      : 0;
    
    return { highestExpense, avgExpense, totalTransactions: filteredTransactions.length };
  };

  const getCategorySpending = () => {
    const spending = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });
    return Object.entries(spending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const allCategories = [...new Set(transactions.map(t => t.category))];

  const { income, expenses, balance } = calculateTotals();
  const { highestExpense, avgExpense, totalTransactions } = getQuickStats();
  const categorySpending = getCategorySpending();
  const unlinkedSavings = calculateUnlinkedSavings();

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setTransactions([]);
      setBudgets({});
      localStorage.clear();
    }
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (Array.isArray(data)) {
            setTransactions(data);
          }
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <h3>Export Data</h3>
            <button onClick={() => exportData('csv')} className="sidebar-btn">
              <span className="icon">📊</span>
              Export to CSV
            </button>
            <button onClick={() => exportData('json')} className="sidebar-btn">
              <span className="icon">📄</span>
              Export to JSON
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Import Data</h3>
            <label htmlFor="import-file" className="sidebar-btn">
              <span className="icon">📥</span>
              Import from JSON
            </label>
            <input 
              type="file" 
              id="import-file" 
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </div>

          <div className="sidebar-section">
            <h3>Statistics</h3>
            <div className="sidebar-stat">
              <span>Total Transactions</span>
              <strong>{transactions.length}</strong>
            </div>
            <div className="sidebar-stat">
              <span>Total Income</span>
              <strong className="stat-income">${income.toFixed(2)}</strong>
            </div>
            <div className="sidebar-stat">
              <span>Total Expenses</span>
              <strong className="stat-expense">${expenses.toFixed(2)}</strong>
            </div>
            <div className="sidebar-stat">
              <span>Net Balance</span>
              <strong className="stat-balance">${balance.toFixed(2)}</strong>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <button onClick={clearAllData} className="sidebar-btn danger">
              <span className="icon">🗑️</span>
              Clear All Data
            </button>
          </div>

          <div className="sidebar-section">
            <button onClick={onLogout} className="sidebar-btn logout">
              <span className="icon">🚪</span>
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h1>AI Finance Advisor</h1>
        </div>
        <div className="theme-switcher">
          <span className="theme-label">{darkMode ? 'Dark' : 'Light'}</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={!darkMode}
              onChange={toggleTheme}
              aria-label="Toggle theme"
            />
            <span className="slider">
              <span className="slider-icon">{darkMode ? '🌙' : '☀️'}</span>
            </span>
          </label>
        </div>
      </header>

      <div className="dashboard-content">
        {lastDeleted && (
          <div className="undo-banner">
            <span>Transaction deleted</span>
            <button onClick={undoDelete} className="undo-btn">↶ Undo</button>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card income">
            <h3>Total Income</h3>
            <p className="amount">${income.toFixed(2)}</p>
          </div>
          
          <div className="stat-card expenses">
            <h3>Total Expenses</h3>
            <p className="amount">${expenses.toFixed(2)}</p>
          </div>
          
          <div className="stat-card balance">
            <h3>Current Balance</h3>
            <p className="amount">${balance.toFixed(2)}</p>
          </div>

          <div className="stat-card quick-stats">
            <h3>Quick Stats</h3>
            <div className="quick-stats-content">
              <div className="quick-stat-item">
                <span className="quick-stat-label">Transactions:</span>
                <span className="quick-stat-value">{totalTransactions}</span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">Avg Expense:</span>
                <span className="quick-stat-value">${avgExpense.toFixed(2)}</span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">Highest:</span>
                <span className="quick-stat-value">${highestExpense.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unlinked Savings Bar */}
        <div className="unlinked-savings-card">
          <div className="savings-header">
            <h3>💰 Savings</h3>
            <span className="savings-amount">${unlinkedSavings.toFixed(2)}</span>
          </div>
          
          <div className="savings-progress-bar">
            <div 
              className="savings-progress-fill" 
              style={{ 
                width: `${Math.min(100, transactions
                  .filter(t => t.type === 'income' && (!t.linkedGoalId || t.linkedGoalId === ''))
                  .reduce((sum, t) => sum + t.amount, 0) > 0 
                    ? (unlinkedSavings / transactions
                        .filter(t => t.type === 'income' && (!t.linkedGoalId || t.linkedGoalId === ''))
                        .reduce((sum, t) => sum + t.amount, 0)) * 100 
                    : 0)}%` 
              }}
            ></div>
          </div>
          
          <div className="savings-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Unlinked Income:</span>
              <span className="breakdown-value">
                ${transactions
                  .filter(t => t.type === 'income' && (!t.linkedGoalId || t.linkedGoalId === ''))
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Total Expenses:</span>
              <span className="breakdown-value expense">
                -${transactions
                  .filter(t => t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {categorySpending.length > 0 && (
          <div className="category-chart">
            <h3>Top Spending Categories</h3>
            <div className="chart-bars">
              {categorySpending.map(([category, amount]) => {
                const percentage = (amount / expenses) * 100;
                return (
                  <div key={category} className="chart-bar-container">
                    <div className="chart-bar-label">
                      <span>{category}</span>
                      <span>${amount.toFixed(2)}</span>
                    </div>
                    <div className="chart-bar">
                      <div 
                        className="chart-bar-fill" 
                        style={{ width: `${percentage}%` }}
                        title={`${percentage.toFixed(1)}%`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Savings Goals Section */}
        <div className="goals-section">
          <div className="goals-header">
            <h3>🎯 Savings Goals</h3>
            <button 
              className="add-goal-btn"
              onClick={() => setShowGoalForm(!showGoalForm)}
            >
              {showGoalForm ? '✕ Cancel' : '+ Add Goal'}
            </button>
          </div>

          {showGoalForm && (
            <div className="goal-form">
              <h4>Create a New Goal</h4>
              
              <div className="goal-templates">
                <label>Quick Templates:</label>
                <div className="template-grid">
                  {goalTemplates.map((template, index) => (
                    <button
                      key={index}
                      className="template-btn"
                      onClick={() => applyGoalTemplate(template)}
                      title={template.description}
                    >
                      <span className="template-icon">{template.icon}</span>
                      <span className="template-name">{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="goal-form-inputs">
                <div className="form-group">
                  <label>Goal Name *</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g., Buy a new car"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Target Amount * ($)</label>
                    <input
                      type="number"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                      placeholder="25000"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Current Savings ($)</label>
                    <input
                      type="number"
                      value={newGoal.currentAmount}
                      onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Target Date (Optional)</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Why are you saving for this?"
                    rows="3"
                  />
                </div>

                <button className="save-goal-btn" onClick={addGoal}>
                  💾 Save Goal
                </button>
              </div>
            </div>
          )}

          <div className="goals-list">
            {savingsGoals.length === 0 ? (
              <div className="no-goals">
                <p>📊 No savings goals yet. Create one to start tracking your progress!</p>
              </div>
            ) : (
              savingsGoals.map(goal => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const remaining = goal.targetAmount - goal.currentAmount;
                const daysLeft = goal.deadline 
                  ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-card-header">
                      <div className="goal-title">
                        <span className="goal-icon">{goal.icon}</span>
                        <h4>{goal.name}</h4>
                      </div>
                      <button 
                        className="delete-goal-btn"
                        onClick={() => deleteGoal(goal.id)}
                        title="Delete goal"
                      >
                        🗑️
                      </button>
                    </div>

                    {goal.description && (
                      <p className="goal-description">{goal.description}</p>
                    )}

                    <div className="goal-progress">
                      <div className="goal-amounts">
                        <span className="current-amount">${goal.currentAmount.toLocaleString()}</span>
                        <span className="target-amount">of ${goal.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="goal-progress-bar">
                        <div 
                          className="goal-progress-fill"
                          style={{ 
                            width: `${Math.min(progress, 100)}%`,
                            background: progress >= 100 ? '#10b981' : 'var(--purple-primary)'
                          }}
                        ></div>
                      </div>
                      <div className="goal-stats">
                        <span className="progress-percent">{progress.toFixed(1)}% Complete</span>
                        {remaining > 0 && (
                          <span className="remaining-amount">${remaining.toLocaleString()} to go</span>
                        )}
                      </div>
                    </div>

                    {daysLeft !== null && (
                      <div className="goal-deadline">
                        <span>📅 Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                        {daysLeft > 0 ? (
                          <span className="days-left">{daysLeft} days left</span>
                        ) : daysLeft === 0 ? (
                          <span className="days-left today">Today!</span>
                        ) : (
                          <span className="days-left overdue">{Math.abs(daysLeft)} days overdue</span>
                        )}
                      </div>
                    )}

                    <div className="goal-update">
                      <label>Update Progress:</label>
                      <div className="update-input-group">
                        <input
                          type="number"
                          value={goal.currentAmount}
                          onChange={(e) => updateGoalProgress(goal.id, e.target.value)}
                          min="0"
                          max={goal.targetAmount}
                        />
                        <button 
                          className="quick-add-btn"
                          onClick={() => updateGoalProgress(goal.id, goal.currentAmount + 100)}
                          title="Add $100"
                        >
                          +$100
                        </button>
                        <button 
                          className="quick-add-btn"
                          onClick={() => updateGoalProgress(goal.id, goal.currentAmount + 500)}
                          title="Add $500"
                        >
                          +$500
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="forms-section">
          <IncomeExpenseForm 
            onAddTransaction={addTransaction} 
            savingsGoals={savingsGoals}
          />
        </div>

        <div className="transactions-list">
          <div className="transactions-header">
            <h3>Transactions ({filteredTransactions.length})</h3>
            <div className="header-actions">
              <button onClick={clearAllData} className="clear-all-btn" title="Clear all data">
                🗑️ Clear All Data
              </button>
            </div>
          </div>
          
          <div className="filter-controls">
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
              
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
                <option value="all">All Categories</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="filter-select">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>

          {filteredTransactions.length === 0 ? (
            <p className="no-transactions">
              {transactions.length === 0 
                ? "No transactions yet. Add some income or expenses above!"
                : "No transactions match your filters."}
            </p>
          ) : (
            <div className="transactions">
              {filteredTransactions.map(transaction => (
                <div key={transaction.id} className={`transaction ${transaction.type}`}>
                  {editingId === transaction.id ? (
                    <div className="transaction-edit">
                      <input
                        type="text"
                        defaultValue={transaction.description}
                        onBlur={(e) => updateTransaction(transaction.id, { description: e.target.value })}
                        className="edit-input"
                        autoFocus
                      />
                      <button onClick={() => setEditingId(null)} className="edit-save-btn">✓</button>
                    </div>
                  ) : (
                    <>
                      <div className="transaction-info">
                        <span className="description">
                          {transaction.description}
                          {transaction.linkedGoalId && (
                            <span className="goal-link-badge" title="Linked to savings goal">
                              🎯 {savingsGoals.find(g => g.id === transaction.linkedGoalId)?.name}
                            </span>
                          )}
                        </span>
                        <span className="category">{transaction.category}</span>
                        <span className="date">{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                      <div className="transaction-actions">
                        <span className="amount">
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                        <button 
                          onClick={() => setEditingId(transaction.id)} 
                          className="edit-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteTransaction(transaction.id)} 
                          className="delete-btn"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

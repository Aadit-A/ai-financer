import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IncomeExpenseForm from './IncomeExpenseForm';
import './Dashboard.css';

// Animated Pie Chart Component
const AnimatedPieChart = ({ data, size = 200, animationDuration = 1500 }) => {
  const [animatedData, setAnimatedData] = useState([]);
  
  useEffect(() => {
    // Reset animation when data changes
    setAnimatedData(data.map(d => ({ ...d, value: 0 })));
    
    // Animate to actual values
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      
      setAnimatedData(data.map(d => ({
        ...d,
        value: d.value * easedProgress
      })));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [data, animationDuration]);
  
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  if (total === 0) {
    return (
      <div className="pie-chart-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            fill="var(--bg-secondary)"
            stroke="var(--border-color)"
            strokeWidth="2"
          />
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text-secondary)"
            fontSize="14"
          >
            No Data
          </text>
        </svg>
      </div>
    );
  }
  
  let currentAngle = -90; // Start from top
  const radius = (size / 2) - 10;
  const centerX = size / 2;
  const centerY = size / 2;
  
  const slices = animatedData.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle = endAngle;
    
    // Calculate path for pie slice
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    // Calculate label position (middle of the slice)
    const labelAngle = (startAngle + endAngle) / 2;
    const labelRad = (labelAngle * Math.PI) / 180;
    const labelRadius = radius * 0.65; // Position label at 65% of radius
    const labelX = centerX + labelRadius * Math.cos(labelRad);
    const labelY = centerY + labelRadius * Math.sin(labelRad);
    
    return {
      path: pathData,
      color: item.color,
      label: item.label,
      percentage: percentage.toFixed(1),
      value: data[index].value,
      labelX,
      labelY,
      showLabel: percentage > 5 // Only show label if slice is larger than 5%
    };
  });
  
  return (
    <div className="pie-chart-wrapper">
      <div className="pie-chart-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.path}
                fill={slice.color}
                stroke="var(--bg-card)"
                strokeWidth="2"
                className="pie-slice"
              />
              {slice.showLabel && (
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                  className="pie-label"
                  style={{ pointerEvents: 'none' }}
                >
                  {slice.percentage}%
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="pie-chart-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="legend-content">
              <span className="legend-label">{item.label}</span>
              <span className="legend-value">
                {slices[index]?.percentage}% (${item.value.toFixed(2)})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    return saved ? JSON.parse(saved) : true;
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

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

  const analyzeExpenseWithAI = async (description, category, amount, context = 'Not Applicable', customContext = '') => {
    try {
      console.log('Starting AI analysis...', { description, category, amount, context, customContext });
      
      const apiKey = 'AIzaSyBj3Q0dmVw4koicgAO6xiq0Ky3Z2zb-UqE';
      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
      let contextInfo = '';
      if (context === 'Custom' && customContext) {
        contextInfo = `\nAdditional Context: ${customContext}`;
      }
      
      const prompt = `Analyze this expense and determine if it's "Necessary" or "Unnecessary":

Description: ${description}
Category: ${category}
Amount: $${amount}${contextInfo}

Consider:
- Essential needs (food, housing, healthcare, transportation, medical emergencies) = Necessary
- Luxury items, entertainment, non-essential shopping, excessive spending = Unnecessary
- Context is important: emergencies, work-related, or family obligations may make expenses necessary
- One-time reasonable purchases vs frequent unnecessary spending

${customContext ? 'Pay special attention to the additional context provided above when making your decision.' : ''}

Reply in this EXACT format:
Classification: [Necessary or Unnecessary]
Reason: [Brief explanation in one sentence why this expense is necessary or unnecessary]`;

      console.log('Sending request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        return 'Unknown';
      }

      const data = await response.json();
      console.log('Full API Response:', JSON.stringify(data, null, 2));
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected API response structure:', data);
        return 'Unknown';
      }
      
      const aiResponse = data.candidates[0].content.parts[0].text.trim();
      console.log('AI Classification:', aiResponse);
      
      const classificationMatch = aiResponse.match(/Classification:\s*(Necessary|Unnecessary)/i);
      const reasonMatch = aiResponse.match(/Reason:\s*(.+?)(?:\n|$)/i);
      
      const classification = classificationMatch ? classificationMatch[1] : null;
      const reason = reasonMatch ? reasonMatch[1].trim() : 'No reason provided';
      
      if (classification) {
        return {
          classification: classification.charAt(0).toUpperCase() + classification.slice(1).toLowerCase(),
          reason: reason
        };
      } else {
        console.log('Could not determine classification from:', aiResponse);
        return {
          classification: 'Unknown',
          reason: 'Unable to analyze'
        };
      }
    } catch (error) {
      console.error('AI Analysis Error (caught):', error);
      return {
        classification: 'Unknown',
        reason: 'Analysis failed'
      };
    }
  };

  const generateTransactionRecommendation = async (type, description, category, amount, context = 'Not Applicable', customContext = '') => {
    try {
      const apiKey = 'AIzaSyBj3Q0dmVw4koicgAO6xiq0Ky3Z2zb-UqE';
      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
      let contextInfo = '';
      if (context === 'Custom' && customContext) {
        contextInfo = `\nAdditional Context: ${customContext}`;
      }
      
      const prompt = type === 'expense' 
        ? `You are a financial advisor AI. A user just added this EXPENSE transaction. Provide personalized financial advice.

Transaction Details:
- Type: Expense
- Description: ${description}
- Category: ${category}
- Amount: $${amount}${contextInfo}

Provide a comprehensive recommendation in this EXACT format:

Classification: [Necessary or Unnecessary]
Reason: [One sentence explaining why this is necessary or unnecessary]
Recommendation: [2-3 sentences with specific, actionable advice about this expense]
Context: [One sentence about the financial impact or broader implications]

Be specific, personalized, and actionable. Consider budgeting tips, alternatives, or validation of smart spending.`
        : `You are a financial advisor AI. A user just added this INCOME transaction. Provide personalized financial advice.

Transaction Details:
- Type: Income
- Description: ${description}
- Category: ${category}
- Amount: $${amount}${contextInfo}

Provide a comprehensive recommendation in this EXACT format:

Classification: Income
Reason: [One sentence about this income source]
Recommendation: [2-3 sentences with specific advice on how to allocate or optimize this income]
Context: [One sentence about maximizing this income stream or building wealth]

Be specific, personalized, and actionable. Focus on smart allocation, saving strategies, and wealth building.`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text.trim();
      
      console.log('AI Recommendation Response:', aiResponse);

      const classificationMatch = aiResponse.match(/Classification:\s*(.+?)(?:\n|$)/i);
      const reasonMatch = aiResponse.match(/Reason:\s*(.+?)(?:\n|$)/i);
      const recommendationMatch = aiResponse.match(/Recommendation:\s*(.+?)(?=\nContext:|$)/is);
      const contextMatch = aiResponse.match(/Context:\s*(.+?)$/is);

      return {
        classification: classificationMatch ? classificationMatch[1].trim() : (type === 'income' ? 'Income' : 'Unknown'),
        reason: reasonMatch ? reasonMatch[1].trim() : 'Analysis complete',
        recommendation: recommendationMatch ? recommendationMatch[1].trim().replace(/\n/g, ' ') : 'Continue monitoring your finances.',
        context: contextMatch ? contextMatch[1].trim() : contextInfo || 'Transaction recorded'
      };
    } catch (error) {
      console.error('AI Recommendation Error:', error);
      return {
        classification: type === 'income' ? 'Income' : 'Unknown',
        reason: 'Analysis complete',
        recommendation: 'Unable to generate recommendation at this time. Please try again.',
        context: 'Error occurred during analysis'
      };
    }
  };

  const getAIRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const apiKey = 'AIzaSyBj3Q0dmVw4koicgAO6xiq0Ky3Z2zb-UqE';
      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
      // Prepare transaction summary
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const necessaryExpenses = transactions.filter(t => t.aiAnalysis === 'Necessary').reduce((sum, t) => sum + t.amount, 0);
      const unnecessaryExpenses = transactions.filter(t => t.aiAnalysis === 'Unnecessary').reduce((sum, t) => sum + t.amount, 0);
      
      // Category breakdown
      const categoryBreakdown = {};
      transactions.filter(t => t.type === 'expense').forEach(t => {
        if (!categoryBreakdown[t.category]) {
          categoryBreakdown[t.category] = { total: 0, count: 0, items: [] };
        }
        categoryBreakdown[t.category].total += t.amount;
        categoryBreakdown[t.category].count += 1;
        categoryBreakdown[t.category].items.push({
          description: t.description,
          amount: t.amount,
          aiAnalysis: t.aiAnalysis
        });
      });

      const categoryText = Object.entries(categoryBreakdown)
        .map(([cat, data]) => `${cat}: $${data.total.toFixed(2)} (${data.count} transactions)`)
        .join('\n');

      const transactionDetails = transactions
        .filter(t => t.type === 'expense')
        .slice(0, 20)
        .map(t => `- ${t.description} ($${t.amount}) [${t.category}] ${t.aiAnalysis ? `[AI: ${t.aiAnalysis}]` : ''}`)
        .join('\n');

      const prompt = `You are a professional financial advisor. Analyze this user's financial data and provide detailed, actionable recommendations.

FINANCIAL SUMMARY:
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpenses.toFixed(2)}
- Net Savings: $${(totalIncome - totalExpenses).toFixed(2)}
- Necessary Expenses: $${necessaryExpenses.toFixed(2)}
- Unnecessary Expenses: $${unnecessaryExpenses.toFixed(2)}
- Total Transactions: ${transactions.length}

SPENDING BY CATEGORY:
${categoryText}

RECENT TRANSACTIONS (sample):
${transactionDetails}

SAVINGS GOALS:
${savingsGoals.length > 0 ? savingsGoals.map(g => `- ${g.name}: $${g.currentAmount}/$${g.targetAmount}`).join('\n') : 'No savings goals set'}

Please provide comprehensive financial recommendations in the following format:

### 💰 SPENDING REDUCTION OPPORTUNITIES
[List 3-5 specific areas where the user can cut spending, with exact dollar amounts they could save]

### 📊 BUDGET OPTIMIZATION
[Suggest how to better allocate their money across categories]

### 💎 INVESTMENT & SAVINGS TIPS
[Provide 3-4 specific investment ideas or savings strategies with the money they save]

### 🎯 SMART MONEY HABITS
[Give 3-5 practical tips for better financial management]

### 📈 PROJECTED IMPACT
[Calculate potential annual savings and growth if they follow your advice]

Be specific, use actual numbers from their data, and make recommendations actionable and easy to follow.`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI recommendations');
      }

      const data = await response.json();
      const recommendations = data.candidates[0].content.parts[0].text.trim();
      
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('AI Recommendations Error:', error);
      setAiRecommendations('Unable to generate recommendations. Please try again later.');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const addTransaction = async (transaction) => {
    console.log('Adding transaction:', transaction);
    const newTransaction = { ...transaction, id: Date.now() };
    
    // Always analyze with AI (both income and expense)
    console.log('Starting AI analysis for transaction...');
    setIsAnalyzing(true);
    
    try {
      const aiRecommendation = await generateTransactionRecommendation(
        transaction.type,
        transaction.description,
        transaction.category,
        transaction.amount,
        transaction.context || 'Not Applicable',
        transaction.customContext || ''
      );
      console.log('AI Recommendation generated:', aiRecommendation);
      
      // Store AI analysis for expenses
      if (transaction.type === 'expense') {
        newTransaction.aiAnalysis = aiRecommendation.classification;
        newTransaction.aiReason = aiRecommendation.reason;
        if (transaction.customContext) {
          newTransaction.aiContext = transaction.customContext;
        }
      }
      
      // Store full recommendation for AI Recommendations page
      newTransaction.aiRecommendation = aiRecommendation;
      
    } catch (error) {
      console.error('Error during AI analysis:', error);
      if (transaction.type === 'expense') {
        newTransaction.aiAnalysis = 'Unknown';
        newTransaction.aiReason = 'Analysis failed';
      }
      newTransaction.aiRecommendation = {
        classification: 'Unknown',
        reason: 'Analysis failed',
        recommendation: 'Unable to generate recommendation at this time.',
        context: 'Error occurred during analysis'
      };
    } finally {
      setIsAnalyzing(false);
    }
    
    console.log('Adding transaction to state:', newTransaction);
    setTransactions([...transactions, newTransaction]);
    
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
          <div className="sidebar-section mobile-nav">
            <h3>Navigation</h3>
            <button 
              onClick={() => { setActivePage('home'); setSidebarOpen(false); }} 
              className={`sidebar-btn ${activePage === 'home' ? 'active' : ''}`}
            >
              <span className="icon">🏠</span>
              Home
            </button>
            <button 
              onClick={() => { setActivePage('transactions'); setSidebarOpen(false); }} 
              className={`sidebar-btn ${activePage === 'transactions' ? 'active' : ''}`}
            >
              <span className="icon">💳</span>
              Transactions
            </button>
            <button 
              onClick={() => { setActivePage('ai-recommendations'); setSidebarOpen(false); }} 
              className={`sidebar-btn ${activePage === 'ai-recommendations' ? 'active' : ''}`}
            >
              <span className="icon">🤖</span>
              AI Recommendations
            </button>
          </div>

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
          <nav className="header-nav">
            <button 
              className={`nav-btn ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => setActivePage('home')}
            >
              🏠 Home
            </button>
            <button 
              className={`nav-btn ${activePage === 'transactions' ? 'active' : ''}`}
              onClick={() => setActivePage('transactions')}
            >
              💳 Transactions
            </button>
            <button 
              className={`nav-btn ${activePage === 'ai-recommendations' ? 'active' : ''}`}
              onClick={() => setActivePage('ai-recommendations')}
            >
              🤖 AI Recommendations
            </button>
          </nav>
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
        {isAnalyzing && (
          <div className="ai-analyzing-banner">
            <span>🤖 AI is analyzing your expense... Please wait</span>
          </div>
        )}
        
        {lastDeleted && (
          <div className="undo-banner">
            <span>Transaction deleted</span>
            <button onClick={undoDelete} className="undo-btn">↶ Undo</button>
          </div>
        )}

        {/* HOME PAGE */}
        {activePage === 'home' && (
          <>
            <div className="stats-grid">
              <motion.div 
                className="stat-card income"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3>Total Income</h3>
                <p className="amount">${income.toFixed(2)}</p>
              </motion.div>
              
              <motion.div 
                className="stat-card expenses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3>Total Expenses</h3>
                <p className="amount">${expenses.toFixed(2)}</p>
              </motion.div>
              
              <motion.div 
                className="stat-card balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <h3>Current Balance</h3>
                <p className="amount">${balance.toFixed(2)}</p>
              </motion.div>

              <motion.div 
                className="stat-card quick-stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
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
              </motion.div>
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
          </>
        )}

        {/* TRANSACTIONS PAGE */}
        {activePage === 'transactions' && (
          <>
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
                              {transaction.aiAnalysis && transaction.type === 'expense' && (
                                <span 
                                  className={`ai-analysis-badge ${transaction.aiAnalysis.toLowerCase()}`}
                                  title={transaction.aiReason || 'AI Analysis'}
                                >
                                  🤖 {transaction.aiAnalysis}
                                </span>
                              )}
                              {transaction.aiReason && transaction.type === 'expense' && (
                                <span className="ai-reason-note" title="AI's reasoning">
                                  💡 {transaction.aiReason}
                                </span>
                              )}
                              {transaction.aiContext && (
                                <span className="ai-context-note" title="User provided context">
                                  📝 {transaction.aiContext}
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
          </>
        )}

        {/* AI RECOMMENDATIONS PAGE */}
        {activePage === 'ai-recommendations' && (
          <>
            <div className="ai-recommendations-page">
              <h2 className="page-title">🤖 AI Recommendations & Insights</h2>
              
              <div className="ai-overview-cards">
                <div className="ai-card pie-chart-card">
                  <h3>💰 Transaction Analysis</h3>
                  <AnimatedPieChart
                    size={220}
                    animationDuration={1500}
                    data={[
                      {
                        label: 'Income',
                        value: transactions.filter(t => t.type === 'income').length,
                        color: '#10b981'
                      },
                      {
                        label: 'Necessary',
                        value: transactions.filter(t => t.aiAnalysis === 'Necessary').length,
                        color: '#3b82f6'
                      },
                      {
                        label: 'Unnecessary',
                        value: transactions.filter(t => t.aiAnalysis === 'Unnecessary').length,
                        color: '#ef4444'
                      }
                    ]}
                  />
                  <div className="chart-summary">
                    <p><strong>Total Transactions:</strong> {transactions.length}</p>
                  </div>
                </div>

                <div className="ai-card pie-chart-card">
                  <h3>📊 Money Flow</h3>
                  <AnimatedPieChart
                    size={220}
                    animationDuration={1500}
                    data={[
                      {
                        label: 'Income',
                        value: income,
                        color: '#10b981'
                      },
                      {
                        label: 'Necessary Expenses',
                        value: transactions.filter(t => t.aiAnalysis === 'Necessary').reduce((sum, t) => sum + t.amount, 0),
                        color: '#3b82f6'
                      },
                      {
                        label: 'Unnecessary Expenses',
                        value: transactions.filter(t => t.aiAnalysis === 'Unnecessary').reduce((sum, t) => sum + t.amount, 0),
                        color: '#ef4444'
                      }
                    ]}
                  />
                  <div className="chart-summary">
                    <p><strong>Net Balance:</strong> ${balance.toFixed(2)}</p>
                  </div>
                </div>

                <div className="ai-card">
                  <h3>💡 Smart Insights</h3>
                  <div className="ai-card-content">
                    {transactions.length > 0 ? (
                      <>
                        <p>📊 <strong>{transactions.filter(t => t.aiRecommendation).length}</strong> transactions analyzed with AI</p>
                        {transactions.filter(t => t.aiAnalysis === 'Unnecessary').length > 0 && (
                          <p>💰 Potential savings: <strong>${transactions.filter(t => t.aiAnalysis === 'Unnecessary').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</strong></p>
                        )}
                        <p>🎯 Scroll down to see personalized recommendations for each transaction</p>
                      </>
                    ) : (
                      <p>✨ Add transactions to get AI-powered insights!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction Recommendations List */}
              <div className="transactions-recommendations-list">
                <h3>📝 Transaction Recommendations</h3>
                
                {transactions.length === 0 ? (
                  <div className="no-transactions">
                    <p>No transactions yet. Add income or expenses to get personalized AI recommendations!</p>
                  </div>
                ) : (
                  <div className="recommendations-grid">
                    {[...transactions].reverse().map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        className={`transaction-recommendation-card ${transaction.type}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="transaction-rec-header">
                          <div className="transaction-rec-info">
                            <h4>{transaction.description}</h4>
                            <div className="transaction-rec-meta">
                              <span className={`rec-type-badge ${transaction.type}`}>
                                {transaction.type === 'income' ? '💰 Income' : '💳 Expense'}
                              </span>
                              <span className="rec-category">{transaction.category}</span>
                              <span className="rec-date">{new Date(transaction.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className={`transaction-rec-amount ${transaction.type}`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </div>
                        </div>

                        {transaction.aiRecommendation && (
                          <div className="ai-recommendation-content">
                            <div className="rec-classification">
                              <span className={`classification-badge ${transaction.aiRecommendation.classification?.toLowerCase()}`}>
                                {transaction.aiRecommendation.classification === 'Necessary' && '✅ Necessary'}
                                {transaction.aiRecommendation.classification === 'Unnecessary' && '⚠️ Unnecessary'}
                                {transaction.aiRecommendation.classification === 'Income' && '💰 Income'}
                                {!['Necessary', 'Unnecessary', 'Income'].includes(transaction.aiRecommendation.classification) && '🤖 ' + transaction.aiRecommendation.classification}
                              </span>
                            </div>

                            <div className="rec-section">
                              <div className="rec-label">🧠 AI Reasoning:</div>
                              <p className="rec-text">{transaction.aiRecommendation.reason}</p>
                            </div>

                            <div className="rec-section">
                              <div className="rec-label">💡 Recommendation:</div>
                              <p className="rec-text recommendation-highlight">{transaction.aiRecommendation.recommendation}</p>
                            </div>

                            <div className="rec-section">
                              <div className="rec-label">📌 Context:</div>
                              <p className="rec-text context-text">{transaction.aiRecommendation.context}</p>
                            </div>
                          </div>
                        )}

                        {!transaction.aiRecommendation && transaction.type === 'expense' && (
                          <div className="ai-recommendation-content no-recommendation">
                            <p>⏳ This transaction was added before AI recommendations were enabled.</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import { useState } from 'react';
import './IncomeExpenseForm.css';

const IncomeExpenseForm = ({ onAddTransaction, savingsGoals = [] }) => {
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    linkedGoalId: '',
    context: 'Not Applicable'
  });
  const [showContextInput, setShowContextInput] = useState(false);

  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Other'];
  const expenseCategories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

  // Quick templates for common transactions
  const quickTemplates = {
    income: [
      { description: 'Monthly Salary', category: 'Salary', icon: '💰' },
      { description: 'Freelance Work', category: 'Freelance', icon: '💼' },
      { description: 'Investment Return', category: 'Investment', icon: '📈' },
    ],
    expense: [
      { description: 'Groceries', category: 'Food', icon: '🛒' },
      { description: 'Gas/Fuel', category: 'Transportation', icon: '⛽' },
      { description: 'Rent/Mortgage', category: 'Housing', icon: '🏠' },
      { description: 'Dining Out', category: 'Food', icon: '🍽️' },
      { description: 'Shopping', category: 'Shopping', icon: '🛍️' },
    ]
  };

  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      description: template.description,
      category: template.category
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    onAddTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString()
    });

    // Reset form
    setFormData({
      type: 'income',
      amount: '',
      description: '',
      category: '',
      linkedGoalId: '',
      context: 'Not Applicable'
    });
    setShowContextInput(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '', linkedGoalId: '', context: 'Not Applicable' } : {})
    }));
    
    if (name === 'context' && value === 'Custom') {
      setShowContextInput(true);
    } else if (name === 'context' && value === 'Not Applicable') {
      setShowContextInput(false);
    }
  };

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;
  const templates = quickTemplates[formData.type] || [];

  return (
    <div className="income-expense-form">
      <h3>Add Income/Expense</h3>
      
      {/* Quick Templates */}
      <div className="quick-templates">
        <span className="templates-label">Quick Add:</span>
        <div className="template-buttons">
          {templates.map((template, idx) => (
            <button
              key={idx}
              type="button"
              className="template-btn"
              onClick={() => applyTemplate(template)}
              title={template.description}
            >
              {template.icon} {template.description}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($):</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
            />
          </div>
        </div>

        {formData.type === 'expense' && (
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="context">
                🤖 AI Analysis Context (Optional):
              </label>
              <select
                id="context"
                name="context"
                value={formData.context}
                onChange={handleChange}
              >
                <option value="Not Applicable">Not Applicable - Basic expense</option>
                <option value="Custom">Provide Custom Context</option>
              </select>
              <small className="help-text">
                Add context to help AI better classify this expense
              </small>
            </div>
          </div>
        )}

        {formData.type === 'income' && (
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="context">
                🤖 AI Context (Optional):
              </label>
              <select
                id="context"
                name="context"
                value={formData.context}
                onChange={handleChange}
              >
                <option value="Not Applicable">Not Applicable - Regular income</option>
                <option value="Custom">Provide Custom Context</option>
              </select>
              <small className="help-text">
                Add context to get personalized AI recommendations
              </small>
            </div>
          </div>
        )}

        {((formData.type === 'expense' && showContextInput) || (formData.type === 'income' && showContextInput)) && (
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="customContext">
                📝 Additional Context:
              </label>
              <textarea
                id="customContext"
                name="customContext"
                value={formData.customContext || ''}
                onChange={handleChange}
                placeholder={formData.type === 'income' 
                  ? "e.g., 'Bonus from project completion', 'Freelance client payment', 'Side hustle earnings', etc."
                  : "e.g., 'Emergency car repair', 'Birthday gift for family', 'Business meeting dinner', etc."}
                rows="2"
              />
              <small className="help-text">
                {formData.type === 'income' 
                  ? 'Explain the source or nature of this income for better AI recommendations'
                  : 'Explain why you made this expense to improve AI accuracy'}
              </small>
            </div>
          </div>
        )}

        {savingsGoals.length > 0 && (
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="linkedGoalId">
                🎯 Link to Savings Goal (Optional):
              </label>
              <select
                id="linkedGoalId"
                name="linkedGoalId"
                value={formData.linkedGoalId}
                onChange={handleChange}
              >
                <option value="">None - Don't link to any goal</option>
                {savingsGoals
                  .filter(goal => goal.currentAmount < goal.targetAmount)
                  .map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.icon || '🎯'} {goal.name} (${goal.currentAmount.toFixed(2)} / ${goal.targetAmount})
                    </option>
                  ))}
              </select>
              <small className="help-text">
                Link this transaction to contribute the full amount to your goal
              </small>
            </div>
          </div>
        )}

        <button type="submit" className={`submit-btn ${formData.type}`}>
          Add {formData.type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  );
};

export default IncomeExpenseForm;

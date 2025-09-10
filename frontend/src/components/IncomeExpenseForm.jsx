import { useState } from 'react';
import './IncomeExpenseForm.css';

const IncomeExpenseForm = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: ''
  });

  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Other'];
  const expenseCategories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

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
      category: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' ? { category: '' } : {})
    }));
  };

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="income-expense-form">
      <h3>Add Income/Expense</h3>
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

        <button type="submit" className={`submit-btn ${formData.type}`}>
          Add {formData.type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  );
};

export default IncomeExpenseForm;

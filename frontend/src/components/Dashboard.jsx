import { useState } from 'react';
import IncomeExpenseForm from './IncomeExpenseForm';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState(5000);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  };

  const { income, expenses, balance } = calculateTotals();
  const savingsProgress = (balance / savingsGoal) * 100;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>AI Finance Advisor Dashboard</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-content">
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
        </div>

        <div className="savings-goal">
          <h3>Savings Goal Progress</h3>
          <div className="goal-info">
            <span>Goal: ${savingsGoal}</span>
            <span>Progress: {savingsProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(savingsProgress, 100)}%` }}
            ></div>
          </div>
          <div className="goal-input">
            <label>
              Update Goal: 
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                min="0"
                step="100"
              />
            </label>
          </div>
        </div>

        <div className="forms-section">
          <IncomeExpenseForm onAddTransaction={addTransaction} />
        </div>

        <div className="transactions-list">
          <h3>Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions yet. Add some income or expenses above!</p>
          ) : (
            <div className="transactions">
              {transactions.slice(-10).reverse().map(transaction => (
                <div key={transaction.id} className={`transaction ${transaction.type}`}>
                  <div className="transaction-info">
                    <span className="description">{transaction.description}</span>
                    <span className="category">{transaction.category}</span>
                  </div>
                  <span className="amount">
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
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

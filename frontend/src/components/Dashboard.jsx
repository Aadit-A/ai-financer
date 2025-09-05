import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="wireframe-container">
      <div className="wireframe-box dashboard-wireframe">
        <div className="wireframe-header">
          <h1>AI Finance Advisor - Dashboard</h1>
          <div className="wireframe-button" onClick={onLogout}>
            [Logout Button]
          </div>
        </div>

        <div className="wireframe-grid">
          <div className="wireframe-card income-card">
            <h3>[Income Card]</h3>
            <div className="wireframe-amount">$XXX.XX</div>
            <p>Total monthly income</p>
          </div>

          <div className="wireframe-card expense-card">
            <h3>[Expense Card]</h3>
            <div className="wireframe-amount">$XXX.XX</div>
            <p>Total monthly expenses</p>
          </div>

          <div className="wireframe-card balance-card">
            <h3>[Balance Card]</h3>
            <div className="wireframe-amount">$XXX.XX</div>
            <p>Current balance</p>
          </div>
        </div>

        <div className="wireframe-section">
          <div className="wireframe-card savings-card">
            <h3>[Savings Goal Progress]</h3>
            <div className="wireframe-progress-bar">
              <div className="wireframe-progress-fill"></div>
            </div>
            <p>XX% of $X,XXX goal reached</p>
          </div>
        </div>

        <div className="wireframe-section">
          <div className="wireframe-card form-card">
            <h3>[Add Income/Expense Form]</h3>
            <div className="wireframe-form-row">
              <div className="wireframe-input">[Type Dropdown]</div>
              <div className="wireframe-input">[Amount Input]</div>
            </div>
            <div className="wireframe-form-row">
              <div className="wireframe-input">[Category Dropdown]</div>
              <div className="wireframe-input">[Description Input]</div>
            </div>
            <div className="wireframe-button">[Add Transaction Button]</div>
          </div>
        </div>

        <div className="wireframe-section">
          <div className="wireframe-card transactions-card">
            <h3>[Recent Transactions]</h3>
            <div className="wireframe-transaction">
              <span>[Transaction 1]</span> <span>[+$XXX.XX]</span>
            </div>
            <div className="wireframe-transaction">
              <span>[Transaction 2]</span> <span>[-$XXX.XX]</span>
            </div>
            <div className="wireframe-transaction">
              <span>[Transaction 3]</span> <span>[+$XXX.XX]</span>
            </div>
          </div>
        </div>

        <div className="wireframe-notes">
          <h3>Dashboard Wireframe Notes:</h3>
          <p>Main financial overview with key metrics</p>
          <p>Income, Expenses, Balance cards in grid layout</p>
          <p>Savings goal with visual progress bar</p>
          <p>Form to add new transactions</p>
          <p>Recent transactions list</p>
          <p>Responsive design for mobile/desktop</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

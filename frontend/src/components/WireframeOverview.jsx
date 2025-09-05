import { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './WireframeOverview.css';

const WireframeOverview = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  if (showLogin) {
    return <Login onLogin={() => setShowLogin(false)} />;
  }

  if (showDashboard) {
    return <Dashboard onLogout={() => setShowDashboard(false)} />;
  }

  return (
    <div className="wireframe-overview">
      <div className="overview-header">
        <h1>AI Finance Advisor - UI Wireframes & Sketches</h1>
        <p>Phase 1: Simple wireframes and UI layout planning</p>
        <div className="test-buttons">
          <button onClick={() => setShowLogin(true)} className="test-btn">
            Login Wireframe
          </button>
          <button onClick={() => setShowDashboard(true)} className="test-btn">
            Dashboard Wireframe
          </button>
        </div>
      </div>

      <div className="wireframe-section">
        <div className="wireframe-preview">
          <Login onLogin={() => {}} />
        </div>
      </div>

      <div className="wireframe-section">
        <div className="wireframe-preview">
          <Dashboard onLogout={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default WireframeOverview;

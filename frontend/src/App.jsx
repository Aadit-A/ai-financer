import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import WireframeOverview from './components/WireframeOverview'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('overview') // 'overview', 'login', 'dashboard'

  const handleLogin = () => {
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setCurrentView('login')
  }

  const showOverview = () => {
    setCurrentView('overview')
  }

  const renderCurrentView = () => {
    switch(currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} />
      case 'overview':
      default:
        return <WireframeOverview />
    }
  }

  return (
    <div className="app">
      {currentView !== 'overview' && (
        <div className="app-nav">
          <button onClick={showOverview} className="overview-btn">
            ← Back to Wireframe Overview
          </button>
        </div>
      )}
      {renderCurrentView()}
    </div>
  )
}

export default App

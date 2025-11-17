import { useState } from 'react'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing') // 'landing', 'login', 'dashboard'

  const handleGetStarted = () => {
    setCurrentPage('login')
  }

  const handleLogin = () => {
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setCurrentPage('landing')
  }

  return (
    <div className="app">
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {currentPage === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App

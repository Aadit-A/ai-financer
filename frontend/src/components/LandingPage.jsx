import { motion } from 'framer-motion';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Get personalized financial recommendations powered by advanced AI technology for every transaction.'
    },
    {
      icon: '📊',
      title: 'Smart Insights',
      description: 'Visualize your spending patterns with beautiful charts and understand where your money goes.'
    },
    {
      icon: '🎯',
      title: 'Savings Goals',
      description: 'Set and track multiple savings goals with progress visualization and deadline management.'
    },
    {
      icon: '💰',
      title: 'Expense Tracking',
      description: 'Automatically categorize and classify expenses as necessary or unnecessary with AI assistance.'
    },
    {
      icon: '📈',
      title: 'Real-time Analytics',
      description: 'Monitor your financial health with live updates and comprehensive spending breakdowns.'
    },
    {
      icon: '✨',
      title: 'Beautiful Design',
      description: 'Enjoy a premium iOS-inspired interface with glassmorphism effects and smooth animations.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'AI Accuracy' },
    { value: '$2M+', label: 'Money Saved' },
    { value: '4.9★', label: 'User Rating' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span>AI FINANCE ADVISOR</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Manage your finances with
            <span className="gradient-text"> AI insights</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Track and optimize your spending with intelligent suggestions.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button className="cta-button primary" onClick={onGetStarted}>
              <span>Get Started</span>
            </button>
          </motion.div>

          <motion.div
            className="decorative-blob blob-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.div
            className="decorative-blob blob-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="preview-header-title">AI Finance Advisor</div>
              <div className="preview-header-pill">Live</div>
            </div>

            <div className="preview-window">
              <div className="preview-sidebar">
                <div className="sidebar-logo">AF</div>
                <div className="sidebar-item active">
                  <span className="sidebar-dot income"></span>
                  <span>Overview</span>
                </div>
                <div className="sidebar-item">
                  <span className="sidebar-dot expenses"></span>
                  <span>Spending</span>
                </div>
                <div className="sidebar-item">
                  <span className="sidebar-dot goals"></span>
                  <span>Goals</span>
                </div>
                <div className="sidebar-footer-pill">AI Assist</div>
              </div>

              <div className="preview-main">
                <div className="preview-main-header">
                  <div>
                    <div className="preview-label">Today&apos;s snapshot</div>
                    <div className="preview-main-title">You&apos;re on track this month</div>
                  </div>
                  <div className="preview-main-pill">Insights ▾</div>
                </div>

                <div className="preview-main-row">
                  <div className="preview-stat-card income-card">
                    <div className="preview-label">Income</div>
                    <div className="preview-value">$12,000</div>
                    <div className="preview-trend positive">+18% vs last month</div>
                  </div>
                  <div className="preview-stat-card expense-card">
                    <div className="preview-label">Expenses</div>
                    <div className="preview-value">$8,500</div>
                    <div className="preview-trend negative">-9% unnecessary</div>
                  </div>
                  <div className="preview-stat-card savings-card">
                    <div className="preview-label">Savings Rate</div>
                    <div className="preview-value">32%</div>
                    <div className="savings-bar mini">
                      <div className="savings-fill"></div>
                    </div>
                  </div>
                </div>

                <div className="preview-main-lower">
                  <div className="preview-mini-chart-card">
                    <div className="preview-label">Spending breakdown</div>
                    <div className="mini-chart">
                      <div className="chart-pie"></div>
                      <div className="chart-legend">
                        <div className="legend-item">
                          <span className="legend-dot necessities"></span>
                          <span>Essentials</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot wants"></span>
                          <span>Wants</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="preview-ai-card">
                    <div className="preview-label">Gemini AI suggestions</div>
                    <div className="ai-rec-list">
                      <div className="ai-rec-item">✓ Move $400 from dining to savings</div>
                      <div className="ai-rec-item">✓ Cap subscriptions at $120</div>
                      <div className="ai-rec-item">✓ You can reach your goal 2 months earlier</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="floating-orb orb-1"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="floating-orb orb-2"
            animate={{ 
              y: [0, 20, 0],
              x: [0, -10, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Everything You Need to
            <span className="gradient-text"> Master Your Finances</span>
          </h2>
          <p className="section-description">
            Powerful features designed to help you track, analyze, and optimize your spending habits.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to Transform Your
            <span className="gradient-text"> Financial Life?</span>
          </h2>
          <p className="cta-description">
            Join thousands of users who are already saving more and spending smarter with AI-powered insights.
          </p>
          <button className="cta-button large" onClick={onGetStarted}>
            <span>Start Your Journey Today</span>
            <span className="button-icon">→</span>
          </button>
          <p className="cta-note">No credit card required • Free forever • AI-powered</p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">AI Finance Advisor</h3>
            <p className="footer-tagline">Smart money management, powered by AI</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#demo">Demo</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#blog">Blog</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact</a>
              <a href="#status">Status</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 AI Finance Advisor. All rights reserved.</p>
          <div className="footer-social">
            <a href="#twitter">Twitter</a>
            <a href="#linkedin">LinkedIn</a>
            <a href="#github">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

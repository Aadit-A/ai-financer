import './Login.css';

const Login = ({ onLogin }) => {
  return (
    <div className="wireframe-container">
      <div className="wireframe-box login-wireframe">
        <div className="wireframe-header">
          <h1>AI Finance Advisor - Login</h1>
        </div>
        
        <div className="wireframe-section">
          <div className="wireframe-input">
            <label>[Username Input Field]</label>
          </div>
          <div className="wireframe-input">
            <label>[Password Input Field]</label>
          </div>
          <div className="wireframe-button" onClick={onLogin}>
            [Login Button]
          </div>
        </div>

        <div className="wireframe-notes">
          <h3>Wireframe Notes:</h3>
          <p>Simple login form with username/password</p>
          <p>No authentication logic in Phase 1</p>
          <p>Clean, centered design</p>
          <p>Mobile-responsive layout</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

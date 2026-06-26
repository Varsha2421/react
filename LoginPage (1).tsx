import { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('admin@complianceos.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    if (!email) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (email && password) {
      onLoginSuccess();
      return;
    }

    setError('Invalid credentials');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">Welcome Back</div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-wrap">
            <span aria-hidden="true">✉</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-wrap">
            <span aria-hidden="true">🔒</span>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} />
            <button type="button" className="eye-btn" onClick={() => setShowPassword((value) => !value)} aria-label="Show password">
              👁
            </button>
          </div>
        </div>
        {error ? <div style={{ color: '#e53935', fontSize: 13, marginBottom: 12 }}>{error}</div> : null}
        <button className="login-btn" onClick={handleLogin}>Sign In to Dashboard</button>
        <div className="login-divider" />
        <div className="login-note">Secured with enterprise-grade SSL encryption.<br />Authorized access only.</div>
      </div>
      <div className="login-footer">© 2024 ComplianceOS Systems. All Rights Reserved.</div>
    </div>
  );
}

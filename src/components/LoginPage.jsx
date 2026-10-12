import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  Radio, 
  Sparkles,
} from 'lucide-react';

export const LoginPage = () => {
  const { login, signup, accounts } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        login(email, password);
      } else {
        signup(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (account) => {
    setError('');
    try {
      login(account.email, account.password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="spotify-auth-page">
      <div className="spotify-auth-container">
        {/* Spotify Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-logo-badge">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="#1db954">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.31a.754.754 0 0 1-1.037.25c-2.836-1.733-6.406-2.126-10.612-1.165a.755.755 0 0 1-.34-1.472c4.605-1.052 8.566-.605 11.74 1.349a.755.755 0 0 1 .25 1.038zm1.468-3.264a.945.945 0 0 1-1.3.312c-3.246-1.996-8.196-2.574-12.036-1.408a.946.946 0 0 1-.557-1.808c4.388-1.332 9.84-.69 13.58 1.608a.946.946 0 0 1 .313 1.288zm.125-3.402C15.21 8.358 8.84 8.15 5.146 9.27a1.135 1.135 0 0 1-.67-2.169c4.248-1.289 11.29-1.045 15.76 1.61a1.135 1.135 0 0 1-1.14 1.933z"/>
            </svg>
          </div>
          <h1 className="auth-main-title">
            {mode === 'login' ? 'Log in to Spotify' : 'Sign up to start listening'}
          </h1>
          <p className="auth-sub-title">
            Millions of songs. High-Res 320kbps Lossless DSP. Free on Spotify Clone.
          </p>
        </div>

        {/* Quick Demo Accounts Switcher */}
        <div className="auth-demo-accounts-card">
          <div className="demo-accounts-title">
            <Sparkles size={15} color="#1db954" />
            <span>Instant Demo Logins (Multi-User Test)</span>
          </div>
          <p className="demo-accounts-desc">
            Click any demo profile to test separate listening histories and live cross-tab feeds:
          </p>
          <div className="demo-accounts-grid">
            {accounts.map(acc => (
              <button 
                key={acc.id}
                type="button" 
                className="demo-account-pill-btn"
                onClick={() => handleQuickDemoLogin(acc)}
                title={`Log in instantly as ${acc.name}`}
              >
                <img src={acc.avatar} alt={acc.name} className="demo-pill-avatar" />
                <div className="demo-pill-info">
                  <span className="demo-pill-name">{acc.name}</span>
                  <span className="demo-pill-email">{acc.email}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-divider-row">
          <span>or continue with your credentials</span>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="auth-tabs-bar">
          <button 
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            <LogIn size={16} />
            <span>Log In</span>
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            <UserPlus size={16} />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          {mode === 'signup' && (
            <div className="auth-form-group">
              <label className="auth-form-label">What should we call you?</label>
              <input 
                type="text" 
                placeholder="Enter your profile name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input-field"
                required={mode === 'signup'}
              />
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-form-label">Email address</label>
            <input 
              type="email" 
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input-field"
              required
              autoFocus
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Password</label>
            <div className="auth-password-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder={mode === 'signup' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input-field password"
                required
              />
              <button 
                type="button" 
                className="auth-toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading || !email.trim() || !password.trim()}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : mode === 'login' ? (
              'Log In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Multi-Session Platform Guidance */}
        <div className="auth-multiplatform-notice">
          <div className="multiplatform-notice-header">
            <Radio size={14} color="#1db954" />
            <span>Multi-Platform & Multi-Tab Isolation Guarantee</span>
          </div>
          <p>
            Each browser tab or window maintains its own independent session. You can open two tabs side-by-side with different accounts (e.g. Nikhil in Tab 1 and Sarah in Tab 2) to see simultaneous playback without clashing!
          </p>
        </div>

        {/* Footer switch */}
        <div className="auth-footer-switch">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button 
                type="button" 
                className="auth-link-text"
                onClick={() => { setMode('signup'); setError(''); }}
              >
                Sign up for Spotify
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                type="button" 
                className="auth-link-text"
                onClick={() => { setMode('login'); setError(''); }}
              >
                Log in instead
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

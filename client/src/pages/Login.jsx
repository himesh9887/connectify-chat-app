import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import heroImage from '../assets/hero.png';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      login({ ...res.data.user, token: res.data.token });
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Demo: test@test.com / password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-story" aria-label="Connectify">
          <img src={heroImage} alt="" className="auth-illustration" />
          <p className="eyebrow">Real-time chats</p>
          <h2>Stay close to every conversation.</h2>
          <p>Fast messages, live presence, and a calmer place to talk.</p>
        </section>

        <div className="auth-card">
          <div className="brand-mark" aria-hidden="true">C</div>
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to Connectify</h1>
          <p className="auth-subtitle">Pick up your chats right where you left them.</p>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </label>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

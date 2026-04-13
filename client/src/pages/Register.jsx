import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import heroImage from '../assets/hero.png';
import '../App.css';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.register(formData);
      login({ ...res.data.user, token: res.data.token });
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Use login with demo account for testing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-story" aria-label="Connectify">
          <img src={heroImage} alt="" className="auth-illustration" />
          <p className="eyebrow">Start fresh</p>
          <h2>Bring your people into one clear space.</h2>
          <p>Quick setup, live status, and conversations that stay organized.</p>
        </section>

        <div className="auth-card">
          <div className="brand-mark" aria-hidden="true">C</div>
          <p className="eyebrow">Create account</p>
          <h1>Join Connectify</h1>
          <p className="auth-subtitle">Set up your profile and start chatting in seconds.</p>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>
              <span>Full name</span>
              <input
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="name"
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="email"
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </label>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

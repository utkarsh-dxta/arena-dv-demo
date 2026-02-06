import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import useDataLayer from '../../hooks/useDataLayer';
import '../Login/Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { trackRegisterPage, trackRegistrationSuccess, trackRegistrationFailure } = useDataLayer();

  // Track register page view
  useEffect(() => {
    trackRegisterPage();
  }, [trackRegisterPage]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      trackRegistrationFailure('passwords_not_match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      trackRegistrationFailure('password_too_short');
      return;
    }

    setLoading(true);

    try {
      const response = await api.registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (response.success || response.user) {
        const userData = response.user || { 
          name: formData.name, 
          email: formData.email,
          id: response.userId || Date.now()
        };
        login(userData);
        trackRegistrationSuccess(userData, 'email');
        navigate('/dashboard');
      } else {
        const errorMsg = response.message || 'Registration failed. Please try again.';
        setError(errorMsg);
        trackRegistrationFailure(errorMsg);
      }
    } catch (err) {
      setError('Registration failed. Please try again later.');
      trackRegistrationFailure('registration_error');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-gradient"></div>
        <div className="auth-grid"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 20C12 15.5817 15.5817 12 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 28C24.4183 28 28 24.4183 28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="4" fill="currentColor"/>
                </svg>
              </div>
              <span>NexTel</span>
            </Link>
            <h1>Create Account</h1>
            <p>Join NexTel and experience premium connectivity</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


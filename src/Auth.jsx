import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Auth.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4546';

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirm_password: '',
    gender: '',
  });

  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname === '/register');
  }, [location]);

  const toggleForm = () => {
    setLoginError('');
    setRegisterError('');
    if (isActive) {
      navigate('/login');
      return;
    }
    navigate('/register');
  };

  const parseResponse = async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await parseResponse(res);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('activeCareerSlug');
      navigate('/home');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setRegisterError('');

    if (registerForm.password.length < 8) {
      setRegisterError('Password must be at least 8 characters');
      return;
    }

    if (registerForm.password !== registerForm.confirm_password) {
      setRegisterError('Passwords do not match');
      return;
    }

    setRegisterLoading(true);

    try {
      // ส่ง gender เป็น null ถ้าไม่ได้เลือก (ไม่ส่ง empty string เพราะ backend ต้องการ *Gender)
      const body = {
        email: registerForm.email,
        password: registerForm.password,
        confirm_password: registerForm.confirm_password,
        gender: registerForm.gender || null,
      };

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await parseResponse(res);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('activeCareerSlug');
      navigate('/home');
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className={`auth-container ${isActive ? 'active' : ''}`}>
      <div className="info-side">
        <div className="info-content login-msg">
          <h1>Hello,<br />Welcome!</h1>
        </div>
        <div className="info-content register-msg">
          <h1>Hello,<br />Let's Start!</h1>
        </div>
      </div>

      <div className="form-side">
        <div className="form-box login-form">
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="input-group animation" style={{ '--li': 1 }}>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="input-group animation" style={{ '--li': 2 }}>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            {loginError && <p className="footer-text animation" style={{ '--li': 3 }}>{loginError}</p>}
            <button type="submit" className="btn animation" style={{ '--li': 4 }} disabled={loginLoading}>
              {loginLoading ? 'Loading...' : 'Login'}
            </button>
            <div className="footer-text animation" style={{ '--li': 5 }}>
              <p>Don't have an account? <span onClick={toggleForm}>Let's create an account</span></p>
            </div>
          </form>
        </div>

        <div className="form-box register-form">
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            <div className="input-group animation" style={{ '--li': 1 }}>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="input-group animation" style={{ '--li': 2 }}>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="input-group animation" style={{ '--li': 3 }}>
              <input
                name="confirm_password"
                type="password"
                placeholder="Confirm-password"
                value={registerForm.confirm_password}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="input-group animation" style={{ '--li': 4 }}>
              <select
                name="gender"
                value={registerForm.gender}
                onChange={handleRegisterChange}
                required
              >
                <option value="" disabled hidden>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            {registerError && <p className="footer-text animation" style={{ '--li': 5 }}>{registerError}</p>}
            <button type="submit" className="btn animation" style={{ '--li': 6 }} disabled={registerLoading}>
              {registerLoading ? 'Loading...' : 'Create Account'}
            </button>
            <div className="footer-text animation" style={{ '--li': 7 }}>
              <p>Have an account? <span onClick={toggleForm}>Login</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
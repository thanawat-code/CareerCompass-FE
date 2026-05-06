import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let user = null;
  try {
    const rawUser = localStorage.getItem('user');
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }

  const profileName = user?.email || 'User';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=143D60&color=ffffff`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('activeCareerSlug');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        CareerCompass
      </Link>
      <div className="nav-menu">
        {token ? (
          <>
            <Link to="/learningpath" className="nav-link">My Learning Path</Link>
            <img src={avatarUrl} alt={profileName} className="nav-avatar" />
            <button type="button" className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-solid">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
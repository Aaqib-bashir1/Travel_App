import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useLogin } from '../LoginContext';
import '../styles/NavBar.css'; // Ensure this CSS file is updated

// Use default parameter for resetSearch
const NavBar = ({ resetSearch = () => {} }) => {
  const { isLoggedIn } = useLogin();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track mobile menu state
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close menu when a link is clicked
  };

  const handleHomeClick = () => {
    resetSearch?.(); // Reset search if the function is provided
    handleLinkClick(); // Also close menu
  };

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState); // Toggle menu on mobile
  };

  // Helper to check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/" id="brand" onClick={handleHomeClick} className={isActive('/') ? 'active' : ''}>
            Your Own Travel Guide
          </Link>
        </div>

        {/* Hamburger button with SVG */}
        <button
          className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="navbar-links-container"
        >
          {/* Inline SVG for the hamburger/close icon */}
          <svg viewBox="0 0 100 80" width="30" height="30">
            {/* Use dark gray for lines to match new design */}
            <rect id="top-line" width="80" height="10" x="10" y="15" rx="5" fill="#2d2d2d"></rect>
            <rect id="middle-line" width="80" height="10" x="10" y="35" rx="5" fill="#2d2d2d"></rect>
            <rect id="bottom-line" width="80" height="10" x="10" y="55" rx="5" fill="#2d2d2d"></rect>
          </svg>
        </button>

        <div
          id="navbar-links-container"
          className={`navbar-links ${isMenuOpen ? 'active' : ''}`}
        >
           <ul>
            <li>
              <Link to="/" onClick={handleHomeClick} className={isActive('/') ? 'active' : ''}>Home</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li><Link to="/create-trip" onClick={handleLinkClick} className={isActive('/create-trip') ? 'active' : ''}>Create Trip</Link></li>
                <li><Link to="/my-trips" onClick={handleLinkClick} className={isActive('/my-trips') ? 'active' : ''}>My Trips</Link></li>
                <li><Link to="/profile" onClick={handleLinkClick} className={isActive('/profile') ? 'active' : ''}>Profile</Link></li>
                <li><Link to="/logout" onClick={handleLinkClick} className={isActive('/logout') ? 'active' : ''}>Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={handleLinkClick} className={isActive('/login') ? 'active' : ''}>Login</Link></li>
                <li><Link to="/register" onClick={handleLinkClick} className={isActive('/register') ? 'active' : ''}>Register</Link></li>
                <li><Link to="/email-verify" onClick={handleLinkClick} className={isActive('/email-verify') ? 'active' : ''}>Verify</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

NavBar.propTypes = {
  resetSearch: PropTypes.func,
};

export default NavBar;

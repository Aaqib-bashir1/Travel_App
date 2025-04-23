
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { useLogin } from '../LoginContext';
// import '../styles/NavBar.css';

// const NavBar = ({ resetSearch = () => {}  }) => {
//   const { isLoggedIn } = useLogin();
//   const [isMenuOpen, setIsMenuOpen] = useState(false); // Track mobile menu state
  
//   const navigate = useNavigate();

//   const handleHomeClick = () => {
//     resetSearch?.(); // Reset search if the function is provided
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(prevState => !prevState); // Toggle menu on mobile
//   };

//   return (
//     <nav className="navbar" aria-label="Main navigation">
//       <div className="navbar-content">
//         <div className="navbar-logo">
//           <Link to="/" id="brand" onClick={handleHomeClick}>
//             Your Own Travel Guide
//           </Link>
//         </div>

//         {/* Hamburger menu for mobile */}
//         <div className="hamburger-menu" onClick={toggleMenu}>
//           <div></div>
//           <div></div>
//           <div></div>
//         </div>

//         <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
//           <ul>
//             <li>
//               <Link to="/" onClick={handleHomeClick}>Home</Link>
//             </li>
//             {isLoggedIn ? (
//               <>
//                 <li><Link to="/create-trip">Create Trip</Link></li>
//                 <li><Link to="/my-trips">My Trips</Link></li>
//                 <li><Link to="/profile">Profile</Link></li>
//                 <li><Link to="/logout">Logout</Link></li>
//               </>
//             ) : (
//               <>
//                 <li><Link to="/login">Login</Link></li>
//                 <li><Link to="/register">Register</Link></li>
//                 <li><Link to="/email-verify">Verify</Link></li>
                
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// NavBar.propTypes = {
//   resetSearch: PropTypes.func,
// };

// NavBar.defaultProps = {
//   resetSearch: () => {},
// };

// export default NavBar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useLogin } from '../LoginContext';
import '../styles/NavBar.css'; // Ensure this CSS file is updated

const NavBar = ({ resetSearch = () => {} }) => {
  const { isLoggedIn } = useLogin();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track mobile menu state

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

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/" id="brand" onClick={handleHomeClick}>
            Your Own Travel Guide
          </Link>
        </div>

        {/* Hamburger button with SVG */}
        <button
          // Add 'open' class when menu is active
          className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="navbar-links-container"
        >
          {/* Inline SVG for the hamburger/close icon */}
          <svg viewBox="0 0 100 80" width="30" height="30">
             {/* Make sure fill color is set, e.g., white */}
            <rect id="top-line" width="80" height="10" x="10" y="15" rx="5" fill="white"></rect>
            <rect id="middle-line" width="80" height="10" x="10" y="35" rx="5" fill="white"></rect>
            <rect id="bottom-line" width="80" height="10" x="10" y="55" rx="5" fill="white"></rect>
          </svg>
        </button>

        <div
          id="navbar-links-container"
          className={`navbar-links ${isMenuOpen ? 'active' : ''}`}
        >
           {/* Rest of the links UL structure remains the same */}
           <ul>
            <li>
              <Link to="/" onClick={handleHomeClick}>Home</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li><Link to="/create-trip" onClick={handleLinkClick}>Create Trip</Link></li>
                <li><Link to="/my-trips" onClick={handleLinkClick}>My Trips</Link></li>
                <li><Link to="/profile" onClick={handleLinkClick}>Profile</Link></li>
                <li><Link to="/logout" onClick={handleLinkClick}>Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
                <li><Link to="/register" onClick={handleLinkClick}>Register</Link></li>
                <li><Link to="/email-verify" onClick={handleLinkClick}>Verify</Link></li>
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

NavBar.defaultProps = {
  resetSearch: () => {},
};

export default NavBar;

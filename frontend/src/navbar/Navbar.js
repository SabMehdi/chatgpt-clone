import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';

function Navbar() {
  const { auth, setAuth } = useAuth();

  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setAuth({ isAuthenticated: true, username: storedUsername });

    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setUsername('');
    setAuth({ isAuthenticated: false, username: '' });

    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Keiken</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {auth.isAuthenticated ? (
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/chat" exact activeClassName="active">
                  Chat
                </NavLink>
              </li>
            </ul>
          ) : null}
         
          {!auth.isAuthenticated ? (
            <ul className="navbar-nav ms-auto"> {/* Use ms-auto to align to the right */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/register" activeClassName="active">
                  Register
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login" activeClassName="active">
                  Login
                </NavLink>
              </li>
            </ul>
          ) : (
            <Dropdown className="ms-auto"> {/* Use ms-auto for the dropdown as well */}
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Hello, {auth.username}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

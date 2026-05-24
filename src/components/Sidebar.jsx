import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Sidebar({ activePage }) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'journey', label: 'My Journey', path: '/journey' },
    { id: 'messages', label: 'Messages', path: '/messages' },
    { id: 'profile', label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="portal-sidebar d-flex flex-column p-3">
      <div className="sidebar-header text-center mb-4 mt-2">
        <img src={logo} alt="ReadBloom Logo" className="sidebar-logo mb-1" />
        <div className="sidebar-portal-tag">STUDENT PORTAL</div>
      </div>

      <div className="sidebar-menu flex-grow-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item-btn w-100 text-start py-3 px-4 mb-3 border-0 ${
              activePage === item.id ? 'active' : ''
            }`}
            data-page={item.id}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

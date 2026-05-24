import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../css/shared.css';

const DEFAULT_USER = {
  name: 'Kai Adamson',
  email: 'adamson@read.bloom',
  section: 'Mabini',
  grade: 'Grade 4',
  level: 'LEVEL 1 READING EXPLORER',
  lastLogin: '4/19/2026'
};

export default function PortalLayout({ activePage, children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    const agreed = localStorage.getItem('agreedToPrivacy') === 'true';

    if (!currentUser) {
      navigate('/');
      return;
    }

    if (!agreed) {
      navigate('/agreement');
      return;
    }

    try {
      setUser(JSON.parse(currentUser));
    } catch (e) {
      localStorage.setItem('currentUser', JSON.stringify(DEFAULT_USER));
      setUser(DEFAULT_USER);
    }
    setLoading(false);
  }, [navigate]);

  const updateUser = (updatedUser) => {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="app" className="portal-layout">
      <Sidebar activePage={activePage} />
      <main className="portal-main">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { user, updateUser });
          }
          return child;
        })}
      </main>
    </div>
  );
}

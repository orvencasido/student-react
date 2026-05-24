import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentIcon from '../assets/icon.png';
import { supabase } from '../lib/supabase';
import '../css/shared.css';
import '../css/profile.css';

export default function Profile({ user }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [section, setSection] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setSection(user.section || '');
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const displayGradeText = user
    ? `${user.grade} Student ${user.level}`
    : 'Grade 4 Student LEVEL 1 READING EXPLORER';

  return (
    <div id="sub-view-profile" className="portal-content-wrapper">
      <div className="profile-layout-container max-w-600 mx-auto d-flex flex-column gap-4 align-items-center">

        {/* Profile Header */}
        <div className="profile-header-card w-100 p-4 shadow-sm bg-white rounded-4 text-center">
          <div className="profile-avatar-container mb-3 position-relative d-inline-block">
            <img src={studentIcon} alt={name} className="profile-avatar border-dark" />
          </div>
          <h2 className="profile-name mb-1 student-fullname-placeholder">{name || 'Kai Adamson'}</h2>
          <div className="profile-grade-tag text-uppercase font-bold student-details-placeholder">
            {displayGradeText}
          </div>
        </div>

        {/* Personal Information */}
        <div className="personal-info-card w-100 p-4 shadow-sm bg-white rounded-4 text-start">
          <h3 className="info-section-title mb-4">Personal Information</h3>
          <div className="d-flex flex-column gap-3">
            <div className="info-row d-flex justify-content-between py-2 border-bottom">
              <div className="info-label font-bold text-muted text-uppercase">Email:</div>
              <div className="info-value font-bold">{email}</div>
            </div>
            <div className="info-row d-flex justify-content-between py-2 border-bottom">
              <div className="info-label font-bold text-muted text-uppercase">Section:</div>
              <div className="info-value font-bold">{section}</div>
            </div>
            <div className="info-row d-flex justify-content-between py-2">
              <div className="info-label font-bold text-muted text-uppercase">Last Log In:</div>
              <div className="info-value font-bold">{user?.lastLogin || '4/19/2026'}</div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="w-100 text-center mt-3">
          <button onClick={handleLogout} id="btn-logout" className="btn btn-logout-submit py-3 w-100 font-bold">Logout</button>
        </div>
      </div>
    </div>
  );
}

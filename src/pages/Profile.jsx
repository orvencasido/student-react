import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentIcon from '../assets/icon.png';
import '../css/shared.css';
import '../css/profile.css';

export default function Profile({ user, updateUser }) {
  const [editMode, setEditMode] = useState(false);
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

  const handleCancel = () => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setSection(user.section || '');
    }
    setEditMode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && section.trim()) {
      updateUser({ ...user, name: name.trim(), email: email.trim(), section: section.trim() });
      setEditMode(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('agreedToPrivacy');
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
        <div className="personal-info-card w-100 p-4 shadow-sm bg-white rounded-4 text-start position-relative">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="info-section-title mb-0">Personal Information</h3>
            {!editMode && (
              <button onClick={() => setEditMode(true)} className="btn btn-outline-secondary btn-sm border-0 rounded-circle" title="Edit Information">
                <i className="bi bi-pencil-fill fs-5"></i>
              </button>
            )}
          </div>

          {!editMode ? (
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
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="edit-name" className="form-label font-bold text-uppercase">Full Name</label>
                <input type="text" className="form-control kid-input" id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="edit-email" className="form-label font-bold text-uppercase">Email</label>
                <input type="email" className="form-control kid-input" id="edit-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="edit-section" className="form-label font-bold text-uppercase">Section</label>
                <input type="text" className="form-control kid-input" id="edit-section" value={section} onChange={(e) => setSection(e.target.value)} required />
              </div>
              <div className="d-flex gap-2 justify-content-end mt-4">
                <button type="button" onClick={handleCancel} className="btn btn-secondary py-2 px-4 rounded-pill">Cancel</button>
                <button type="submit" className="btn btn-success py-2 px-4 rounded-pill font-bold">Save Changes</button>
              </div>
            </form>
          )}
        </div>

        {/* Logout */}
        <div className="w-100 text-center mt-3">
          <button onClick={handleLogout} id="btn-logout" className="btn btn-logout-submit py-3 w-100 font-bold">Logout</button>
        </div>
      </div>
    </div>
  );
}

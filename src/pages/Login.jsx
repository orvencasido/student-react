import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/shared.css';
import '../css/login.css';

export default function Login() {
  const [email, setEmail] = useState('adamson@read.bloom');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    const agreed = localStorage.getItem('agreedToPrivacy') === 'true';
    if (user && agreed) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter both your email and password!');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address!');
      return;
    }

    const initialUserObj = {
      name: 'Kai Adamson',
      email: trimmedEmail,
      section: 'Mabini',
      grade: 'Grade 4',
      level: 'LEVEL 1 READING EXPLORER',
      lastLogin: new Date().toLocaleDateString()
    };

    localStorage.setItem('currentUser', JSON.stringify(initialUserObj));
    navigate('/agreement');
  };

  return (
    <div id="view-login" className="page-container d-flex align-items-center justify-content-center">
      <div className="login-card text-center p-5 shadow">
        <div className="login-logo-container mb-4">
          <img src={logo} alt="ReadBloom Logo" className="login-logo" />
        </div>
        <h1 className="login-title mb-1">Welcome little one!</h1>
        <p className="login-subtitle mb-4">WHERE WORDS BLOOM, MINDS GROW</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3 text-start">
            <label htmlFor="login-email" className="form-label font-bold text-uppercase">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                className="form-control kid-input"
                id="login-email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4 text-start">
            <label htmlFor="login-password" className="form-label font-bold text-uppercase">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input
                type="password"
                className="form-control kid-input"
                id="login-password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-login-submit py-3 px-5 mb-3">LOG IN</button>
        </form>

        {errorMsg && (
          <div id="login-alert" className="alert alert-danger mt-3" role="alert">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}

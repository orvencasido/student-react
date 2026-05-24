import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { ensureStudentProfile } from '../lib/readBloomData';
import '../css/shared.css';
import '../css/login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('Kai Adamson');
  const [section, setSection] = useState('Mabini');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.user) return;
      const profile = await ensureStudentProfile(data.session.user);
      navigate(profile.agreedToPrivacy ? '/dashboard' : '/agreement');
    }).catch(() => {
      supabase.auth.signOut();
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isSupabaseConfigured) {
      setErrorMsg('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter both your email and password!');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address!');
      return;
    }

    setLoading(true);
    try {
      const result = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
        : await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: {
              data: {
                full_name: fullName.trim() || 'Kai Adamson',
                section: section.trim() || 'Mabini',
              },
            },
          });

      if (result.error) throw result.error;

      if (!result.data.session && mode === 'signup') {
        setErrorMsg('Account created. Please check your email to confirm before logging in.');
        return;
      }

      const profile = await ensureStudentProfile(result.data.user);
      navigate(profile.agreedToPrivacy ? '/dashboard' : '/agreement');
    } catch (error) {
      setErrorMsg(error.message || 'Unable to log in right now.');
    } finally {
      setLoading(false);
    }
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
          {mode === 'signup' && (
            <>
              <div className="mb-3 text-start">
                <label htmlFor="signup-name" className="form-label font-bold text-uppercase">Full Name</label>
                <input
                  type="text"
                  className="form-control kid-input"
                  id="signup-name"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="signup-section" className="form-label font-bold text-uppercase">Section</label>
                <input
                  type="text"
                  className="form-control kid-input"
                  id="signup-section"
                  placeholder="Enter your section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </div>
            </>
          )}
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

          <button type="submit" className="btn btn-login-submit py-3 px-5 mb-3" disabled={loading}>
            {loading ? 'PLEASE WAIT...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <button
          type="button"
          className="btn btn-link font-bold text-decoration-none"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setErrorMsg('');
          }}
        >
          {mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Log in'}
        </button>

        {errorMsg && (
          <div id="login-alert" className="alert alert-danger mt-3" role="alert">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}

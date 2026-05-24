import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { ensureStudentProfile } from '../lib/readBloomData';
import '../css/shared.css';

export default function PortalLayout({ activePage, children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      navigate('/');
      return;
    }

    let mounted = true;

    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session?.user) {
          navigate('/');
          return;
        }

        const profile = await ensureStudentProfile(data.session.user);
        if (!profile.agreedToPrivacy) {
          navigate('/agreement');
          return;
        }

        if (mounted) setUser(profile);
      } catch (error) {
        await supabase.auth.signOut();
        navigate('/');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();
    return () => { mounted = false; };
  }, [navigate]);

  const updateUser = (updatedUser) => {
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

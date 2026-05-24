import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Agreement from './pages/Agreement';
import Dashboard from './pages/Dashboard';
import Journey from './pages/Journey';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Quest from './pages/Quest';
import PortalLayout from './components/PortalLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route path="/quest" element={<Quest />} />

        {/* Portal routes (wrapped in sidebar layout) */}
        <Route path="/dashboard" element={
          <PortalLayout activePage="dashboard">
            <Dashboard />
          </PortalLayout>
        } />
        <Route path="/journey" element={
          <PortalLayout activePage="journey">
            <Journey />
          </PortalLayout>
        } />
        <Route path="/messages" element={
          <PortalLayout activePage="messages">
            <Messages />
          </PortalLayout>
        } />
        <Route path="/profile" element={
          <PortalLayout activePage="profile">
            <Profile />
          </PortalLayout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

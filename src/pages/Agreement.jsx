import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/shared.css';
import '../css/agreement.css';

export default function Agreement() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) navigate('/');
  }, [navigate]);

  const handleAgree = () => {
    localStorage.setItem('agreedToPrivacy', 'true');
    navigate('/dashboard');
  };

  const handleDisagree = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('agreedToPrivacy');
    navigate('/');
  };

  return (
    <div id="view-agreement" className="page-container d-flex align-items-center justify-content-center">
      <div className="agreement-card text-center p-5 shadow">
        <div className="agreement-shield mb-3">
          <div className="shield-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shield-check text-success">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="m9 11 2 2 4-4"></path>
            </svg>
          </div>
        </div>
        <h1 className="agreement-title mb-4">Safety & Privacy Agreement</h1>
        <p className="agreement-subtitle mb-4">To help our teachers monitor progress and pronunciation, ReadBloom uses the camera and microphone during learning sessions.</p>

        <div className="agreement-list-card text-start p-4 mb-4 shadow-sm">
          <div className="agreement-item d-flex align-items-start mb-4">
            <div className="agreement-item-icon bg-light-blue p-2 rounded-3 me-3 text-primary">
              <i className="bi bi-camera-video-fill fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-1">Engagement Monitoring: <span className="fw-normal text-muted">The camera helps teachers see if students are focused during reading activities.</span></h5>
            </div>
          </div>

          <div className="agreement-item d-flex align-items-start mb-4">
            <div className="agreement-item-icon bg-light-danger p-2 rounded-3 me-3 text-danger">
              <i className="bi bi-mic-fill fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-1">Oral Reading: <span className="fw-normal text-muted">The microphone is used to assess pronunciation and reading speed during assessments.</span></h5>
            </div>
          </div>

          <div className="agreement-item d-flex align-items-start">
            <div className="agreement-item-icon bg-light-success p-2 rounded-3 me-3 text-success">
              <i className="bi bi-shield-lock-fill fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-1">Secure Storage: <span className="fw-normal text-muted">Recordings are processed privately and are only viewable by assigned teachers for academic support.</span></h5>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
          <button onClick={handleAgree} className="btn btn-agree-submit py-3 px-4">I Agree, Let's Bloom!</button>
          <button onClick={handleDisagree} className="btn btn-disagree-submit py-3 px-4">No thanks, Keep off</button>
        </div>

        <p className="parent-consent-text text-uppercase tracking-wider">Parental Consent Required</p>
      </div>
    </div>
  );
}

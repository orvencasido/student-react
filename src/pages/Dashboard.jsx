import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentIcon from '../assets/icon.png';
import '../css/shared.css';
import '../css/dashboard.css';

export default function Dashboard({ user }) {
  const [book1Completed, setBook1Completed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const completed = localStorage.getItem('book1Completed') === 'true';
    setBook1Completed(completed);
  }, []);

  const firstName = user ? user.name.split(' ')[0] : 'Kai';
  const levelText = user ? user.level : 'LEVEL 1 READING EXPLORER';

  return (
    <div id="sub-view-dashboard" className="portal-content-wrapper">
      {/* Welcome Header Card */}
      <div className="welcome-card d-flex align-items-center p-4 mb-4 shadow-sm bg-white">
        <div className="student-avatar-container me-4">
          <img src={studentIcon} alt="Student Photo" className="student-avatar border-green" />
        </div>
        <div className="welcome-text">
          <h1 className="welcome-title mb-1">
            Welcome, <span className="student-name-placeholder">{firstName}</span>! <span className="sun-emoji">☀️</span>
          </h1>
          <div className="welcome-subtitle text-uppercase font-bold student-level-placeholder">
            {levelText}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="row g-4">
        {/* Left: Book Quests */}
        <div className="col-lg-7">
          <div className="quest-list-card p-4 shadow-sm bg-white h-100 d-flex flex-column gap-3">
            {/* Book 1 */}
            <div className="book-row active-book d-flex justify-content-between align-items-center p-3 rounded-4">
              <div>
                <h4 className="book-title mb-1">The Two Best Friends</h4>
                <div className="book-number text-uppercase font-bold">Book 1</div>
              </div>
              <button onClick={() => navigate('/quest')} className="btn btn-start-quest font-bold py-2 px-4 rounded-pill">
                <i className="bi bi-stars me-1"></i> {book1Completed ? 'Re-start Quest' : 'Start Quest'}
              </button>
            </div>

            {/* Book 2 */}
            <div className={`book-row ${book1Completed ? 'active-book' : 'locked-book'} d-flex justify-content-between align-items-center p-3 rounded-4`}>
              <div>
                <h4 className={`book-title mb-1 ${book1Completed ? '' : 'text-muted'}`}>The Little Red Riding Hood</h4>
                <div className={`book-number text-uppercase font-bold ${book1Completed ? '' : 'text-muted'}`}>Book 2</div>
              </div>
              {book1Completed ? (
                <button className="btn btn-start-quest font-bold py-2 px-4 rounded-pill">
                  <i className="bi bi-stars me-1"></i> Start Quest
                </button>
              ) : (
                <div className="lock-icon text-muted pe-3"><i className="bi bi-lock-fill fs-4"></i></div>
              )}
            </div>

            {/* Book 3 */}
            <div className="book-row locked-book d-flex justify-content-between align-items-center p-3 rounded-4">
              <div>
                <h4 className="book-title text-muted mb-1">The Three Little Pigs</h4>
                <div className="book-number text-uppercase font-bold text-muted">Book 3</div>
              </div>
              <div className="lock-icon text-muted pe-3"><i className="bi bi-lock-fill fs-4"></i></div>
            </div>

            {/* Book 4 */}
            <div className="book-row locked-book d-flex justify-content-between align-items-center p-3 rounded-4">
              <div>
                <h4 className="book-title text-muted mb-1">The Turtle and the Rabbit</h4>
                <div className="book-number text-uppercase font-bold text-muted">Book 4</div>
              </div>
              <div className="lock-icon text-muted pe-3"><i className="bi bi-lock-fill fs-4"></i></div>
            </div>
          </div>
        </div>

        {/* Right: Skills & Achievements */}
        <div className="col-lg-5">
          <div className="stats-panel-card p-4 shadow-sm bg-white h-100 d-flex flex-column justify-content-between gap-4">
            <div>
              <h3 className="panel-section-title mb-3">Skills Focus</h3>
              <div className="row g-3">
                <div className="col-6">
                  <div className="skill-box skill-reading p-3 text-center rounded-4 h-100 d-flex flex-column justify-content-center">
                    <h4 className="skill-name mb-1">Reading</h4>
                    <div className="skill-level text-uppercase font-bold">Level 1</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="skill-box skill-vocabulary p-3 text-center rounded-4 h-100 d-flex flex-column justify-content-center">
                    <h4 className="skill-name mb-1">Vocabulary</h4>
                    <div className="skill-level text-uppercase font-bold">Level 2</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="panel-section-title mb-3">Achievements</h3>
              <div className="row g-3">
                <div className="col-6">
                  <div className="achievement-box ach-wordmaster p-3 text-center rounded-4 h-100 d-flex flex-column justify-content-center">
                    <h4 className="ach-name mb-1">Word Master</h4>
                    <div className="ach-level text-uppercase font-bold">Level 2</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="achievement-box ach-comp p-3 text-center rounded-4 h-100 d-flex flex-column justify-content-center">
                    <h4 className="ach-name mb-1">Comprehension</h4>
                    <div className="ach-level text-uppercase font-bold">Level 2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentIcon from '../assets/icon.png';
import { loadDashboard } from '../lib/readBloomData';
import '../css/shared.css';
import '../css/dashboard.css';

export default function Dashboard({ user }) {
  const [overview, setOverview] = useState({
    books: [],
    skills: [],
    achievements: [],
    levelText: 'LEVEL 1 READING EXPLORER',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    loadDashboard(user.id)
      .then(setOverview)
      .catch((error) => console.error('Unable to load dashboard', error));
  }, [user?.id]);

  const firstName = user ? user.name.split(' ')[0] : 'Kai';
  const levelText = overview.levelText || user?.level || 'LEVEL 1 READING EXPLORER';

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
            {overview.books.map((book) => (
              <div key={book.id} className={`book-row ${book.unlocked ? 'active-book' : 'locked-book'} d-flex justify-content-between align-items-center p-3 rounded-4`}>
                <div>
                  <h4 className={`book-title mb-1 ${book.unlocked ? '' : 'text-muted'}`}>{book.title}</h4>
                  <div className={`book-number text-uppercase font-bold ${book.unlocked ? '' : 'text-muted'}`}>Book {book.book_number}</div>
                </div>
                {book.unlocked ? (
                  <button onClick={() => navigate(`/quest/${book.id}`)} className="btn btn-start-quest font-bold py-2 px-4 rounded-pill">
                    <i className="bi bi-stars me-1"></i> {book.status === 'completed' ? 'Re-start' : 'Start'}
                  </button>
                ) : (
                  <div className="lock-icon text-muted pe-3"><i className="bi bi-lock-fill fs-4"></i></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Skills & Achievements */}
        <div className="col-lg-5">
          <div className="stats-panel-card p-4 shadow-sm bg-white h-100 d-flex flex-column justify-content-between gap-4">
            <div>
              <h3 className="panel-section-title mb-3">Skills Focus</h3>
              <div className="row g-3">
                {overview.skills.map((skill) => (
                  <div className="col-6" key={skill.name}>
                    <div className={`skill-box skill-${skill.kind} p-3 text-center rounded-4 h-100 d-flex flex-column justify-content-center`}>
                      <h4 className="skill-name mb-1">{skill.name}</h4>
                      <div className="skill-level text-uppercase font-bold">Level {skill.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="panel-section-title mb-3">Achievements</h3>
              <div className="row g-3">
                {overview.achievements.map((achievement) => (
                  <div className="col-6" key={achievement.name}>
                    <div className={`achievement-box ach-${achievement.kind} p-1 text-center rounded-4 h-100 d-flex flex-column justify-content-center`}>
                      <h4 className="ach-name mb-1">{achievement.name}</h4>
                      <div className="ach-level text-uppercase font-bold">Level {achievement.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

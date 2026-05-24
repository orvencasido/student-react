import React, { useEffect, useState } from 'react';
import { loadJourney } from '../lib/readBloomData';
import '../css/shared.css';
import '../css/journey.css';

export default function Journey({ user }) {
  const [stats, setStats] = useState({
    learning_completed: 0,
    learning_required: 0,
    days_streak: 1,
    achievement: 'LEVEL 1 READING EXPLORER',
  });

  useEffect(() => {
    if (!user?.id) return;
    loadJourney(user.id)
      .then(setStats)
      .catch((error) => console.error('Unable to load journey', error));
  }, [user?.id]);

  return (
    <div id="sub-view-journey" className="portal-content-wrapper">
      <div className="journey-stats-wrapper d-flex flex-column gap-3">
        {/* Learning Completed */}
        <div className="stat-pill d-flex align-items-center justify-content-between">
          <span className="stat-label">Learning Completed</span>
          <span className="stat-value" id="stat-learning">{stats.learning_completed}/{stats.learning_required}</span>
        </div>

        {/* Days Streak */}
        <div className="stat-pill d-flex align-items-center justify-content-between">
          <span className="stat-label">Days Streak</span>
          <span className="stat-value" id="stat-streak">{stats.days_streak} days</span>
        </div>

        {/* Achievement */}
        <div className="stat-pill d-flex align-items-center justify-content-between">
          <span className="stat-label">Achievement</span>
          <span className="stat-value" id="stat-achievement">{stats.achievement}</span>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import '../css/shared.css';
import '../css/journey.css';

export default function Journey() {
  return (
    <div id="sub-view-journey" className="portal-content-wrapper">
      <div className="journey-stats-wrapper d-flex flex-column gap-3">
        {/* Learning Completed */}
        <div className="stat-pill d-flex align-items-center justify-content-between">
          <span className="stat-label">Learning Completed</span>
          <span className="stat-value" id="stat-learning">20/40</span>
        </div>

        {/* Days Streak */}
        <div className="stat-pill d-flex align-items-center justify-content-between">
          <span className="stat-label">Days Streak</span>
          <span className="stat-value" id="stat-streak">7 days</span>
        </div>

        {/* Achievement */}
        <div className="stat-pill d-flex align-items-center justify-content-between">
          <span className="stat-label">Achievement</span>
          <span className="stat-value" id="stat-achievement">EXPLORER</span>
        </div>
      </div>
    </div>
  );
}

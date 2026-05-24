import React, { useState, useEffect } from 'react';
import { DEFAULT_REVIEW, loadLatestReview } from '../lib/readBloomData';
import '../css/shared.css';
import '../css/messages.css';

export default function Messages({ user }) {
  const [review, setReview] = useState(DEFAULT_REVIEW);
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: '',
    tipText: '',
    top: 0,
    left: 0
  });

  useEffect(() => {
    if (!user?.id) return;
    loadLatestReview(user.id)
      .then(setReview)
      .catch((error) => console.error('Unable to load reading review', error));
  }, [user?.id]);

  useEffect(() => {
    const handleWindowClick = () => {
      setTooltip(prev => ({ ...prev, visible: false }));
    };
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  const handleWordClick = (e, tipText, text) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Position the speech tooltip box centered above the clicked element
    const tooltipHeight = 110;
    setTooltip({
      visible: true,
      text: text,
      tipText: tipText,
      top: rect.top + scrollTop - tooltipHeight,
      left: rect.left + scrollLeft - 10
    });
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!tooltip.text) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // cancel current speech

      const utterance = new SpeechSynthesisUtterance(tooltip.text);
      utterance.rate = 0.8; // child-friendly reading speed
      utterance.pitch = 1.2; // friendly voice pitch
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const studentFullName = user ? user.name : 'Kai Adamson';
  const counts = review.counts || {};
  const countFor = (type) => counts[type] ?? 0;

  return (
    <div id="sub-view-messages" className="portal-content-wrapper">
      <div className="row g-4 align-items-stretch">
        {/* Left Column: Reading Review Details */}
        <div className="col-lg-8">
          <div className="reading-review-card p-4 shadow-sm bg-white rounded-4 h-100 d-flex flex-column">
            {/* Header metadata */}
            <div className="review-meta d-flex flex-column mb-3 text-start">
              <div className="meta-item"><span className="font-bold">From:</span> {review.teacher_name}</div>
              <div className="meta-item">
                <span className="font-bold">Name: </span>
                <span className="student-fullname-placeholder">{studentFullName}</span>
              </div>
            </div>

            <h2 className="review-title text-center mb-1">{review.title}</h2>
            <h3 className="review-subtitle text-center mb-4">{review.book_title}</h3>

            {/* Colored Interactive Story Text Box */}
            <div className="story-text-container p-4 mb-4 rounded-4 shadow-sm bg-light">
              <p className="story-passage lh-lg fs-5 text-dark" id="story-passage">
                {review.passage_parts.map((part, index) => {
                  const textWithBreaks = part.text.split('\n').map((piece, pieceIndex, pieces) => (
                    <React.Fragment key={`${index}-${pieceIndex}`}>
                      {piece}
                      {pieceIndex < pieces.length - 1 && <><br /><br /></>}
                    </React.Fragment>
                  ));

                  if (!part.type) return <React.Fragment key={index}>{textWithBreaks}</React.Fragment>;

                  return (
                    <span
                      key={index}
                      className={`word-group word-${part.type}`}
                      data-error={part.type}
                      onClick={(e) => handleWordClick(e, part.tip, part.text.trim())}
                    >
                      {textWithBreaks}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Teacher Report Box */}
            <div className="teacher-report-box mt-auto p-4 border rounded-4 shadow-sm bg-white">
              <h4 className="report-title mb-4">Teacher Report</h4>
              <div className="row g-3">
                {/* Card 1: Jumped Words */}
                <div className="col-6 col-md-3">
                  <div className="report-stat-card border-green text-center p-3 rounded-4">
                    <div className="stat-label text-success text-uppercase font-bold">Jumped Words</div>
                    <div className="stat-number text-success display-6 fw-bold">{countFor('jumped')}</div>
                  </div>
                </div>
                {/* Card 2: Repetition */}
                <div className="col-6 col-md-3">
                  <div className="report-stat-card border-orange text-center p-3 rounded-4">
                    <div className="stat-label text-warning text-uppercase font-bold">Word Repetition</div>
                    <div className="stat-number text-warning display-6 fw-bold">{countFor('repetition')}</div>
                  </div>
                </div>
                {/* Card 3: Self Correction */}
                <div className="col-6 col-md-3">
                  <div className="report-stat-card border-teal text-center p-3 rounded-4">
                    <div className="stat-label text-info text-uppercase font-bold">Self Correction</div>
                    <div className="stat-number text-info display-6 fw-bold">{countFor('self-correct')}</div>
                  </div>
                </div>
                {/* Card 4: Mis-pronunciation */}
                <div className="col-6 col-md-3">
                  <div className="report-stat-card border-gold text-center p-3 rounded-4">
                    <div className="stat-label text-primary text-uppercase font-bold">Mispronunciation</div>
                    <div className="stat-number text-primary display-6 fw-bold">{countFor('mispronounce')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Teacher Feedback */}
        <div className="col-lg-4">
          <div className="teacher-feedback-card p-4 shadow-sm bg-white rounded-4 h-100 d-flex flex-column text-start">
            <h3 className="feedback-title mb-4">Teacher Feedback</h3>

            <div className="feedback-body-text fs-5 lh-lg mb-5 text-secondary">
              {review.feedback}
            </div>

            <div className="feedback-signature mt-auto text-end font-bold text-dark fs-5">
              {review.signature}
            </div>
          </div>
        </div>
      </div>

      {/* Speech Word Popover Tooltip Box (Rendered absolutely at top/left coords) */}
      <div
        id="word-tooltip-box"
        className={`word-tooltip shadow-lg ${tooltip.visible ? '' : 'd-none'}`}
        style={{
          top: `${tooltip.top}px`,
          left: `${tooltip.left}px`,
          position: 'absolute',
          zIndex: 1050
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tooltip-arrow"></div>
        <div className="tooltip-body-content p-2 text-center">
          <div id="tooltip-text" className="font-bold mb-2">{tooltip.tipText}</div>
          <div className="d-flex justify-content-center gap-2">
            <button
              onClick={handleSpeak}
              className="btn btn-sm btn-primary py-1 px-2 rounded-pill font-bold"
              id="btn-speak-word"
            >
              <i className="bi bi-volume-up-fill"></i> Speak
            </button>
            <button
              onClick={handleDismiss}
              className="btn btn-sm btn-outline-secondary py-1 px-2 rounded-pill font-bold"
              id="btn-close-tooltip"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

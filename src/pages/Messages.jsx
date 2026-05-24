import React, { useState, useEffect } from 'react';
import '../css/shared.css';
import '../css/messages.css';

export default function Messages({ user }) {
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: '',
    tipText: '',
    top: 0,
    left: 0
  });

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
    
    let textToSpeak = tooltip.text;
    if (textToSpeak.toLowerCase().includes('once there were')) {
      textToSpeak = 'Once there were two friends a';
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // cancel current speech
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
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

  return (
    <div id="sub-view-messages" className="portal-content-wrapper">
      <div className="row g-4 align-items-stretch">
        {/* Left Column: Reading Review Details */}
        <div className="col-lg-8">
          <div className="reading-review-card p-4 shadow-sm bg-white rounded-4 h-100 d-flex flex-column">
            {/* Header metadata */}
            <div className="review-meta d-flex flex-column mb-3 text-start">
              <div className="meta-item"><span className="font-bold">From:</span> Ma'am Ana</div>
              <div className="meta-item">
                <span className="font-bold">Name: </span>
                <span className="student-fullname-placeholder">{studentFullName}</span>
              </div>
            </div>

            <h2 className="review-title text-center mb-1">Reading Review</h2>
            <h3 className="review-subtitle text-center mb-4">The Two Best Friends</h3>

            {/* Colored Interactive Story Text Box */}
            <div className="story-text-container p-4 mb-4 rounded-4 shadow-sm bg-light">
              <p className="story-passage lh-lg fs-5 text-dark" id="story-passage">
                <span 
                  className="word-group word-jump" 
                  data-error="jumped" 
                  onClick={(e) => handleWordClick(e, "Jumped word: Kai skipped 'Once there were two friends a'", "Once there were two friends a")}
                >
                  Once there were two friends a
                </span>{' '}
                <span 
                  className="word-group word-mispronounce" 
                  data-error="mispronounce" 
                  onClick={(e) => handleWordClick(e, "Mispronounced: Read 'squirrel' as 'skwirl'", "squirrel")}
                >
                  squirrel
                </span>{' '}
                and a puppy. They{' '}
                <span 
                  className="word-group word-repetition" 
                  data-error="repetition" 
                  onClick={(e) => handleWordClick(e, "Repeated twice: 'used to'", "used to")}
                >
                  used to
                </span>{' '}
                <span 
                  className="word-group word-repetition" 
                  data-error="repetition" 
                  onClick={(e) => handleWordClick(e, "Repeated: 'live'", "live")}
                >
                  live
                </span>{' '}
                and play together. The squirrel was very sporty and always won the game. The puppy used to feel bad and{' '}
                <span 
                  className="word-group word-repetition" 
                  data-error="repetition" 
                  onClick={(e) => handleWordClick(e, "Repeated: 'thought'", "thought")}
                >
                  thought
                </span>{' '}
                that it was of no use.{' '}
                <br /><br />
                One day, it started raining{' '}
                <span 
                  className="word-group word-repetition" 
                  data-error="repetition" 
                  onClick={(e) => handleWordClick(e, "Repeated: 'heavily'", "heavily")}
                >
                  heavily
                </span>
                . The squirrel was in{' '}
                <span 
                  className="word-group word-self-correct" 
                  data-error="self-correct" 
                  onClick={(e) => handleWordClick(e, "Self-corrected: 'high'", "high")}
                >
                  high
                </span>{' '}
                <span 
                  className="word-group word-self-correct" 
                  data-error="self-correct" 
                  onClick={(e) => handleWordClick(e, "Self-corrected: 'antics'", "antics")}
                >
                  antics
                </span>{' '}
                but{' '}
                <span 
                  className="word-group word-self-correct" 
                  data-error="self-correct" 
                  onClick={(e) => handleWordClick(e, "Self-corrected: 'suddenly'", "suddenly")}
                >
                  suddenly
                </span>
                ,{' '}
                <span 
                  className="word-group word-jump" 
                  data-error="jumped" 
                  onClick={(e) => handleWordClick(e, "Jumped words: Kai skipped 'lost his balance and fell in the rain water.'", "lost his balance and fell in the rain water.")}
                >
                  lost his balance and fell in the rain water.
                </span>
                <br /><br />
                He{' '}
                <span 
                  className="word-group word-mispronounce" 
                  data-error="mispronounce" 
                  onClick={(e) => handleWordClick(e, "Mispronounced: Read 'called' as 'col-ed'", "called")}
                >
                  called
                </span>{' '}
                his friend, the puppy for help. The puppy{' '}
                <span 
                  className="word-group word-mispronounce" 
                  data-error="mispronounce" 
                  onClick={(e) => handleWordClick(e, "Mispronounced: Read 'came' as 'kayme'", "came")}
                >
                  came
                </span>{' '}
                to his rescue. The squirrel climbed on its back and{' '}
                <span 
                  className="word-group word-mispronounce" 
                  data-error="mispronounce" 
                  onClick={(e) => handleWordClick(e, "Mispronounced: Read 'reached' as 'reach-ed'", "reached")}
                >
                  reached
                </span>{' '}
                a safe place. He thanked his friend for saving his life.
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
                    <div className="stat-number text-success display-6 fw-bold">2</div>
                  </div>
                </div>
                {/* Card 2: Repetition */}
                <div className="col-6 col-md-3">
                  <div className="report-stat-card border-orange text-center p-3 rounded-4">
                    <div className="stat-label text-warning text-uppercase font-bold">Repetition</div>
                    <div className="stat-number text-warning display-6 fw-bold">3</div>
                  </div>
                </div>
                {/* Card 3: Self Correction */}
                <div className="col-6 col-md-3">
                  <div className="report-stat-card border-teal text-center p-3 rounded-4">
                    <div className="stat-label text-info text-uppercase font-bold">Self Correction</div>
                    <div className="stat-number text-info display-6 fw-bold">4</div>
                  </div>
                </div>
                {/* Card 4: Mis-pronunciation */}
                <div className="col-6 col-md-3">
                  <div className="report-stat-card border-gold text-center p-3 rounded-4">
                    <div className="stat-label text-primary text-uppercase font-bold">Mis-pronunciation</div>
                    <div className="stat-number text-primary display-6 fw-bold">5</div>
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
              Great job Kai, You read with expression and understand the story well. Try to slow down a little and pronounce "squirrel" and "together" more clearly. Practice more words that you are not familiar.
            </div>

            <div className="feedback-signature mt-auto text-end font-bold text-dark fs-5">
              - Keep reading and keep blooming!
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

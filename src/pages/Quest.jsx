import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/shared.css';
import '../css/quest.css';

const QUESTIONS = [
  {
    exercise: 'EXERCISE 1',
    question: 'Who are the two best friends in the Story?',
    choices: ['Squirrel and Puppy', 'Cat and Donkey', 'Turtle and Rabbit'],
    answer: 'Squirrel and Puppy',
  },
  {
    exercise: 'EXERCISE 2',
    question: 'Who saved the squirrel?',
    choices: ['Puppy', 'Cat', 'Rabbit', 'Turtle'],
    answer: 'Puppy',
  },
  {
    exercise: 'EXERCISE 3',
    question: 'Where did the squirrel fall?',
    choices: ['In the river', 'In the rain water', 'From a tree', 'In the mud'],
    answer: 'In the rain water',
  },
];

export default function Quest() {
  const [step, setStep] = useState('camera');
  const [mediaStream, setMediaStream] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const cameraPreviewRef = useRef(null);
  const readingCameraRef = useRef(null);
  const previewVideoRef = useRef(null);

  const initCamera = async () => {
    try {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
    } catch (err) {
      alert('Please allow camera and microphone access to continue.');
    }
  };

  useEffect(() => {
    if (step === 'camera') initCamera();
    return () => { if (mediaStream) mediaStream.getTracks().forEach(t => t.stop()); };
  }, [step]);

  useEffect(() => {
    if (!mediaStream) return;
    if (step === 'camera' && cameraPreviewRef.current) cameraPreviewRef.current.srcObject = mediaStream;
    if (step === 'reading' && readingCameraRef.current) readingCameraRef.current.srcObject = mediaStream;
    if (step === 'preview' && previewVideoRef.current) previewVideoRef.current.srcObject = mediaStream;
  }, [mediaStream, step]);

  const stopStream = () => {
    if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); setMediaStream(null); }
  };

  const handleStartOver = () => {
    setCurrentQuestion(0); setCorrectCount(0); setSelectedAnswer(null); setStep('camera');
  };

  const handleUploadConfirm = () => {
    setShowUploadModal(false); stopStream();
    setStep('quiz'); setCurrentQuestion(0); setCorrectCount(0); setSelectedAnswer(null);
  };

  const handleNextQuiz = () => {
    if (!selectedAnswer) { setShake(true); setTimeout(() => setShake(false), 400); return; }
    if (selectedAnswer === QUESTIONS[currentQuestion].answer) setCorrectCount(prev => prev + 1);
    const next = currentQuestion + 1;
    if (next < QUESTIONS.length) { setCurrentQuestion(next); setSelectedAnswer(null); }
    else setStep('done');
  };

  const handleTurnIn = () => {
    localStorage.setItem('book1Completed', 'true');
    navigate('/dashboard');
  };

  const currentQ = QUESTIONS[currentQuestion];
  const progressPct = (currentQuestion / QUESTIONS.length) * 100;

  return (
    <div className="quest-container">

      {/* STEP 1: CAMERA CHECK */}
      {step === 'camera' && (
        <div id="step-camera" className="quest-step active">
          <div className="quest-bg">
            <div className="camera-check-wrapper">
              <div className="camera-box-container">
                <video ref={cameraPreviewRef} id="camera-preview" autoPlay playsInline muted></video>
                <div className="camera-frame"></div>
                <div className="mic-bar-row" id="mic-bars">
                  <span className="mic-icon">🎤</span>
                  {[20,30,40,50,40].map((h,i) => <div key={i} className="mic-bar" style={{height:`${h}px`}}></div>)}
                  {[35,28,22,18].map((h,i) => <div key={i} className="mic-bar mic-bar-green" style={{height:`${h}px`}}></div>)}
                </div>
              </div>
              <div className="camera-controls">
                <button onClick={() => setStep('reading')} className="btn-start" id="btn-camera-start">
                  <span className="start-arrow">▶</span> START
                </button>
                <div className="time-hint"><strong>3 minutes</strong> to read</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: READING PASSAGE */}
      {step === 'reading' && (
        <div id="step-reading" className="quest-step active">
          <div className="quest-bg reading-bg">
            <div className="reading-layout">
              <div className="reading-camera-col">
                <div className="reading-cam-frame">
                  <video ref={readingCameraRef} id="reading-camera" autoPlay playsInline muted></video>
                </div>
              </div>
              <div className="reading-content-col">
                <div className="reading-tabs">
                  <div className="tab-item active">Read Aloud</div>
                  <div className="tab-item recording-tab"><span className="rec-dot"></span> Recording</div>
                </div>
                <div className="passage-card">
                  <h2 className="passage-title">THE TWO BEST FRIENDS</h2>
                  <p>Once there were two friends a squirrel and a puppy. They used to live and play together. The squirrel was very sporty and always won the game. The puppy used to feel bad and thought that it was of no use.</p>
                  <p>One day, it started raining heavily. The squirrel was in high spirits. He started doing antics but suddenly, lost his balance and fell in the rain water.</p>
                  <p>He called his friend, the puppy for help. The puppy came to his rescue. The squirrel climbed on its back and reached a safe place. He thanked his friend for saving his life.</p>
                </div>
                <div className="text-center mt-3">
                  <button onClick={() => setStep('preview')} className="btn-done" id="btn-reading-done">I'm Done</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: VIDEO PREVIEW */}
      {step === 'preview' && (
        <div id="step-preview" className="quest-step active">
          <header className="quest-header">
            <img src={logo} alt="ReadBloom Logo" className="header-logo" />
            <span className="header-tag">STUDENT PORTAL</span>
          </header>
          <div className="quest-bg preview-bg">
            <div className="preview-wrapper">
              <h2 className="preview-title">Preview your Video</h2>
              <div className="preview-cam-frame">
                <video ref={previewVideoRef} id="preview-video" autoPlay playsInline muted></video>
              </div>
              <div className="preview-actions">
                <button onClick={handleStartOver} className="btn-start-over" id="btn-start-over">↺ Start Over</button>
                <button onClick={() => setShowUploadModal(true)} className="btn-im-done" id="btn-im-done">✓ I'm Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div id="upload-modal" className="upload-modal-overlay">
          <div className="upload-modal-box">
            <div className="upload-icon">⬆</div>
            <h3>Upload your reading?</h3>
            <p>Your video will be submitted to your teacher.</p>
            <div className="upload-modal-actions">
              <button onClick={() => setShowUploadModal(false)} className="btn-upload-cancel" id="btn-upload-cancel">Cancel</button>
              <button onClick={handleUploadConfirm} className="btn-upload-confirm" id="btn-upload-confirm">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: QUIZ */}
      {step === 'quiz' && (
        <div id="step-quiz" className="quest-step active">
          <header className="quest-header">
            <img src={logo} alt="ReadBloom Logo" className="header-logo" />
            <span className="header-tag">STUDENT PORTAL</span>
          </header>
          <div className="quest-bg quiz-bg">
            <div className="quiz-wrapper">
              <div className="quiz-progress-row">
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }}></div>
                </div>
                <div className="quiz-dots">
                  {QUESTIONS.map((_, i) => (
                    <div key={i} className={`quiz-dot ${i < currentQuestion ? 'answered' : ''}`}></div>
                  ))}
                </div>
                <div className="quiz-exercise-label">{currentQ.exercise}</div>
              </div>
              <div className="quiz-question-text">{currentQ.question}</div>
              <div className={`quiz-choices ${shake ? 'shake' : ''}`}>
                {currentQ.choices.map((choice, i) => (
                  <button key={i} onClick={() => setSelectedAnswer(choice)}
                    className={`choice-btn ${selectedAnswer === choice ? 'selected' : ''}`}>
                    {choice}
                  </button>
                ))}
              </div>
              <div className="text-center mt-4">
                <button onClick={handleNextQuiz} className="btn-quiz-next">Next</button>
              </div>
            </div>
          </div>
          <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} } .shake{animation:shake 0.3s ease;}`}</style>
        </div>
      )}

      {/* STEP 5: DONE */}
      {step === 'done' && (
        <div id="step-done" className="quest-step active">
          <header className="quest-header">
            <img src={logo} alt="ReadBloom Logo" className="header-logo" />
            <span className="header-tag">STUDENT PORTAL</span>
          </header>
          <div className="quest-bg done-bg">
            <div className="done-wrapper">
              <div className="done-star">⭐</div>
              <h2 className="done-title">Great Job!</h2>
              <p className="done-subtitle">You finished reading <strong>The Two Best Friends</strong> and answered all the questions!</p>
              <div className="done-score-box">
                <span className="done-score">{correctCount}/{QUESTIONS.length}</span>
                <span className="done-score-label">Correct</span>
              </div>
              <div className="done-actions">
                <button onClick={handleStartOver} className="btn-start-over-done" id="btn-restart">↺ Start Over</button>
                <button onClick={handleTurnIn} className="btn-turn-in" id="btn-turn-in">Turn It In 🚀</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

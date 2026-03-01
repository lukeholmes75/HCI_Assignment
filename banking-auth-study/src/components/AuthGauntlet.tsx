// src/components/AuthGauntlet.tsx
//
// AUTHENTICATION FACTORS (4 distinct types):
//   Stage 0 — PIN Code          (Knowledge: something you know)
//   Stage 1 — One-Time Passcode (Possession: something you have — simulated SMS to phone)
//   Stage 2 — Face Scan         (Biometric: something you are — webcam liveness detection)
//   Stage 3 — Security Question (Second Knowledge factor — memorable information)
//
// The "level" prop controls how many stages are required (1–4).
// This design ensures each added factor is a DIFFERENT category,
// which is critical for the HCS study on authentication combinations.

import React, { useState, useRef, useEffect, useCallback } from 'react';

type Props = {
  level: number;       // How many auth stages (1–4)
  taskName: string;    // Which banking task triggered this
  onComplete: (data: { timeTaken: number; errors: number }) => void;
  onCancel: () => void;
};

// The fixed OTP code for this session (simulates what the "real" SMS would contain)
const SIMULATED_OTP = '839205';

// Security question answer
const SECURITY_ANSWER = 'chester';

export default function AuthGauntlet({ level, taskName, onComplete, onCancel }: Props) {
  // --- CORE STATE ---
  const [stage, setStage] = useState(0);
  const [input, setInput] = useState('');
  const [startTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);
  const [failMessage, setFailMessage] = useState('');

  // --- OTP STATE ---
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [showOtpHint, setShowOtpHint] = useState(false);

  // --- WEBCAM & BIOMETRIC STATE ---
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('Initializing Camera...');
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  // Refs to avoid stale closures in setTimeout/setInterval callbacks
  const stageRef = useRef(stage);
  const errorsRef = useRef(errors);
  useEffect(() => { stageRef.current = stage; }, [stage]);
  useEffect(() => { errorsRef.current = errors; }, [errors]);

  // =========================================================
  // STAGE ADVANCEMENT
  // Uses refs so it always reads the latest stage/errors,
  // even when called from a stale setTimeout inside the camera loop.
  // =========================================================
  const advanceStage = useCallback(() => {
    stopCamera();
    const currentStage = stageRef.current;
    const currentErrors = errorsRef.current;
    
    if (currentStage + 1 >= level) {
      // All stages complete — report results
      onComplete({ timeTaken: (Date.now() - startTime) / 1000, errors: currentErrors });
    } else {
      setStage(currentStage + 1);
      setInput('');
      setFailMessage('');
      setIsScanning(false);
      setProgress(0);
      setOtpSent(false);
      setOtpCountdown(0);
      setShowOtpHint(false);
    }
  }, [level, startTime, onComplete]);

  // =========================================================
  // INPUT HANDLING
  // =========================================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (failMessage) setFailMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = false;

    // Stage 0: PIN — "1234"
    if (stage === 0 && input === '1234') isValid = true;
    // Stage 1: OTP — the simulated code
    else if (stage === 1 && input === SIMULATED_OTP) isValid = true;
    // Stage 3: Security Question — pet's name
    else if (stage === 3 && input.toLowerCase().trim() === SECURITY_ANSWER) isValid = true;

    if (isValid) {
      advanceStage();
    } else {
      setErrors(prev => prev + 1);
      setFailMessage('Incorrect. Please try again.');
      setInput('');
    }
  };

  // =========================================================
  // OTP SIMULATION (Stage 1)
  // =========================================================
  const sendOtp = () => {
    setOtpSent(true);
    setOtpCountdown(30);
    // Show the "SMS" hint after a short realistic delay
    setTimeout(() => setShowOtpHint(true), 1500);
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpCountdown > 0) {
      countdownRef.current = window.setTimeout(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [otpCountdown]);

  // =========================================================
  // CAMERA / BIOMETRIC LOGIC (Stage 2)
  // =========================================================
  const startFaceScan = async () => {
    setIsScanning(true);
    setScanStatus('Accessing Camera...');
    setProgress(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          setScanStatus('Please move your head slowly...');
          detectMotionLoop();
        };
      }
    } catch (err) {
      console.error('Camera denied or unavailable', err);
      setScanStatus('Camera unavailable. Use the bypass button below.');
    }
  };

  const detectMotionLoop = () => {
    let lastImageData: Uint8ClampedArray | null = null;
    const w = 50;
    const h = 50;

    intervalRef.current = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === 4) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          const current = ctx.getImageData(0, 0, w, h).data;

          if (lastImageData) {
            let score = 0;
            for (let i = 0; i < current.length; i += 4) {
              if (Math.abs(current[i] - lastImageData[i]) > 25) score++;
            }

            if (score > 40) {
              setProgress(prev => {
                const next = prev + 4;
                if (next >= 100) {
                  stopCamera();
                  setScanStatus('✅ Liveness Verified!');
                  setTimeout(() => advanceStage(), 800);
                  return 100;
                }
                return next;
              });
              setScanStatus('Verifying Liveness...');
            }
          }
          lastImageData = current;
        }
      }
    }, 100);
  };

  const stopCamera = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // =========================================================
  // FACTOR TYPE LABELS (for the step indicator)
  // =========================================================
  const factorLabels = ['PIN', 'One-Time Code', 'Face Scan', 'Security Question'];
  const factorCategories = ['Knowledge', 'Possession', 'Biometric', 'Knowledge'];
  const factorIcons = ['🔢', '📱', '👤', '🔐'];

  // =========================================================
  // RENDER HELPERS
  // =========================================================

  /** Stage 0: PIN entry */
  const renderPinStage = () => (
    <div>
      <div style={styles.factorBadge}>
        <span style={styles.factorIcon}>🔢</span>
        <span>Something you <strong>know</strong></span>
      </div>
      <label style={styles.label}>Enter your 4-digit PIN</label>
      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={input}
        onChange={handleInputChange}
        autoFocus
        placeholder="• • • •"
        style={{
          ...styles.input,
          ...styles.pinInput,
          borderColor: failMessage ? '#dc3545' : '#ccc',
        }}
      />
      <p style={styles.hint}>Hint: 1234</p>
    </div>
  );

  /** Stage 1: OTP (Possession) */
  const renderOtpStage = () => (
    <div>
      <div style={styles.factorBadge}>
        <span style={styles.factorIcon}>📱</span>
        <span>Something you <strong>have</strong></span>
      </div>

      {!otpSent ? (
        <div>
          <p style={{ color: '#555', marginBottom: '15px', fontSize: '0.95rem' }}>
            We'll send a one-time passcode to your registered device ending in <strong>**42</strong>.
          </p>
          <button type="button" onClick={sendOtp} style={styles.sendOtpBtn}>
            Send Code
          </button>
        </div>
      ) : (
        <div>
          {/* Simulated SMS notification */}
          {showOtpHint && (
            <div style={styles.smsNotification}>
              <div style={styles.smsHeader}>
                <span style={styles.smsIcon}>💬</span>
                <strong>Bank Security</strong>
                <span style={styles.smsTime}>now</span>
              </div>
              <p style={styles.smsBody}>
                Your verification code is: <strong>{SIMULATED_OTP}</strong>. 
                Do not share this code. Expires in 5 min.
              </p>
            </div>
          )}

          <label style={styles.label}>Enter 6-digit code</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={input}
            onChange={handleInputChange}
            autoFocus
            placeholder="• • • • • •"
            style={{
              ...styles.input,
              ...styles.otpInput,
              borderColor: failMessage ? '#dc3545' : '#ccc',
            }}
          />

          {otpCountdown > 0 ? (
            <p style={styles.resendText}>Resend available in {otpCountdown}s</p>
          ) : (
            <button
              type="button"
              onClick={sendOtp}
              style={styles.resendBtn}
            >
              Resend Code
            </button>
          )}
        </div>
      )}
    </div>
  );

  /** Stage 2: Face scan (Biometric) */
  const renderBiometricStage = () => (
    <div>
      <div style={styles.factorBadge}>
        <span style={styles.factorIcon}>👤</span>
        <span>Something you <strong>are</strong></span>
      </div>

      {!isScanning ? (
        <div>
          <div style={styles.bioPlaceholder}>
            <div style={styles.bioIconLarge}>👤</div>
            <p style={{ color: '#666', margin: '10px 0 0' }}>
              Position your face in the camera frame
            </p>
          </div>
          <button type="button" onClick={startFaceScan} style={styles.bioBtn}>
            Start Face Scan
          </button>
        </div>
      ) : (
        <div style={styles.cameraBox}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              ...styles.videoFeed,
              borderColor: progress === 100 ? '#28a745' : '#0056b3',
            }}
          />
          <canvas ref={canvasRef} width="50" height="50" style={{ display: 'none' }} />

          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          </div>

          <p
            style={{
              marginTop: '15px',
              fontWeight: 'bold',
              color: progress === 100 ? '#28a745' : '#0056b3',
            }}
          >
            {scanStatus}
          </p>

          <button onClick={advanceStage} style={styles.manualBtn}>
            (Debug) Force Success
          </button>
        </div>
      )}
    </div>
  );

  /** Stage 3: Security Question (Second Knowledge) */
  const renderSecurityQuestionStage = () => (
    <div>
      <div style={styles.factorBadge}>
        <span style={styles.factorIcon}>🔐</span>
        <span>Memorable <strong>information</strong></span>
      </div>
      <label style={styles.label}>What is the name of your first pet?</label>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        autoFocus
        placeholder="Your answer"
        style={{
          ...styles.input,
          borderColor: failMessage ? '#dc3545' : '#ccc',
        }}
      />
      <p style={styles.hint}>Hint: Chester</p>
    </div>
  );

  // Map stage index → renderer
  const stageRenderers = [renderPinStage, renderOtpStage, renderBiometricStage, renderSecurityQuestionStage];

  // Whether the current stage uses a text-submit form (stages 0, 1, 3) vs camera (stage 2)
  const isFormStage = stage !== 2;
  // For the OTP stage, only show submit button once OTP has been sent
  const showSubmitButton = isFormStage && !(stage === 1 && !otpSent);

  // =========================================================
  // MAIN RENDER
  // =========================================================
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <h2 style={{ marginTop: 0, color: '#003366' }}>Security Check</h2>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Action: <strong>{taskName}</strong>
        </p>

        {/* Step progress dots */}
        <div style={styles.stepsRow}>
          {Array.from({ length: level }).map((_, i) => (
            <div key={i} style={styles.stepDot}>
              <div
                style={{
                  ...styles.dot,
                  background: i < stage ? '#28a745' : i === stage ? '#0056b3' : '#ddd',
                  color: i <= stage ? 'white' : '#999',
                  border: i === stage ? '2px solid #003366' : '2px solid transparent',
                }}
              >
                {i < stage ? '✓' : factorIcons[i]}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: i === stage ? '#003366' : '#999',
                  fontWeight: i === stage ? 'bold' : 'normal',
                  marginTop: '4px',
                }}
              >
                {factorLabels[i]}
              </span>
            </div>
          ))}
        </div>

        <div style={styles.stepIndicator}>
          Step {stage + 1} of {level} — {factorCategories[stage]} Factor
        </div>

        {/* Active Stage Content */}
        {!isScanning ? (
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {stageRenderers[stage]()}

            {/* Error message */}
            {failMessage && (
              <div style={styles.errorMsg}>⚠️ {failMessage}</div>
            )}

            {/* Submit button (not shown for biometric or pre-OTP) */}
            {showSubmitButton && (
              <button type="submit" style={styles.nextBtn}>
                {stage + 1 >= level ? 'Verify' : 'Next'}
              </button>
            )}
          </form>
        ) : (
          // Biometric camera view (rendered outside the form)
          renderBiometricStage()
        )}

        {/* Cancel */}
        {!isScanning && (
          <button onClick={onCancel} style={styles.cancelBtn}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// =========================================================
// STYLES
// =========================================================
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '420px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    textAlign: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },

  // --- Step Progress Dots ---
  stepsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginBottom: '12px',
  },
  stepDot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dot: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  stepIndicator: {
    background: '#e9ecef',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    display: 'inline-block',
    marginBottom: '20px',
    color: '#555',
  },

  // --- Factor Category Badge ---
  factorBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#eef4fb',
    border: '1px solid #c8ddf0',
    borderRadius: '8px',
    padding: '8px 14px',
    marginBottom: '16px',
    fontSize: '0.85rem',
    color: '#336',
  },
  factorIcon: {
    fontSize: '1.1rem',
  },

  // --- Form elements ---
  label: {
    display: 'block',
    marginBottom: '8px',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1.1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    outline: 'none',
  },
  pinInput: {
    textAlign: 'center',
    letterSpacing: '12px',
    fontSize: '1.5rem',
    fontFamily: 'monospace',
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: '8px',
    fontSize: '1.3rem',
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: '0.8rem',
    color: '#999',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  nextBtn: {
    padding: '12px',
    background: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  cancelBtn: {
    marginTop: '15px',
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  errorMsg: {
    color: '#dc3545',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginTop: '-5px',
    marginBottom: '10px',
  },

  // --- OTP Specific ---
  sendOtpBtn: {
    padding: '14px 20px',
    background: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    width: '100%',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  smsNotification: {
    background: '#f0f4f0',
    border: '1px solid #c5d5c5',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '16px',
    textAlign: 'left',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  smsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
    fontSize: '0.85rem',
    color: '#333',
  },
  smsIcon: {
    fontSize: '1rem',
  },
  smsTime: {
    marginLeft: 'auto',
    fontSize: '0.75rem',
    color: '#999',
  },
  smsBody: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#444',
    lineHeight: '1.4',
  },
  resendText: {
    fontSize: '0.8rem',
    color: '#999',
    marginTop: '10px',
  },
  resendBtn: {
    marginTop: '10px',
    background: 'none',
    border: 'none',
    color: '#0056b3',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.85rem',
  },

  // --- Biometric / Camera ---
  bioPlaceholder: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '15px',
  },
  bioIconLarge: {
    fontSize: '3rem',
    opacity: 0.6,
  },
  bioBtn: {
    padding: '15px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    width: '100%',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  cameraBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  videoFeed: {
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '5px solid #0056b3',
    transform: 'scaleX(-1)',
    transition: 'border-color 0.3s',
  },
  progressContainer: {
    width: '220px',
    height: '12px',
    background: '#e9ecef',
    borderRadius: '6px',
    marginTop: '20px',
    overflow: 'hidden',
    border: '1px solid #ddd',
  },
  progressBar: {
    height: '100%',
    background: '#28a745',
    transition: 'width 0.1s linear',
  },
  manualBtn: {
    marginTop: '20px',
    padding: '8px 15px',
    fontSize: '0.8rem',
    color: '#999',
    background: 'transparent',
    border: '1px solid #eee',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
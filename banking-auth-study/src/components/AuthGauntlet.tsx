// src/components/AuthGauntlet.tsx
import React, { useState, useRef, useEffect } from 'react';

type Props = {
  level: number;
  taskName: string;
  onComplete: (data: { timeTaken: number; errors: number }) => void;
  onCancel: () => void;
};

export default function AuthGauntlet({ level, taskName, onComplete, onCancel }: Props) {
  const [stage, setStage] = useState(0); 
  const [input, setInput] = useState('');
  const [startTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);
  
  // NEW: State for in-app error messages
  const [failMessage, setFailMessage] = useState('');

  // WEBCAM & MOTION STATE
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("Initializing Camera...");
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);

  // --- STAGE LOGIC ---
  const advanceStage = () => {
    stopCamera();
    if (stage + 1 >= level) {
      onComplete({ timeTaken: (Date.now() - startTime) / 1000, errors });
    } else {
      setStage(stage + 1);
      setInput('');
      setFailMessage(''); // Clear any old errors
      setIsScanning(false);
      setProgress(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (failMessage) setFailMessage(''); // Hide error as soon as they type
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = false;
    
    // VALIDATION
    if (stage === 0 && input === '1234') isValid = true;       
    else if (stage === 1 && input === 'password') isValid = true;   
    else if (stage === 2 && input === '159') isValid = true;     
    
    if (isValid) {
      advanceStage();
    } else {
      setErrors(errors + 1);
      setFailMessage("Incorrect. Please try again."); // <--- In-App Error
      setInput(''); // Clear input so they can retry instantly
    }
  };

  // --- CAMERA LOGIC (Unchanged) ---
  const startFaceScan = async () => {
    setIsScanning(true);
    setScanStatus("Accessing Camera...");
    setProgress(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          setScanStatus("Please move your head slightly...");
          detectMotionLoop();
        };
      }
    } catch (err) {
      console.error("Camera denied", err);
      setScanStatus("Camera Error. Please use manual override.");
    }
  };

  const detectMotionLoop = () => {
    let lastImageData: Uint8ClampedArray | null = null;
    const width = 50; 
    const height = 50;

    intervalRef.current = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video && canvas && video.readyState === 4) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, width, height);
          const currentImageData = ctx.getImageData(0, 0, width, height).data;

          if (lastImageData) {
            let movementScore = 0;
            for (let i = 0; i < currentImageData.length; i += 4) {
              const diff = Math.abs(currentImageData[i] - lastImageData[i]); 
              if (diff > 25) movementScore++;
            }

            if (movementScore > 40) {
              setProgress(prev => {
                const newProgress = prev + 4;
                if (newProgress >= 100) {
                  stopCamera();
                  setScanStatus("✅ Liveness Verified!");
                  setTimeout(() => advanceStage(), 800);
                  return 100;
                }
                return newProgress;
              });
              setScanStatus("Verifying Liveness...");
            }
          }
          lastImageData = currentImageData;
        }
      }
    }, 100);
  };

  const stopCamera = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ marginTop: 0, color: '#003366' }}>Security Check</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Action: <strong>{taskName}</strong>
        </p>
        
        <div style={styles.stepIndicator}>Step {stage + 1} of {level}</div>

        {!isScanning ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {stage === 0 && (<div><label style={styles.label}>Enter PIN (1234)</label>
              <input 
                type="text" 
                value={input} 
                onChange={handleInputChange} 
                autoFocus 
                style={{...styles.input, borderColor: failMessage ? '#dc3545' : '#ccc'}} // Red border on error
              /></div>)}
            {stage === 1 && (<div><label style={styles.label}>Enter Password (password)</label>
              <input 
                type="password" 
                value={input} 
                onChange={handleInputChange} 
                autoFocus 
                style={{...styles.input, borderColor: failMessage ? '#dc3545' : '#ccc'}} 
              /></div>)}
            {stage === 2 && (<div><label style={styles.label}>Enter Pattern (159)</label>
              <input 
                type="text" 
                value={input} 
                onChange={handleInputChange} 
                autoFocus 
                style={{...styles.input, borderColor: failMessage ? '#dc3545' : '#ccc'}} 
              /></div>)}
            
            {stage === 3 && (
              <div>
                <label style={styles.label}>Biometric Liveness Check</label>
                <div style={styles.bioIcon}>👤</div>
                <button type="button" onClick={startFaceScan} style={styles.bioBtn}>Start Face Scan</button>
              </div>
            )}
            
            {/* ERROR MESSAGE APPEARS HERE */}
            {failMessage && (
              <div style={styles.errorMsg}>⚠️ {failMessage}</div>
            )}

            {stage !== 3 && <button type="submit" style={styles.nextBtn}>Next</button>}
          </form>
        ) : (
          <div style={styles.cameraBox}>
            <video 
              ref={videoRef} 
              autoPlay playsInline muted 
              style={{
                ...styles.videoFeed,
                borderColor: progress === 100 ? '#28a745' : '#0056b3'
              }} 
            />
            <canvas ref={canvasRef} width="50" height="50" style={{display: 'none'}} />
            
            <div style={styles.progressContainer}>
              <div style={{...styles.progressBar, width: `${progress}%`}}></div>
            </div>

            <p style={{
              marginTop: '15px', fontWeight: 'bold', 
              color: progress === 100 ? '#28a745' : '#0056b3'
            }}>
              {scanStatus}
            </p>

            <button onClick={advanceStage} style={styles.manualBtn}>
              (Debug) Force Success
            </button>
          </div>
        )}

        {!isScanning && <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
  },
  modal: {
    background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '400px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)', textAlign: 'center' as const, fontFamily: 'Segoe UI, sans-serif',
  },
  stepIndicator: {
    background: '#e9ecef', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'inline-block', marginBottom: '20px', color: '#555'
  },
  label: { display: 'block', marginBottom: '8px', textAlign: 'left' as const, fontWeight: 'bold', color: '#333' },
  input: { width: '100%', padding: '12px', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' as const, outline: 'none' },
  nextBtn: { padding: '12px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' },
  bioBtn: { padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', width: '100%', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' },
  bioIcon: { fontSize: '3rem', marginBottom: '15px', opacity: 0.8 },
  cancelBtn: { marginTop: '15px', background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', textDecoration: 'underline' },
  cameraBox: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' },
  videoFeed: { 
    width: '220px', height: '220px', borderRadius: '50%', objectFit: 'cover' as const, 
    border: '5px solid #0056b3', transform: 'scaleX(-1)', transition: 'border-color 0.3s' 
  },
  progressContainer: {
    width: '220px', height: '12px', background: '#e9ecef', borderRadius: '6px',
    marginTop: '20px', overflow: 'hidden', border: '1px solid #ddd'
  },
  progressBar: {
    height: '100%', background: '#28a745', transition: 'width 0.1s linear'
  },
  manualBtn: {
    marginTop: '20px', padding: '8px 15px', fontSize: '0.8rem', color: '#999',
    background: 'transparent', border: '1px solid #eee', borderRadius: '4px', cursor: 'pointer'
  },
  // NEW ERROR STYLE
  errorMsg: {
    color: '#dc3545',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginTop: '-5px',
    marginBottom: '10px',
    animation: 'shake 0.3s ease-in-out'
  }
};
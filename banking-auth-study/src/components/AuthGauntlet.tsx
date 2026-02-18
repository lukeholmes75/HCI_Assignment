// src/components/AuthGauntlet.tsx
import React, { useState } from 'react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = false;
    
    // Prototype Validation Logic
    if (stage === 0 && input === '1234') isValid = true;       
    else if (stage === 1 && input === 'password') isValid = true;   
    else if (stage === 2 && input === '159') isValid = true;     
    else if (stage === 3) isValid = true;                           

    if (isValid) {
      if (stage + 1 >= level) {
        onComplete({ timeTaken: (Date.now() - startTime) / 1000, errors });
      } else {
        setStage(stage + 1);
        setInput('');
      }
    } else {
      setErrors(errors + 1);
      alert("Incorrect! Try again.");
    }
  };

  return (
    // 1. THE DARK OVERLAY
    <div style={styles.overlay}>
      
      {/* 2. THE WHITE POP-UP BOX */}
      <div style={styles.modal}>
        <h2 style={{ marginTop: 0, color: '#003366' }}>Security Check</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Action: <strong>{taskName}</strong>
        </p>
        
        <div style={styles.stepIndicator}>
          Step {stage + 1} of {level}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {stage === 0 && (
            <div>
              <label style={styles.label}>Enter PIN (1234)</label>
              <input type="text" value={input} onChange={e=>setInput(e.target.value)} autoFocus style={styles.input}/>
            </div>
          )}
          {stage === 1 && (
            <div>
              <label style={styles.label}>Enter Password (password)</label>
              <input type="password" value={input} onChange={e=>setInput(e.target.value)} autoFocus style={styles.input}/>
            </div>
          )}
          {stage === 2 && (
            <div>
              <label style={styles.label}>Enter Pattern (159)</label>
              <input type="text" value={input} onChange={e=>setInput(e.target.value)} autoFocus style={styles.input}/>
            </div>
          )}
          {stage === 3 && (
            <div>
              <label style={styles.label}>Biometric Scan</label>
              <button type="button" onClick={handleSubmit} style={styles.bioBtn}>Scan Face ID</button>
            </div>
          )}
          
          {stage !== 3 && <button type="submit" style={styles.nextBtn}>Next</button>}
        </form>

        <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
      </div>
    </div>
  );
}

// STYLES FOR THE POP-UP
const styles = {
  overlay: {
    position: 'fixed' as const, // Locks it to the screen
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensures it sits on top of the dashboard
  },
  modal: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    textAlign: 'center' as const,
    fontFamily: 'Segoe UI, sans-serif',
  },
  stepIndicator: {
    background: '#e9ecef',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    display: 'inline-block',
    marginBottom: '20px',
    color: '#555'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    textAlign: 'left' as const,
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1.1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box' as const
  },
  nextBtn: {
    padding: '12px',
    background: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px'
  },
  bioBtn: {
    padding: '15px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    width: '100%',
    cursor: 'pointer'
  },
  cancelBtn: {
    marginTop: '15px',
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};
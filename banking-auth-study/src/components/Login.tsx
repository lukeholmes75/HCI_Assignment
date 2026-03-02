// src/components/Login.tsx
import React, { useState } from 'react';

type Props = {
  onLogin: (credentials: { pin: string; petName: string }) => void;
};

export default function Login({ onLogin }: Props) {
  // Setup fields
  const [pin, setPin] = useState('');
  const [petName, setPetName] = useState('');
  const [setupError, setSetupError] = useState('');

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setSetupError('PIN must be exactly 4 digits.');
      return;
    }
    if (!petName.trim()) {
      setSetupError('Please enter your pet\'s name.');
      return;
    }

    onLogin({ pin, petName: petName.trim().toLowerCase() });
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: '#0056b3', marginBottom: '6px' }}>Account Setup</h1>
        <p style={{ color: '#666', marginBottom: '25px', fontSize: '0.9rem' }}>
          Before we begin, please create your security credentials. You'll need to remember these during the study.
        </p>

        <form onSubmit={handleSetup} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={labelStyle}>Choose a 4-digit PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="e.g. 4829"
              value={pin}
              onChange={e => { setPin(e.target.value); setSetupError(''); }}
              style={{
                ...inputStyle,
                textAlign: 'center',
                letterSpacing: '10px',
                fontSize: '1.3rem',
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={labelStyle}>What is the name of your first pet?</label>
            <input
              type="text"
              placeholder="e.g. Chester"
              value={petName}
              onChange={e => { setPetName(e.target.value); setSetupError(''); }}
              style={inputStyle}
            />
            <p style={{ fontSize: '0.78rem', color: '#888', margin: '4px 0 0' }}>
              This will be used as a security question later.
            </p>
          </div>

          {setupError && (
            <div style={errorStyle}>{setupError}</div>
          )}

          <button type="submit" style={buttonStyle}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: '#f0f2f5',
  fontFamily: 'Segoe UI, sans-serif',
} as const;

const cardStyle = {
  background: 'white',
  padding: '40px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  textAlign: 'center' as const,
  width: '100%',
  maxWidth: '380px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  boxSizing: 'border-box' as const,
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#0056b3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 'bold' as const,
};

const errorStyle: React.CSSProperties = {
  color: '#dc3545',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  textAlign: 'center',
};
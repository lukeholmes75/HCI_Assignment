// src/components/Login.tsx
import React, { useState } from 'react';

type Props = {
  onLogin: () => void;
};

export default function Login({ onLogin }: Props) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userId && password) {
      onLogin();
    } else {
      alert("Please enter a User ID and Password.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: '#0056b3', marginBottom: '10px' }}>Bank</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Secure Banking</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <input 
              type="text" 
              placeholder="User ID" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

// Simple CSS-in-JS styles for a clean look
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',    // Center horizontally
  alignItems: 'center',        // Center vertically
  height: '100vh',             // Full Height
  width: '100vw',              // Full Width (This is the key fix!)
  position: 'fixed',           // Locks it to the screen viewport
  top: 0,
  left: 0,
  backgroundColor: '#f0f2f5',
  fontFamily: 'Arial, sans-serif'
} as const; // 'as const' makes TypeScript happy with the position value

const cardStyle = {
  background: 'white',
  padding: '40px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  textAlign: 'center' as const,
  width: '100%',
  maxWidth: '350px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  boxSizing: 'border-box' as const
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
  fontWeight: 'bold' as const
};
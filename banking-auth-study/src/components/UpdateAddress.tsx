// src/components/UpdateAddress.tsx
import React, { useState } from 'react';

type Props = {
  onBack: () => void;
  onConfirm: () => void;
};

export default function UpdateAddress({ onBack, onConfirm }: Props) {
  // Pre-fill some data so the user doesn't have to type too much
  const [street, setStreet] = useState('');
  const [postcode, setPostcode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(); // Go to Success Screen
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>← Cancel</button>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Update Details</h2>
          <div style={{ width: '60px' }}></div>
        </header>

        <div style={styles.currentInfo}>
          <span style={styles.label}>Current Address</span>
          <p style={{ margin: '5px 0', color: '#555' }}>
            123 University<br/>
            Glasgow, G12 8QQ
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>New Street Address</label>
            <input 
              type="text" 
              placeholder="e.g. 45 High Street"
              value={street}
              onChange={e => setStreet(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ ...styles.field, flex: 2 }}>
              <label style={styles.label}>City</label>
              <input type="text" placeholder="Glasgow" style={styles.input} />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Postcode</label>
              <input 
                type="text" 
                placeholder="G1 1AA"
                value={postcode}
                onChange={e => setPostcode(e.target.value)}
                style={styles.input} 
                required
              />
            </div>
          </div>
          <button type="submit" style={styles.saveBtn}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    background: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '40px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    background: 'white',
    width: '100%',
    maxWidth: '450px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: '30px',
    height: 'fit-content',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
    marginBottom: '20px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#0056b3',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  currentInfo: {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e9ecef',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  warning: {
    fontSize: '0.85rem',
    color: '#004085',
    background: '#cce5ff',
    padding: '12px',
    borderRadius: '6px',
  },
  saveBtn: {
    marginTop: '10px',
    padding: '15px',
    background: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 86, 179, 0.2)',
  }
};
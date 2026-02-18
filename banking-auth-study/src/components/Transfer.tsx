// src/components/Transfer.tsx
import React from 'react';

type Props = {
  onBack: () => void;
  onConfirm: () => void;
  initialAmount?: string; // NEW: Accepts an amount from the parent
};

export default function Transfer({ onBack, onConfirm, initialAmount = "20.00" }: Props) {
  // Use the prop if provided, otherwise default to 20.00
  const amount = initialAmount;
  const payee = amount === "10,000.00" ? "Investment Account" : "Alice Smith";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>← Cancel</button>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Confirm Payment</h2>
          <div style={{ width: '60px' }}></div>
        </header>

        <div style={styles.accountBox}>
          <span style={styles.label}>From Account</span>
          <div style={styles.accountRow}>
            <span>Student Current Account</span>
            <strong>£12,450.00</strong>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>To (Payee)</label>
          <div style={styles.inputFake}>{payee}</div>
        </div>

        {/* AMOUNT DISPLAY */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Amount (£)</label>
          <div style={styles.amountDisplay}>£{amount}</div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Reference</label>
          <div style={styles.inputFake}>
            {amount === "10,000.00" ? "Investment" : "Food"}
          </div>
        </div>

        

        <button onClick={onConfirm} style={styles.confirmBtn}>
          Confirm Transfer
        </button>
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
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
    marginBottom: '10px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#0056b3',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  accountBox: {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  accountRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5px',
    fontSize: '0.9rem',
  },
  formGroup: {
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
  inputFake: {
    padding: '12px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    color: '#333',
    fontSize: '1rem',
  },
  amountDisplay: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center' as const,
    padding: '10px',
    borderBottom: '2px solid #0056b3',
  },
  warning: {
    fontSize: '0.8rem',
    color: '#856404',
    background: '#fff3cd',
    padding: '10px',
    borderRadius: '6px',
    textAlign: 'center' as const,
  },
  confirmBtn: {
    marginTop: '10px',
    padding: '18px',
    background: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 86, 179, 0.2)',
  }
};
// src/components/Statement.tsx
import React from 'react';

type Props = {
  onBack: () => void;
};

export default function Statement({ onBack }: Props) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>
        <h1>Monthly Statement</h1>
        <button style={styles.printBtn}>Print PDF</button>
      </header>

      <div style={styles.paper}>
        <div style={styles.statementHeader}>
          <div>
            <h3>Student Bank</h3>
            <p>Glasgow</p>
          </div>
          <div style={{textAlign: 'right'}}>
            <h3>Luke Holmes</h3>
            <p>Account: 1234-5678</p>
            <p>Date: Feb 18, 2026</p>
          </div>
        </div>

        <hr style={{margin: '20px 0', border: 'none', borderBottom: '1px solid #ddd'}} />

        <table style={styles.table}>
          <thead>
            <tr style={{background: '#f9f9f9', textAlign: 'left'}}>
              <th style={{padding: '10px'}}>Date</th>
              <th style={{padding: '10px'}}>Description</th>
              <th style={{padding: '10px'}}>Out</th>
              <th style={{padding: '10px'}}>In</th>
              <th style={{padding: '10px'}}>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Feb 18</td>
              <td style={styles.td}>Spotify</td>
              <td style={styles.td}>£9.99</td>
              <td style={styles.td}>-</td>
              <td style={styles.td}>£12,450.00</td>
            </tr>
            <tr>
              <td style={styles.td}>Feb 17</td>
              <td style={styles.td}>Shop</td>
              <td style={styles.td}>£32.10</td>
              <td style={styles.td}>-</td>
              <td style={styles.td}>£12,459.99</td>
            </tr>
            <tr>
              <td style={styles.td}>Feb 15</td>
              <td style={styles.td}>Transfer</td>
              <td style={styles.td}>-</td>
              <td style={styles.td}>£50.00</td>
              <td style={styles.td}>£12,492.09</td>
            </tr>
             <tr>
              <td style={styles.td}>Feb 14</td>
              <td style={styles.td}>Coffee</td>
              <td style={styles.td}>£4.50</td>
              <td style={styles.td}>-</td>
              <td style={styles.td}>£12,442.09</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    background: '#555', // Dark background to make the "Paper" pop
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    color: 'white',
  },
  paper: {
    background: 'white',
    width: '100%',
    maxWidth: '800px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    minHeight: '600px',
  },
  statementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  backBtn: {
    padding: '10px 20px',
    cursor: 'pointer',
    background: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  printBtn: {
    padding: '10px 20px',
    cursor: 'pointer',
    background: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  }
};
// src/components/Dashboard.tsx
import React from 'react';

type Props = {
  onStartTask: (level: number, taskName: string) => void;
};

export default function Dashboard({ onStartTask }: Props) {
  return (
    <div style={styles.container}>
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <nav style={styles.sidebar}>
        <div style={styles.logo}>Online Bank</div>
        <div style={styles.navLinks}>
          <div style={styles.activeLink}>Dashboard</div>
          <div style={styles.link}>My Accounts</div>
          <div style={styles.link}>Transfers</div>
  
          {/* NEW: This now triggers the study task! */}
          <div 
            style={styles.link} 
            onClick={() => onStartTask(1, "View Statement")}
          >
            Statements
          </div>
        <div style={styles.link}>Settings</div>
        </div>
        <div style={styles.userProfile}>
          <div style={styles.avatar}>US</div>
          <div>
            <div style={{fontWeight: 'bold'}}>Username</div>
            <div style={{fontSize: '0.8rem', opacity: 0.7}}>ID: 884210</div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={styles.main}>
        
        {/* HEADER */}
        <header style={styles.header}>
          <h2>Overview</h2>
          <span style={{color: '#666'}}>Last login: Today</span>
        </header>

        {/* STATS ROW */}
        <div style={styles.statsRow}>
          <div style={styles.balanceCard}>
            <p style={{margin:0, opacity: 0.8}}>Total Balance</p>
            <h1 style={{margin: '10px 0'}}>£12,450.00</h1>
            <div style={{fontSize: '0.9rem', opacity: 0.7}}>Available</div>
          </div>
          <div style={styles.infoCard}>
            <p style={{margin:0, color: '#666'}}>Monthly Spending</p>
            <h2 style={{margin: '10px 0', color: '#333'}}>£1,240.50</h2>
          </div>
        </div>

        {/* SECURITY TASKS (ACTION GRID) */}
        <div style={styles.actionGrid}>
          
          {/* LEVEL 1 */}
          <button style={styles.actionCard} onClick={() => onStartTask(1, "View Statement")}>
            <div style={{textAlign: 'left'}}>
              <strong>View Statement</strong>
            </div>
          </button>

          {/* LEVEL 2 */}
          <button style={styles.actionCard} onClick={() => onStartTask(2, "Small Transfer")}>
            <div style={{textAlign: 'left'}}>
              <strong> Transfer under £10,000</strong>
            </div>
          </button>

          {/* LEVEL 3 */}
          <button style={styles.actionCard} onClick={() => onStartTask(3, "Update Account Details")}>
            <div style={{textAlign: 'left'}}>
              <strong>Update Account Details</strong>
            </div>
          </button>

          {/* LEVEL 4 */}
          <button style={styles.actionCard} onClick={() => onStartTask(4, "Large Transfer")}>
            <div style={{textAlign: 'left'}}>
              <strong>Transfer more than £10,000</strong>
            </div>
          </button>

        </div>

        {/* RECENT TRANSACTIONS TABLE */}
        <h3 style={styles.sectionTitle}>Recent Transactions</h3>
        <table style={styles.table}>
          <thead>
            <tr style={{textAlign: 'left', color: '#666'}}>
              <th style={{padding: '10px'}}>Date</th>
              <th style={{padding: '10px'}}>Description</th>
              <th style={{padding: '10px'}}>Type</th>
              <th style={{padding: '10px', textAlign: 'right'}}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Today</td>
              <td style={styles.td}>Starbucks Coffee</td>
              <td style={styles.td}>Food & Drink</td>
              <td style={{...styles.td, textAlign: 'right', fontWeight: 'bold'}}>-£4.50</td>
            </tr>
            <tr>
              <td style={styles.td}>Yesterday</td>
              <td style={styles.td}>Tesco Extra</td>
              <td style={styles.td}>Groceries</td>
              <td style={{...styles.td, textAlign: 'right', fontWeight: 'bold'}}>-£32.10</td>
            </tr>
            <tr>
              <td style={styles.td}>Feb 14</td>
              <td style={styles.td}>Spotify Premium</td>
              <td style={styles.td}>Subscription</td>
              <td style={{...styles.td, textAlign: 'right', fontWeight: 'bold'}}>-£9.99</td>
            </tr>
          </tbody>
        </table>

      </main>
    </div>
  );
}

// DESKTOP-FIRST STYLES
const styles = {
  container: {
    display: 'flex',
    width: '100vw',        // Force full width
    height: '100vh',       // Force full height
    fontFamily: 'Segoe UI, sans-serif',
    background: '#f0f2f5',
    overflow: 'hidden',    // Prevents double scrollbars
  },
  sidebar: {
    width: '260px',
    background: '#003366', // Deep Bank Blue
    color: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '20px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '40px',
    letterSpacing: '1px',
  },
  navLinks: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  link: {
    padding: '12px',
    cursor: 'pointer',
    borderRadius: '6px',
    opacity: 0.7,
    transition: '0.2s',
  },
  activeLink: {
    padding: '12px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '6px',
    fontWeight: 'bold',
  },
  userProfile: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    background: '#0056b3',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  main: {
    flex: 1,              
    padding: '40px',
    overflowY: 'auto' as const, 
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #0056b3 0%, #004494 100%)',
    color: 'white',
    padding: '25px',
    borderRadius: '12px',
    flex: 1,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  infoCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    flex: 1,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    marginBottom: '15px',
    color: '#444',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  actionCard: {
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  iconBox: {
    fontSize: '1.5rem',
    background: '#f0f2f5',
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityTag: {
    fontSize: '0.75rem',
    color: '#666',
    marginTop: '4px',
  },
  table: {
    width: '100%',
    background: 'white',
    borderRadius: '12px',
    borderCollapse: 'collapse' as const,
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  td: {
    padding: '15px 10px',
    borderBottom: '1px solid #eee',
  }
};
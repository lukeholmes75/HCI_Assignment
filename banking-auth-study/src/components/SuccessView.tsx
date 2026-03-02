// src/components/SuccessView.tsx
import React from 'react';

type Props = {
  taskName: string;
  stats: {
    timeTaken: number;
    errors: number;
    stageTimes?: { stage: string; seconds: number }[];
  };
  onHome: () => void;
};

export default function SuccessView({ taskName, stats, onHome }: Props) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* BIG GREEN CHECKMARK ICON */}
        <div style={styles.icon}>Success</div>
        
        <h1 style={{ color: '#28a745', marginBottom: '10px', marginTop: 0 }}>Success!</h1>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '30px' }}>
          <strong>{taskName}</strong> has been completed successfully.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

        {/* DATA DISPLAY BOX (For Researcher Use) */}
        <div style={styles.dataBox}>
          <h4 style={styles.dataTitle}>Study Results (Record These)</h4>
          
          <div style={styles.metricsRow}>
            <div style={styles.metricItem}>
              <div style={styles.metricLabel}>Total Time</div>
              <div style={styles.metricValue}>{stats.timeTaken.toFixed(2)}s</div>
            </div>
            
            <div style={{ width: '1px', background: '#ccc' }}></div>
            
            <div style={styles.metricItem}>
              <div style={styles.metricLabel}>Errors</div>
              <div style={styles.metricValue}>{stats.errors}</div>
            </div>
          </div>

          {/* PER-STAGE TIMING BREAKDOWN */}
          {stats.stageTimes && stats.stageTimes.length > 0 && (
            <div style={styles.stageSection}>
              <h4 style={styles.stageTitle}>Per-Stage Breakdown</h4>
              <div style={styles.stageGrid}>
                {stats.stageTimes.map((s, i) => (
                  <div key={i} style={styles.stageItem}>
                    <div style={styles.stageName}>{s.stage}</div>
                    <div style={styles.stageTime}>{s.seconds.toFixed(2)}s</div>
                    {/* Visual bar */}
                    <div style={styles.barContainer}>
                      <div
                        style={{
                          ...styles.bar,
                          width: `${Math.min(100, (s.seconds / Math.max(...stats.stageTimes!.map(st => st.seconds))) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button onClick={onHome} style={styles.homeBtn}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f0f2f5',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '480px',
    width: '90%',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '15px',
  },
  dataBox: {
    background: '#f8f9fa',
    border: '2px dashed #ced4da',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
  },
  dataTitle: {
    margin: '0 0 15px 0',
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    letterSpacing: '1px',
    color: '#6c757d',
  },
  metricsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '5px',
  },
  metricValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
  },
  // Per-stage breakdown
  stageSection: {
    marginTop: '18px',
    paddingTop: '15px',
    borderTop: '1px dashed #ccc',
  },
  stageTitle: {
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    fontSize: '0.7rem',
    letterSpacing: '0.5px',
    color: '#888',
  },
  stageGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  stageItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  stageName: {
    width: '80px',
    textAlign: 'left',
    fontSize: '0.8rem',
    color: '#555',
    fontWeight: 'bold',
  },
  stageTime: {
    width: '50px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    height: '8px',
    background: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    background: '#0056b3',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  homeBtn: {
    width: '100%',
    padding: '15px',
    background: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};
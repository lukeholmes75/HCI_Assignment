
import React, { useState } from 'react';
import type { QuestionnaireData } from './Questionnaire';

export type TaskRecord = {
  participantId: string;
  taskName: string;
  authLevel: number;
  timeTaken: number;
  errors: number;
  stageTimes: { stage: string; seconds: number }[];
  questionnaire: QuestionnaireData;
  timestamp: string;
};

type Props = {
  records: TaskRecord[];
  participantId: string;
  onSetParticipantId: (id: string) => void;
  onClearData: () => void;
};

export default function StudyLogger({ records, participantId, onSetParticipantId, onClearData }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingId, setEditingId] = useState(false);
  const [tempId, setTempId] = useState(participantId);

  // ---- CSV EXPORT ----
  const exportCSV = () => {
    if (records.length === 0) return;

    const headers = [
      'Participant_ID',
      'Task_Name',
      'Auth_Level',
      'Total_Time_Seconds',
      'Errors',
      'PIN_Time',
      'OTP_Time',
      'FaceScan_Time',
      'SecurityQ_Time',
      'Q1_Ease',
      'Q2_MentalEffort',
      'Q3_TimeAcceptability',
      'Q4_Frustration',
      'Q5_AbandonLikelihood',
      'Q6_PerceivedSecurity',
      'Q7_TrustProtection',
      'Q8_SecurityUsabilityBalance',
      'Q9_RiskWithout',
      'Timestamp',
    ];

    // Helper to find a stage time by name, return empty string if not used
    const getStageTime = (r: TaskRecord, stageName: string) => {
      const found = r.stageTimes.find(s => s.stage === stageName);
      return found ? found.seconds.toFixed(2) : '';
    };

    const rows = records.map(r => [
      r.participantId,
      r.taskName,
      r.authLevel,
      r.timeTaken.toFixed(2),
      r.errors,
      getStageTime(r, 'PIN'),
      getStageTime(r, 'OTP'),
      getStageTime(r, 'Face Scan'),
      getStageTime(r, 'Security Q'),
      r.questionnaire.q1_ease,
      r.questionnaire.q2_mentalEffort,
      r.questionnaire.q3_timeAcceptability,
      r.questionnaire.q4_frustration,
      r.questionnaire.q5_abandonLikelihood,
      r.questionnaire.q6_perceivedSecurity,
      r.questionnaire.q7_trustProtection,
      r.questionnaire.q8_securityUsabilityBalance,
      r.questionnaire.q9_riskWithout,
      r.timestamp,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study_data_${participantId || 'unknown'}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveId = () => {
    onSetParticipantId(tempId.trim());
    setEditingId(false);
  };

  // If the panel is collapsed, just show a small floating button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        style={styles.floatingBtn}
        title="Study Data Logger"
      >
        📊 {records.length > 0 && <span style={styles.badge}>{records.length}</span>}
      </button>
    );
  }

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.panelHeader}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: '#003366' }}>📊 Study Logger</h3>
        <button onClick={() => setIsExpanded(false)} style={styles.closeBtn}>✕</button>
      </div>

      {/* Participant ID */}
      <div style={styles.section}>
        <label style={styles.sectionLabel}>Participant ID</label>
        {!editingId ? (
          <div style={styles.idRow}>
            <span style={styles.idDisplay}>{participantId || '(not set)'}</span>
            <button onClick={() => { setEditingId(true); setTempId(participantId); }} style={styles.editBtn}>
              Edit
            </button>
          </div>
        ) : (
          <div style={styles.idRow}>
            <input
              type="text"
              value={tempId}
              onChange={e => setTempId(e.target.value)}
              placeholder="e.g. P01"
              style={styles.idInput}
              autoFocus
            />
            <button onClick={handleSaveId} style={styles.saveBtn}>Save</button>
          </div>
        )}
      </div>

      {/* Records Summary */}
      <div style={styles.section}>
        <label style={styles.sectionLabel}>Recorded Tasks ({records.length})</label>
        {records.length === 0 ? (
          <p style={{ color: '#999', fontSize: '0.85rem', margin: '5px 0' }}>
            No tasks completed yet. Data will appear here after each task.
          </p>
        ) : (
          <div style={styles.recordsList}>
            {records.map((r, i) => (
              <div key={i} style={styles.recordRow}>
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>{r.taskName}</strong>
                  <span style={styles.levelTag}>Lvl {r.authLevel}</span>
                </div>
                <div style={styles.recordMeta}>
                  {r.timeTaken.toFixed(1)}s total · {r.errors} err · Ease: {r.questionnaire.q1_ease}/5
                </div>
                {r.stageTimes.length > 0 && (
                  <div style={styles.stageBreakdown}>
                    {r.stageTimes.map((s, j) => (
                      <span key={j} style={styles.stageChip}>
                        {s.stage}: {s.seconds.toFixed(1)}s
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          onClick={exportCSV}
          disabled={records.length === 0}
          style={{
            ...styles.exportBtn,
            opacity: records.length === 0 ? 0.5 : 1,
            cursor: records.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ⬇ Export CSV
        </button>
        <button
          onClick={() => {
            if (window.confirm('Clear all recorded data for this session? This cannot be undone.')) {
              onClearData();
            }
          }}
          disabled={records.length === 0}
          style={{
            ...styles.clearBtn,
            opacity: records.length === 0 ? 0.5 : 1,
            cursor: records.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Clear Data
        </button>
      </div>
    </div>
  );
}

// =========================================================
// STYLES
// =========================================================
const styles: Record<string, React.CSSProperties> = {
  floatingBtn: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 10000,
    background: '#003366',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  badge: {
    background: '#dc3545',
    color: 'white',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  panel: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 10000,
    background: 'white',
    borderRadius: '14px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    width: '320px',
    maxHeight: '70vh',
    overflowY: 'auto',
    fontFamily: 'Segoe UI, sans-serif',
    border: '1px solid #ddd',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    background: 'white',
    borderRadius: '14px 14px 0 0',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    color: '#999',
    padding: '4px 8px',
  },
  section: {
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
  },
  sectionLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#888',
    fontWeight: 'bold',
    marginBottom: '6px',
    display: 'block',
  },
  idRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  idDisplay: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  idInput: {
    flex: 1,
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '0.95rem',
    outline: 'none',
  },
  editBtn: {
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    color: '#555',
  },
  saveBtn: {
    background: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  recordsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '6px',
  },
  recordRow: {
    background: '#f8f9fa',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #eee',
  },
  levelTag: {
    background: '#e9ecef',
    padding: '1px 6px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    marginLeft: '6px',
    color: '#555',
  },
  recordMeta: {
    fontSize: '0.78rem',
    color: '#888',
    marginTop: '2px',
  },
  actions: {
    padding: '12px 16px',
    display: 'flex',
    gap: '8px',
  },
  exportBtn: {
    flex: 1,
    padding: '10px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  clearBtn: {
    padding: '10px 14px',
    background: 'none',
    color: '#dc3545',
    border: '1px solid #dc3545',
    borderRadius: '8px',
    fontSize: '0.85rem',
  },
  stageBreakdown: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '4px',
  },
  stageChip: {
    background: '#eef4fb',
    color: '#336',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.7rem',
  },
};
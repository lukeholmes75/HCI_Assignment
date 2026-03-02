
import React, { useState } from 'react';

export type FinalSurveyData = {
  q10_sufficientLevel: string;
  q11_annoyedLevel: string;
  q12_preferDaily: string;
  q13_twoFactors: string[];
  q14_tradeOff: number;
  q15_maxTime: string;
  q16_securityEnough: string;
  q17_temptedGiveUp: string;
  q18_mostAnnoying: string;
  q19_mostReassuring: string;
  q20_additionalComments: string;
};

type Props = {
  onSubmit: (data: FinalSurveyData) => void;
};

const TEST_OPTIONS = [
  'Test 1 (PIN only)',
  'Test 2 (PIN + Face)',
  'Test 3 (PIN + Face + OTP)',
  'Test 4 (All factors)',
];

const FACTOR_OPTIONS = ['PIN', 'Face ID', 'OTP Token', 'Security Question'];

const TIME_OPTIONS = ['< 5 seconds', '5–10 seconds', '10–20 seconds', '20–30 seconds', '30+ seconds'];

export default function FinalSurvey({ onSubmit }: Props) {
  const [responses, setResponses] = useState<Record<string, any>>({
    q13_twoFactors: [],
  });
  const [showWarning, setShowWarning] = useState(false);

  const set = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
    if (showWarning) setShowWarning(false);
  };

  const toggleFactor = (factor: string) => {
    setResponses(prev => {
      const current: string[] = prev.q13_twoFactors || [];
      if (current.includes(factor)) {
        return { ...prev, q13_twoFactors: current.filter(f => f !== factor) };
      }
      if (current.length >= 2) return prev; // Max 2
      return { ...prev, q13_twoFactors: [...current, factor] };
    });
    if (showWarning) setShowWarning(false);
  };

  const handleSubmit = () => {
    // Validate required fields
    const required = ['q10_sufficientLevel', 'q11_annoyedLevel', 'q12_preferDaily', 'q14_tradeOff', 'q15_maxTime'];
    const allAnswered = required.every(k => responses[k] !== undefined && responses[k] !== '');
    const hasTwoFactors = (responses.q13_twoFactors || []).length === 2;
    const hasQualitative = responses.q16_securityEnough?.trim() && responses.q17_temptedGiveUp?.trim();

    if (!allAnswered || !hasTwoFactors || !hasQualitative) {
      setShowWarning(true);
      return;
    }

    onSubmit({
      q10_sufficientLevel: responses.q10_sufficientLevel,
      q11_annoyedLevel: responses.q11_annoyedLevel,
      q12_preferDaily: responses.q12_preferDaily,
      q13_twoFactors: responses.q13_twoFactors,
      q14_tradeOff: responses.q14_tradeOff,
      q15_maxTime: responses.q15_maxTime,
      q16_securityEnough: responses.q16_securityEnough || '',
      q17_temptedGiveUp: responses.q17_temptedGiveUp || '',
      q18_mostAnnoying: responses.q18_mostAnnoying || '',
      q19_mostReassuring: responses.q19_mostReassuring || '',
      q20_additionalComments: responses.q20_additionalComments || '',
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={{ margin: '0 0 4px', color: '#003366' }}>Final Survey</h2>
          <p style={styles.subtitle}>
            You've completed all authentication levels. Please answer the following questions comparing your overall experience.
          </p>
        </div>


        <div style={styles.sectionHeader}>Section 3 — Cross-Test Comparison</div>

        {/* Q10 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>10.</span> At which level did security feel "sufficient"?
          </p>
          <div style={styles.optionGrid}>
            {TEST_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => set('q10_sufficientLevel', opt)}
                style={{
                  ...styles.optionBtn,
                  background: responses.q10_sufficientLevel === opt ? '#0056b3' : '#f0f2f5',
                  color: responses.q10_sufficientLevel === opt ? 'white' : '#555',
                  border: responses.q10_sufficientLevel === opt ? '2px solid #003366' : '2px solid #ddd',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q11 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>11.</span> At which level did you first feel noticeably annoyed?
          </p>
          <div style={styles.optionGrid}>
            {TEST_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => set('q11_annoyedLevel', opt)}
                style={{
                  ...styles.optionBtn,
                  background: responses.q11_annoyedLevel === opt ? '#0056b3' : '#f0f2f5',
                  color: responses.q11_annoyedLevel === opt ? 'white' : '#555',
                  border: responses.q11_annoyedLevel === opt ? '2px solid #003366' : '2px solid #ddd',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q12 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>12.</span> Which version would you prefer to use daily?
          </p>
          <div style={styles.optionGrid}>
            {TEST_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => set('q12_preferDaily', opt)}
                style={{
                  ...styles.optionBtn,
                  background: responses.q12_preferDaily === opt ? '#0056b3' : '#f0f2f5',
                  color: responses.q12_preferDaily === opt ? 'white' : '#555',
                  border: responses.q12_preferDaily === opt ? '2px solid #003366' : '2px solid #ddd',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q13 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>13.</span> If forced to choose only <strong>TWO</strong> authentication factors, which would you pick?
          </p>
          <p style={styles.helperText}>Select exactly 2</p>
          <div style={styles.optionGrid}>
            {FACTOR_OPTIONS.map(factor => {
              const selected = (responses.q13_twoFactors || []).includes(factor);
              return (
                <button
                  key={factor}
                  type="button"
                  onClick={() => toggleFactor(factor)}
                  style={{
                    ...styles.optionBtn,
                    background: selected ? '#0056b3' : '#f0f2f5',
                    color: selected ? 'white' : '#555',
                    border: selected ? '2px solid #003366' : '2px solid #ddd',
                  }}
                >
                  {factor}
                </button>
              );
            })}
          </div>
        </div>

        {/* Q14 — Likert */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>14.</span> "Adding more authentication steps improves security, but reduces usability."
          </p>
          <div style={styles.scaleRow}>
            {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((label, i) => {
              const value = i + 1;
              const isSelected = responses.q14_tradeOff === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('q14_tradeOff', value)}
                  style={{
                    ...styles.scaleBtn,
                    background: isSelected ? '#0056b3' : '#f0f2f5',
                    color: isSelected ? 'white' : '#555',
                    border: isSelected ? '2px solid #003366' : '2px solid #ddd',
                    fontWeight: isSelected ? 'bold' : 'normal',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{value}</span>
                  <span style={{ fontSize: '0.6rem', marginTop: '2px', textAlign: 'center', lineHeight: '1.2' }}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Q15 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>15.</span> What is the maximum time you would tolerate for logging into a high-security system?
          </p>
          <div style={styles.optionGrid}>
            {TIME_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => set('q15_maxTime', opt)}
                style={{
                  ...styles.optionBtn,
                  background: responses.q15_maxTime === opt ? '#0056b3' : '#f0f2f5',
                  color: responses.q15_maxTime === opt ? 'white' : '#555',
                  border: responses.q15_maxTime === opt ? '2px solid #003366' : '2px solid #ddd',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>


        <div style={{ ...styles.sectionHeader, marginTop: '20px' }}>Section 4 — Qualitative Questions</div>

        {/* Q16 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>16.</span> At what point did security feel "enough"? Why?
          </p>
          <textarea
            value={responses.q16_securityEnough || ''}
            onChange={e => set('q16_securityEnough', e.target.value)}
            placeholder="Your answer..."
            style={styles.textarea}
            rows={3}
          />
        </div>

        {/* Q17 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>17.</span> At what point did you feel tempted to give up? Why?
          </p>
          <textarea
            value={responses.q17_temptedGiveUp || ''}
            onChange={e => set('q17_temptedGiveUp', e.target.value)}
            placeholder="Your answer..."
            style={styles.textarea}
            rows={3}
          />
        </div>

        {/* Q18 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>18.</span> Which authentication factor felt the most annoying? Why?
          </p>
          <textarea
            value={responses.q18_mostAnnoying || ''}
            onChange={e => set('q18_mostAnnoying', e.target.value)}
            placeholder="Your answer... (optional)"
            style={styles.textarea}
            rows={3}
          />
        </div>

        {/* Q19 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>19.</span> Which authentication factor felt the most reassuring? Why?
          </p>
          <textarea
            value={responses.q19_mostReassuring || ''}
            onChange={e => set('q19_mostReassuring', e.target.value)}
            placeholder="Your answer... (optional)"
            style={styles.textarea}
            rows={3}
          />
        </div>

        {/* Q20 */}
        <div style={styles.questionBlock}>
          <p style={styles.questionText}>
            <span style={styles.qNum}>20.</span> Any additional comments about balancing security and usability?
          </p>
          <textarea
            value={responses.q20_additionalComments || ''}
            onChange={e => set('q20_additionalComments', e.target.value)}
            placeholder="Your answer... (optional)"
            style={styles.textarea}
            rows={3}
          />
        </div>

        {/* Warning */}
        {showWarning && (
          <div style={styles.warning}>
            Please answer all required questions (Q10-Q17) before submitting.
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} style={styles.submitBtn}>
          Complete Study
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '30px',
    paddingBottom: '30px',
    background: '#f0f2f5',
    fontFamily: 'Segoe UI, sans-serif',
    boxSizing: 'border-box',
  },
  card: {
    background: 'white',
    padding: '35px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '25px',
  },
  subtitle: {
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    margin: 0,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#003366',
    padding: '10px 0 4px',
    borderBottom: '2px solid #003366',
    marginBottom: '14px',
  },
  questionBlock: {
    padding: '14px 16px',
    background: '#fafbfc',
    borderRadius: '10px',
    border: '1px solid #eee',
    marginBottom: '14px',
  },
  questionText: {
    margin: '0 0 10px',
    fontSize: '0.93rem',
    color: '#333',
    lineHeight: '1.4',
  },
  qNum: {
    fontWeight: 'bold',
    color: '#0056b3',
  },
  helperText: {
    fontSize: '0.78rem',
    color: '#888',
    margin: '0 0 8px',
    fontStyle: 'italic',
  },
  optionGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  optionBtn: {
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.15s ease',
    textAlign: 'center',
  },
  scaleRow: {
    display: 'flex',
    gap: '6px',
  },
  scaleBtn: {
    flex: 1,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 4px',
    minHeight: '52px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '0.93rem',
    fontFamily: 'Segoe UI, sans-serif',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
  },
  warning: {
    marginTop: '15px',
    padding: '10px',
    background: '#fff3cd',
    color: '#856404',
    borderRadius: '8px',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: '20px',
    width: '100%',
    padding: '15px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
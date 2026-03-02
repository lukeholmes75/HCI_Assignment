
import React, { useState } from 'react';

type Props = {
  taskName: string;
  level: number;
  onSubmit: (responses: QuestionnaireData) => void;
};

export type QuestionnaireData = {
  q1_ease: number;
  q2_mentalEffort: number;
  q3_timeAcceptability: number;
  q4_frustration: number;
  q5_abandonLikelihood: number;
  q6_perceivedSecurity: number;
  q7_trustProtection: number;
  q8_securityUsabilityBalance: number;
  q9_riskWithout: number;
};

const QUESTIONS = [
  // Section A: Usability
  {
    id: 'q1_ease',
    section: 'Usability',
    text: 'Completing this login process was easy.',
    labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  {
    id: 'q2_mentalEffort',
    section: 'Usability',
    text: 'How mentally demanding was this authentication process?',
    labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
  },
  {
    id: 'q3_timeAcceptability',
    section: 'Usability',
    text: 'The time required to complete this authentication was acceptable.',
    labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  {
    id: 'q4_frustration',
    section: 'Usability',
    text: 'How frustrated did you feel during this authentication process?',
    labels: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'],
  },
  {
    id: 'q5_abandonLikelihood',
    section: 'Usability',
    text: 'If this were a real system, how likely would you be to give up midway?',
    labels: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
  },
  // Section B: Security Perception
  {
    id: 'q6_perceivedSecurity',
    section: 'Security',
    text: 'How secure did this login method feel?',
    labels: ['Very Insecure', 'Insecure', 'Neutral', 'Secure', 'Very Secure'],
  },
  {
    id: 'q7_trustProtection',
    section: 'Security',
    text: 'I trust that this authentication method would prevent unauthorized access.',
    labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  {
    id: 'q8_securityUsabilityBalance',
    section: 'Security',
    text: 'The level of security provided justifies the effort required.',
    labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  {
    id: 'q9_riskWithout',
    section: 'Security',
    text: 'If this authentication method were removed, I would feel concerned.',
    labels: ['Not Concerned', 'Slightly', 'Moderately', 'Very', 'Extremely'],
  },
];

export default function Questionnaire({ taskName, level, onSubmit }: Props) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showWarning, setShowWarning] = useState(false);

  const handleSelect = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    if (showWarning) setShowWarning(false);
  };

  const handleSubmit = () => {
    const allAnswered = QUESTIONS.every(q => responses[q.id] !== undefined);
    if (!allAnswered) {
      setShowWarning(true);
      return;
    }

    onSubmit({
      q1_ease: responses['q1_ease'],
      q2_mentalEffort: responses['q2_mentalEffort'],
      q3_timeAcceptability: responses['q3_timeAcceptability'],
      q4_frustration: responses['q4_frustration'],
      q5_abandonLikelihood: responses['q5_abandonLikelihood'],
      q6_perceivedSecurity: responses['q6_perceivedSecurity'],
      q7_trustProtection: responses['q7_trustProtection'],
      q8_securityUsabilityBalance: responses['q8_securityUsabilityBalance'],
      q9_riskWithout: responses['q9_riskWithout'],
    });
  };

  const allAnswered = QUESTIONS.every(q => responses[q.id] !== undefined);
  let currentSection = '';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={{ margin: '0 0 4px', color: '#003366' }}>Post-Task Questionnaire</h2>
          <p style={styles.subtitle}>
            You completed <strong>{taskName}</strong> with{' '}
            <strong>{level} authentication step{level !== 1 ? 's' : ''}</strong>.
          </p>
        </div>

        {/* Questions */}
        <div style={styles.questionsContainer}>
          {QUESTIONS.map((q, qIndex) => {
            let sectionHeader = null;
            if (q.section !== currentSection) {
              currentSection = q.section;
              sectionHeader = (
                <div key={`section-${q.section}`} style={styles.sectionHeader}>
                  {q.section === 'Usability' ? 'A. Usability Metrics' : 'B. Security Perception'}
                </div>
              );
            }

            return (
              <React.Fragment key={q.id}>
                {sectionHeader}
                <div style={styles.questionBlock}>
                  <p style={styles.questionText}>
                    <span style={styles.questionNumber}>{qIndex + 1}.</span> {q.text}
                  </p>

                  <div style={styles.scaleRow}>
                    {q.labels.map((label, i) => {
                      const value = i + 1;
                      const isSelected = responses[q.id] === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleSelect(q.id, value)}
                          style={{
                            ...styles.scaleBtn,
                            background: isSelected ? '#0056b3' : '#f0f2f5',
                            color: isSelected ? 'white' : '#555',
                            border: isSelected ? '2px solid #003366' : '2px solid #ddd',
                            fontWeight: isSelected ? 'bold' : 'normal',
                          }}
                        >
                          <span style={styles.scaleBtnNumber}>{value}</span>
                          <span style={styles.scaleBtnLabel}>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {showWarning && (
          <div style={styles.warning}>
            Please answer all questions before submitting.
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            ...styles.submitBtn,
            opacity: allAnswered ? 1 : 0.6,
          }}
        >
          Submit Feedback
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
    marginBottom: '4px',
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  questionBlock: {
    padding: '14px 16px',
    background: '#fafbfc',
    borderRadius: '10px',
    border: '1px solid #eee',
  },
  questionText: {
    margin: '0 0 10px',
    fontSize: '0.93rem',
    color: '#333',
    lineHeight: '1.4',
  },
  questionNumber: {
    fontWeight: 'bold',
    color: '#0056b3',
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
  scaleBtnNumber: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  scaleBtnLabel: {
    fontSize: '0.62rem',
    marginTop: '2px',
    textAlign: 'center',
    lineHeight: '1.2',
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
    background: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};
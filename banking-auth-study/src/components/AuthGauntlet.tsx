import React, { useState } from 'react';

type Props = {
  level: number;
  taskName: string;
  onComplete: (data: { timeTaken: number; errors: number }) => void;
  onCancel: () => void;
};

export default function AuthGauntlet({ level, taskName, onComplete, onCancel }: Props) {
  const [stage, setStage] = useState(0); 
  const [input, setInput] = useState('');
  const [startTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = false;

    // Validation Logic
    if (stage === 0 && input === '1234') isValid = true;       
    else if (stage === 1 && input === 'password') isValid = true;   
    else if (stage === 2 && input === '159') isValid = true;     
    else if (stage === 3) isValid = true;                           

    if (isValid) {
      if (stage + 1 >= level) {
        onComplete({ timeTaken: (Date.now() - startTime) / 1000, errors });
      } else {
        setStage(stage + 1);
        setInput('');
      }
    } else {
      setErrors(errors + 1);
      alert("Incorrect! Try again.");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', textAlign: 'center', fontFamily: 'Arial' }}>
      <h2>Security Check</h2>
      <p>Task: <strong>{taskName}</strong></p>
      <p>Step {stage + 1} of {level}</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {stage === 0 && (
          <div><label>Enter PIN (1234)</label><br/><input type="text" value={input} onChange={e=>setInput(e.target.value)} autoFocus style={{padding: '8px', fontSize: '1.2rem'}}/></div>
        )}
        {stage === 1 && (
          <div><label>Enter Password (password)</label><br/><input type="password" value={input} onChange={e=>setInput(e.target.value)} autoFocus style={{padding: '8px', fontSize: '1.2rem'}}/></div>
        )}
        {stage === 2 && (
          <div><label>Enter Pattern (159)</label><br/><input type="text" value={input} onChange={e=>setInput(e.target.value)} autoFocus style={{padding: '8px', fontSize: '1.2rem'}}/></div>
        )}
        {stage === 3 && (
          <div><label>Face ID Required</label><br/><button type="button" onClick={handleSubmit} style={{padding: '15px', background: 'lightgreen', width: '100%', cursor: 'pointer'}}>Scan Face</button></div>
        )}

        {stage !== 3 && <button type="submit" style={{ padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>Next</button>}
      </form>
      <button onClick={onCancel} style={{ marginTop: '30px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel Transaction</button>
    </div>
  );
}
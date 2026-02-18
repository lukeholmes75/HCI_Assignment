import React from 'react';

type Props = {
  onStartTask: (level: number, taskName: string) => void;
};

export default function Dashboard({ onStartTask }: Props) {
  const btnStyle = { 
    padding: '15px', 
    fontSize: '1.1rem', 
    cursor: 'pointer', 
    textAlign: 'left' as const,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #333' }}>HCS Bank</h1>
      <div style={{ background: '#eee', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
        <h3>Current Balance</h3>
        <h2 style={{ fontSize: '3rem', margin: '10px 0' }}>£12,450.00</h2>
      </div>

      <h3>Select a Transaction:</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => onStartTask(1, "View Statement")} style={btnStyle}>
          📄 View Statement (Low Security)
        </button>
        <button onClick={() => onStartTask(2, "Transfer £20")} style={btnStyle}>
          💸 Transfer £20 (Medium Security)
        </button>
        <button onClick={() => onStartTask(3, "Change Address")} style={btnStyle}>
          🏠 Change Address (High Security)
        </button>
        <button onClick={() => onStartTask(4, "Transfer £10,000")} style={btnStyle}>
          🚀 Transfer £10,000 (Max Security)
        </button>
      </div>
    </div>
  );
}
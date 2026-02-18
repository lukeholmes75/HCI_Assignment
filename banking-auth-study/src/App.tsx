import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthGauntlet from './components/AuthGauntlet';
import Statement from './components/Statement';
import Transfer from './components/Transfer';
import SuccessView from './components/SuccessView';

function App() {
  // 1. STATE MANAGEMENT
  // Tracks which screen is currently visible
  const [view, setView] = useState<'login' | 'dash' | 'statement' | 'transfer' | 'success'>('login');
  
  // Tracks if the Security Pop-up is open
  const [showModal, setShowModal] = useState(false);
  
  // Tracks data for the current experiment task
  const [level, setLevel] = useState(1);
  const [taskName, setTaskName] = useState('');
  const [lastResult, setLastResult] = useState({ timeTaken: 0, errors: 0 });

  // 2. HANDLERS

  // Login -> Dashboard
  const handleAppLogin = () => {
    setView('dash');
  };

  // Dashboard Button Click -> Open Security Modal
  const startTask = (lvl: number, name: string) => {
    setLevel(lvl);
    setTaskName(name);
    setShowModal(true); // Open the pop-up
  };

  // Security Modal Complete -> Route to the correct page
  const finishTask = (data: { timeTaken: number; errors: number }) => {
    setShowModal(false); // Close the pop-up
    setLastResult(data); // Save the timing/error data to show later

    // ROUTING LOGIC: Where do we go after security?
    if (taskName === "View Statement") {
      setView('statement');
    } 
    else if (taskName === "Pay a Friend") {
      setView('transfer');
    }
    else {
      // For tasks without a specific page (Level 3 & 4), go straight to success receipt
      setView('success');
    }
  };

  // Transfer Page "Confirm" Click -> Show Success Receipt
  const completeSubTask = () => {
    setView('success');
  };

  // 3. RENDER
  return (
    <div>
      {/* SCREEN 1: LOGIN */}
      {view === 'login' && (
        <Login onLogin={handleAppLogin} />
      )}
      
      {/* SCREEN 2: DASHBOARD (The Hub) */}
      {view === 'dash' && (
        <>
          <Dashboard onStartTask={startTask} />
          
          {/* The Security Modal lives here so it overlays the dashboard */}
          {showModal && (
            <AuthGauntlet 
              level={level} 
              taskName={taskName} 
              onComplete={finishTask} 
              onCancel={() => setShowModal(false)} 
            />
          )}
        </>
      )}

      {/* SCREEN 3: STATEMENTS (Level 1 Reward) */}
      {view === 'statement' && (
        <Statement onBack={() => setView('dash')} />
      )}

      {/* SCREEN 4: TRANSFER MONEY (Level 2 Reward) */}
      {view === 'transfer' && (
        <Transfer 
          onBack={() => setView('dash')} 
          onConfirm={completeSubTask} 
        />
      )}

      {/* SCREEN 5: SUCCESS RECEIPT (Shows Study Data) */}
      {view === 'success' && (
        <SuccessView 
          taskName={taskName} 
          stats={lastResult} 
          onHome={() => setView('dash')} 
        />
      )}
    </div>
  );
}

export default App;
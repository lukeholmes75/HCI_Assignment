import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthGauntlet from './components/AuthGauntlet';
import Statement from './components/Statement';
import Transfer from './components/Transfer';
import UpdateAddress from './components/UpdateAddress'; // <--- NEW IMPORT
import SuccessView from './components/SuccessView';

function App() {
  // 1. STATE MANAGEMENT
  // Tracks which screen is visible. Added 'address' to the list.
  const [view, setView] = useState<'login' | 'dash' | 'statement' | 'transfer' | 'address' | 'success'>('login');
  
  const [showModal, setShowModal] = useState(false);
  
  // Study Data State
  const [level, setLevel] = useState(1);
  const [taskName, setTaskName] = useState('');
  const [lastResult, setLastResult] = useState({ timeTaken: 0, errors: 0 });

  // 2. HANDLERS

  const handleAppLogin = () => {
    setView('dash');
  };

  const startTask = (lvl: number, name: string) => {
    setLevel(lvl);
    setTaskName(name);
    setShowModal(true);
  };

  // ROUTING LOGIC: Decides where to go after the Security Check
  const finishTask = (data: { timeTaken: number; errors: number }) => {
    setShowModal(false); 
    setLastResult(data); 

    console.log("Task Finished:", taskName);

    // 1. View Statement
    if (taskName.includes("Statement")) {
      setView('statement');
    } 
    // 2. Transfers (Small OR Large)
    else if (taskName.includes("Pay") || taskName.includes("Transfer")) {
      setView('transfer');
    }
    // 3. Update Address (NEW)
    else if (taskName.includes("Address") || taskName.includes("Update")) {
      setView('address');
    }
    // 4. Fallback (Go straight to success if no page exists)
    else {
      setView('success');
    }
  };

  const completeSubTask = () => {
    setView('success');
  };

  // Helper: Decides if transfer is £20 or £10,000 based on the button clicked
  const getTransferAmount = () => {
    if (taskName.includes("Large") || taskName.includes("10k")) {
      return "10,000.00";
    }
    return "20.00";
  };

  // 3. RENDER
  return (
    <div>
      {/* SCREEN 1: LOGIN */}
      {view === 'login' && (
        <Login onLogin={handleAppLogin} />
      )}
      
      {/* SCREEN 2: DASHBOARD */}
      {view === 'dash' && (
        <>
          <Dashboard onStartTask={startTask} />
          {/* Security Modal overlays the dashboard */}
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

      {/* SCREEN 3: STATEMENT */}
      {view === 'statement' && (
        <Statement onBack={() => setView('dash')} />
      )}

      {/* SCREEN 4: TRANSFER MONEY */}
      {view === 'transfer' && (
        <Transfer 
          onBack={() => setView('dash')} 
          onConfirm={completeSubTask} 
          initialAmount={getTransferAmount()} 
        />
      )}

      {/* SCREEN 5: UPDATE ADDRESS */}
      {view === 'address' && (
        <UpdateAddress 
          onBack={() => setView('dash')} 
          onConfirm={completeSubTask} 
        />
      )}

      {/* SCREEN 6: SUCCESS RECEIPT */}
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
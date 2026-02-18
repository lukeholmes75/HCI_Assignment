// src/App.tsx
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthGauntlet from './components/AuthGauntlet';

function App() {
  // We added 'login' as the starting view
  const [view, setView] = useState<'login' | 'dash' | 'auth'>('login');
  const [level, setLevel] = useState(1);
  const [taskName, setTaskName] = useState('');

  // 1. Handle the initial login
  const handleAppLogin = () => {
    setView('dash');
  };

  // 2. Start a specific security task
  const startTask = (lvl: number, name: string) => {
    setLevel(lvl);
    setTaskName(name);
    setView('auth');
  };

  // 3. Handle task completion
  const finishTask = (data: { timeTaken: number; errors: number }) => {
    console.log(`RESULTS: Level ${level}, Time: ${data.timeTaken}s, Errors: ${data.errors}`);
    alert(`Task Complete! \nTime: ${data.timeTaken}s \nErrors: ${data.errors}`);
    setView('dash');
  };

  return (
    <div>
      {/* View Switcher Logic */}
      {view === 'login' && (
        <Login onLogin={handleAppLogin} />
      )}
      
      {view === 'dash' && (
        <Dashboard onStartTask={startTask} />
      )}
      
      {view === 'auth' && (
        <AuthGauntlet 
          level={level} 
          taskName={taskName} 
          onComplete={finishTask} 
          onCancel={() => setView('dash')} 
        />
      )}
    </div>
  );
}

export default App;
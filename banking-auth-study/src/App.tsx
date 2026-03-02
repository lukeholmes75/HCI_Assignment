import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthGauntlet from './components/AuthGauntlet';
import type { AuthResult } from './components/AuthGauntlet';
import Statement from './components/Statement';
import Transfer from './components/Transfer';
import UpdateAddress from './components/UpdateAddress';
import SuccessView from './components/SuccessView';
import Questionnaire from './components/Questionnaire';
import type { QuestionnaireData } from './components/Questionnaire';
import FinalSurvey from './components/FinalSurvey';
import type { FinalSurveyData } from './components/FinalSurvey';
import StudyLogger from './components/StudyLogger';
import type { TaskRecord } from './components/StudyLogger';

function App() {

  const [view, setView] = useState<
    'login' | 'dash' | 'statement' | 'transfer' | 'address' | 'questionnaire' | 'success' | 'finalsurvey' | 'studycomplete'
  >('login');

  const [showModal, setShowModal] = useState(false);


  const [level, setLevel] = useState(1);
  const [taskName, setTaskName] = useState('');
  const [lastResult, setLastResult] = useState<AuthResult>({ timeTaken: 0, errors: 0, stageTimes: [] });


  const [pendingView, setPendingView] = useState<'statement' | 'transfer' | 'address' | 'success'>('success');
  const [hasShownTaskScreen, setHasShownTaskScreen] = useState(false);


  const [studyRecords, setStudyRecords] = useState<TaskRecord[]>([]);
  const [participantId, setParticipantId] = useState('P01');
  const [finalSurveyData, setFinalSurveyData] = useState<FinalSurveyData | null>(null);

 
  const [userPin, setUserPin] = useState('');
  const [userPetName, setUserPetName] = useState('');

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [showExportDismissed, setShowExportDismissed] = useState(false);

  const allTasksComplete = completedTasks.size >= 4;

 

  const handleAppLogin = (credentials: { pin: string; petName: string }) => {
    setUserPin(credentials.pin);
    setUserPetName(credentials.petName);
    setView('dash');
  };

  const startTask = (lvl: number, name: string) => {
    setLevel(lvl);
    setTaskName(name);
    setShowModal(true);
    setHasShownTaskScreen(false);
  };

  
  const finishAuth = (data: AuthResult) => {
    setShowModal(false);
    setLastResult(data);

    if (taskName.includes('Statement')) {
      setPendingView('statement');
      setView('statement');
    } else if (taskName.includes('Pay') || taskName.includes('Transfer')) {
      setPendingView('transfer');
      setView('transfer');
    } else if (taskName.includes('Address') || taskName.includes('Update')) {
      setPendingView('address');
      setView('address');
    } else {
      setPendingView('success');
      setView('questionnaire');
    }
  };


  const completeSubTask = () => {
    setView('questionnaire');
  };


  const handleQuestionnaireSubmit = (responses: QuestionnaireData) => {
    const record: TaskRecord = {
      participantId,
      taskName,
      authLevel: level,
      timeTaken: lastResult.timeTaken,
      errors: lastResult.errors,
      stageTimes: lastResult.stageTimes,
      questionnaire: responses,
      timestamp: new Date().toISOString(),
    };
    setStudyRecords(prev => [...prev, record]);
    setCompletedTasks(prev => new Set(prev).add(taskName));
    setView('success');
  };


  const handleFinalSurveySubmit = (data: FinalSurveyData) => {
    setFinalSurveyData(data);
    setView('studycomplete');
  };

  
  const exportFinalSurveyCSV = () => {
    if (!finalSurveyData) return;
    const d = finalSurveyData;
    const headers = [
      'Participant_ID',
      'Q10_SufficientLevel',
      'Q11_AnnoyedLevel',
      'Q12_PreferDaily',
      'Q13_TwoFactors',
      'Q14_TradeOff',
      'Q15_MaxTime',
      'Q16_SecurityEnough',
      'Q17_TemptedGiveUp',
      'Q18_MostAnnoying',
      'Q19_MostReassuring',
      'Q20_AdditionalComments',
    ];
    const row = [
      participantId,
      `"${d.q10_sufficientLevel}"`,
      `"${d.q11_annoyedLevel}"`,
      `"${d.q12_preferDaily}"`,
      `"${d.q13_twoFactors.join(' + ')}"`,
      d.q14_tradeOff,
      `"${d.q15_maxTime}"`,
      `"${d.q16_securityEnough.replace(/"/g, '""')}"`,
      `"${d.q17_temptedGiveUp.replace(/"/g, '""')}"`,
      `"${d.q18_mostAnnoying.replace(/"/g, '""')}"`,
      `"${d.q19_mostReassuring.replace(/"/g, '""')}"`,
      `"${d.q20_additionalComments.replace(/"/g, '""')}"`,
    ];
    const csv = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `final_survey_${participantId}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };


  const getTransferAmount = () => {
    if (taskName.includes('Large') || taskName.includes('10k')) {
      return '10,000.00';
    }
    return '20.00';
  };

  return (
    <div>
      {/* SCREEN 1: LOGIN */}
      {view === 'login' && <Login onLogin={handleAppLogin} />}

      {/* SCREEN 2: DASHBOARD */}
      {view === 'dash' && (
        <>
          <Dashboard onStartTask={startTask} />

          {showModal && (
            <AuthGauntlet
              level={level}
              taskName={taskName}
              userPin={userPin}
              userPetName={userPetName}
              onComplete={finishAuth}
              onCancel={() => setShowModal(false)}
            />
          )}
        </>
      )}

      {/* POPUP: Appears when all 4 tasks are done — reminds to export + take final survey */}
      {allTasksComplete && !finalSurveyData && !showExportDismissed && (view === 'dash' || view === 'success') && (
        <div style={popupOverlayStyle}>
          <div style={popupCardStyle}>
            
            <h2 style={{ margin: '0 0 8px', color: '#003366' }}>All Tasks Complete!</h2>
            <p style={{ color: '#666', fontSize: '0.93rem', marginBottom: '20px', lineHeight: '1.5' }}>
              Before continuing, please export the task data using the <strong>Study Logger button in the bottom-right corner</strong>, then take the final survey.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => { setShowExportDismissed(true); setView('finalsurvey'); }} style={finalSurveyBtnStyle}>
                Take Final Survey →
              </button>
              <button onClick={() => setShowExportDismissed(true)} style={dismissBtnStyle}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 3: STATEMENT */}
      {view === 'statement' && (
        <Statement onBack={() => setView('questionnaire')} />
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

      {/* SCREEN 6: POST-TASK QUESTIONNAIRE */}
      {view === 'questionnaire' && (
        <Questionnaire
          taskName={taskName}
          level={level}
          onSubmit={handleQuestionnaireSubmit}
        />
      )}

      {/* SCREEN 7: SUCCESS RECEIPT */}
      {view === 'success' && (
        <SuccessView
          taskName={taskName}
          stats={lastResult}
          onHome={() => setView('dash')}
        />
      )}

      {/* SCREEN 8: FINAL SURVEY */}
      {view === 'finalsurvey' && (
        <FinalSurvey onSubmit={handleFinalSurveySubmit} />
      )}

      {/* SCREEN 9: STUDY COMPLETE */}
      {view === 'studycomplete' && (
        <div style={completedContainerStyle}>
          <div style={completedCardStyle}>
            
            <h1 style={{ color: '#28a745', margin: '0 0 10px' }}>Study Complete</h1>
            <p style={{ color: '#666', marginBottom: '25px' }}>
              Thank you for participating. All your responses have been recorded.
            </p>
            <button onClick={exportFinalSurveyCSV} style={exportBtnStyle}>
              Export Final Survey CSV
            </button>
            <button onClick={() => setView('dash')} style={homeBtnStyle}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* FLOATING STUDY LOGGER — always visible after login */}
      {view !== 'login' && (
        <StudyLogger
          records={studyRecords}
          participantId={participantId}
          onSetParticipantId={setParticipantId}
          onClearData={() => setStudyRecords([])}
        />
      )}
    </div>
  );
}


const popupOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9500,
};

const popupCardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '16px',
  padding: '35px',
  maxWidth: '420px',
  width: '90%',
  textAlign: 'center',
  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
  fontFamily: 'Segoe UI, sans-serif',
};

const finalSurveyBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const dismissBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  background: 'none',
  color: '#666',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const completedContainerStyle: React.CSSProperties = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#f0f2f5',
  fontFamily: 'Segoe UI, sans-serif',
};

const completedCardStyle: React.CSSProperties = {
  background: 'white',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  textAlign: 'center',
  maxWidth: '450px',
  width: '90%',
};

const exportBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginBottom: '10px',
};

const homeBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: '#0056b3',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default App;
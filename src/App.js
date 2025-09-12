import React, { useState } from 'react';
import DriverAppLanding from './components/DriverAppLanding';
import DriverDashboard from './components/DriverDashboard';
import LoadWorkFlow from './components/LoadWorkFlow';  // Changed to match your file name
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');

  const handleAuthSuccess = () => {
    setCurrentScreen('dashboard');
  };

  const handleLoadAssigned = () => {
    setCurrentScreen('loadWorkflow');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const renderCurrentScreen = () => {
    switch(currentScreen) {
      case 'landing':
        return <DriverAppLanding onAuthSuccess={handleAuthSuccess} />;
      case 'dashboard':
        return <DriverDashboard onLoadAssigned={handleLoadAssigned} />;
      case 'loadWorkflow':
        return <LoadWorkFlow onBack={handleBackToDashboard} />;  // Updated component name
      default:
        return <DriverAppLanding onAuthSuccess={handleAuthSuccess} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
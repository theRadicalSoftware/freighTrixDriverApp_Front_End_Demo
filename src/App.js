import React, { useState } from 'react';
import DriverAppLanding from './components/DriverAppLanding';
import DriverDashboard from './components/DriverDashboard';
import LoadWorkFlow from './components/LoadWorkFlow';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [loadWorkflowState, setLoadWorkflowState] = useState({
    hasActiveLoad: false,
    currentStep: 'loadOffer',
    loadData: null,
    requirements: [
      { task: 'Load 1 pallet with reference #US3111U5', completed: false },
      { task: 'Take pictures of the cargo loaded and secured on your truck', completed: false },
      { task: 'Take picture of the trailer seal', completed: false },
      { task: 'Take picture of the trailer temperature setting', completed: false },
      { task: 'Shipper signs first and last name on paperwork with in and out time', completed: false }
    ]
  });

  const handleAuthSuccess = () => {
    setCurrentScreen('dashboard');
    // Automatically assign a demo load upon successful authentication
    setLoadWorkflowState(prev => ({
      ...prev,
      hasActiveLoad: true,
      currentStep: 'loadOffer',
      loadData: {
        id: 'FT-2024-1247',
        origin: 'Chicago, IL',
        destination: 'Denver, CO',
        payment: '$2,850',
        distance: '1,003 mi',
        weight: '42,500 lbs'
      }
    }));
  };

  const handleLoadAssigned = () => {
    setCurrentScreen('dashboard'); // Stay on dashboard but show workflow
    setLoadWorkflowState(prev => ({
      ...prev,
      hasActiveLoad: true,
      currentStep: 'loadOffer',
      loadData: {
        id: 'FT-2024-1247',
        origin: 'Chicago, IL',
        destination: 'Denver, CO',
        payment: '$2,850',
        distance: '1,003 mi',
        weight: '42,500 lbs'
      }
    }));
  };

  const handleWorkflowStepChange = (step, updatedData = {}) => {
    setLoadWorkflowState(prev => ({
      ...prev,
      currentStep: step,
      ...updatedData
    }));
  };

  const handleWorkflowComplete = () => {
    setLoadWorkflowState({
      hasActiveLoad: false,
      currentStep: 'loadOffer',
      loadData: null,
      requirements: [
        { task: 'Load 1 pallet with reference #US3111U5', completed: false },
        { task: 'Take pictures of the cargo loaded and secured on your truck', completed: false },
        { task: 'Take picture of the trailer seal', completed: false },
        { task: 'Take picture of the trailer temperature setting', completed: false },
        { task: 'Shipper signs first and last name on paperwork with in and out time', completed: false }
      ]
    });
    setCurrentScreen('dashboard');
  };

  const renderCurrentScreen = () => {
    switch(currentScreen) {
      case 'landing':
        return <DriverAppLanding onAuthSuccess={handleAuthSuccess} />;
      case 'dashboard':
        return (
          <DriverDashboard 
            onLoadAssigned={handleLoadAssigned}
            loadWorkflowState={loadWorkflowState}
            onWorkflowStepChange={handleWorkflowStepChange}
            onWorkflowComplete={handleWorkflowComplete}
          />
        );
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
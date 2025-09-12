import React, { useState, useEffect } from 'react';
import logoImage from '../logos/FreightTrixHeader_Graphic.png';

const LoadWorkflow = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState('loadOffer'); // loadOffer, accepted, navigation, arrival, confirmed, compliance, rolling, rollingConfirmed, routePlan
  const [showPulse, setShowPulse] = useState(true);
  const [requirements, setRequirements] = useState([
    { task: 'Load 1 pallet with reference #US3111U5', completed: false },
    { task: 'Take pictures of the cargo loaded and secured on your truck', completed: false },
    { task: 'Take picture of the trailer seal', completed: false },
    { task: 'Take picture of the trailer temperature setting', completed: false },
    { task: 'Shipper signs first and last name on paperwork with in and out time', completed: false }
  ]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleAcceptLoad = () => {
    setCurrentStep('accepted');
  };

  const handleDenyLoad = () => {
    onBack(); // Return to main dashboard
  };

  const handleStartGPS = () => {
    setCurrentStep('arrival');
  };

  const handleArrivalResponse = (arrived) => {
    if (arrived) {
      setCurrentStep('confirmed');
    }
  };

  const handleCompliance = () => {
    setCurrentStep('rolling');
  };

  const handleRollingResponse = (rolling) => {
    if (rolling) {
      setCurrentStep('rollingConfirmed');
    }
  };

  const handleViewRoutePlan = () => {
    setCurrentStep('routePlan');
  };

  const toggleRequirement = (index) => {
    const newRequirements = [...requirements];
    newRequirements[index].completed = !newRequirements[index].completed;
    setRequirements(newRequirements);
  };

  const renderLoadOffer = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Load Available</h2>
        <div style={styles.qualificationContainer}>
          <div style={styles.qualificationItem}>
            <div style={styles.checkmark}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
            </div>
            <span style={styles.qualificationText}>TAPA Qualified Driver</span>
          </div>
          <div style={styles.qualificationItem}>
            <div style={styles.checkmark}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
            </div>
            <span style={styles.qualificationText}>GDP Qualified Driver</span>
          </div>
        </div>
      </div>

      <div style={styles.loadDetailsCard}>
        <div style={styles.loadInfo}>
          <h3 style={styles.loadTitle}>Load #FT-2024-1247</h3>
          <p style={styles.loadRoute}>Chicago, IL → Denver, CO</p>
          <div style={styles.loadMeta}>
            <span style={styles.loadDistance}>1,003 miles</span>
            <span style={styles.loadPayment}>$2,850</span>
          </div>
          <div style={styles.loadTiming}>
            <p style={styles.timingText}>Pickup: Dec 13, 2024 • 8:00 AM</p>
            <p style={styles.timingText}>Delivery: Dec 15, 2024 • 2:30 PM</p>
          </div>
        </div>
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.acceptButton} onClick={handleAcceptLoad}>
          Accept
        </button>
        <button style={styles.denyButton} onClick={handleDenyLoad}>
          Deny
        </button>
      </div>
    </div>
  );

  const renderAccepted = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Load has been accepted</h2>
      </div>

      <div style={styles.requirementsCard}>
        <h3 style={styles.requirementsTitle}>Requirements</h3>
        <div style={styles.requirementsList}>
          {requirements.map((req, index) => (
            <div key={index} style={styles.requirementItem} onClick={() => toggleRequirement(index)}>
              <div style={{
                ...styles.requirementCheckbox,
                backgroundColor: req.completed ? '#00ff41' : 'transparent',
                border: req.completed ? '2px solid #00ff41' : '2px solid #666'
              }}>
                {req.completed && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <polyline points="20,6 9,17 4,12" stroke="#0d0208" strokeWidth="2"/>
                  </svg>
                )}
              </div>
              <span style={{
                ...styles.requirementText,
                color: req.completed ? '#e0e0e0' : '#999'
              }}>{req.task}</span>
            </div>
          ))}
        </div>
      </div>

      <button style={styles.continueButton} onClick={() => setCurrentStep('navigation')}>
        Continue to Pickup
      </button>
    </div>
  );

  const renderNavigation = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Go to pickup location</h2>
        <div style={styles.addressContainer}>
          <p style={styles.addressText}>2150 W Fulton St</p>
          <p style={styles.addressText}>Chicago, IL 60612</p>
        </div>
      </div>

      <button style={styles.gpsButton} onClick={handleStartGPS}>
        Start GPS
      </button>

      <div style={styles.mapCard}>
        <h3 style={styles.mapTitle}>Geofenced Route</h3>
        <div style={styles.mapContainer}>
          <svg width="100%" height="200" viewBox="0 0 400 200" style={styles.routeSvg}>
            {/* Geofenced area */}
            <rect x="10" y="40" width="380" height="120" fill="rgba(0, 255, 65, 0.1)" stroke="#00ff41" strokeWidth="2" strokeDasharray="5,5" rx="10"/>
            
            {/* Route line */}
            <path d="M 20 100 Q 100 50 200 100 T 380 100" stroke="#00ff41" strokeWidth="4" fill="none"/>
            
            {/* Origin marker */}
            <circle cx="20" cy="100" r="8" fill="#00ffff"/>
            <text x="20" y="130" textAnchor="middle" fill="#00ffff" fontSize="10">Start</text>
            
            {/* Destination marker */}
            <circle cx="380" cy="100" r="8" fill="#ff00ff"/>
            <text x="380" y="130" textAnchor="middle" fill="#ff00ff" fontSize="10">Pickup</text>
            
            {/* Current position */}
            <circle cx="20" cy="100" r="5" fill="#00ff41">
              <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
        <p style={styles.geofenceText}>Stay within the highlighted geofenced area</p>
      </div>
    </div>
  );

  const renderArrival = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <div style={styles.notificationBadge}>
          <span style={styles.notificationNumber}>1</span>
        </div>
        <h2 style={styles.stepTitle}>Notification</h2>
      </div>

      <div style={styles.questionCard}>
        <p style={styles.questionText}>Have you arrived on site for pickup at FNS in Chicago IL?</p>
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.acceptButton} onClick={() => handleArrivalResponse(true)}>
          Yes
        </button>
        <button style={styles.denyButton} onClick={() => handleArrivalResponse(false)}>
          No
        </button>
      </div>
    </div>
  );

  const renderConfirmed = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Confirmed!</h2>
      </div>

      <div style={styles.confirmationCard}>
        <p style={styles.confirmationText}>Onsite for pickup at 0800 has been logged</p>
      </div>

      <button style={styles.continueButton} onClick={handleCompliance}>
        View Compliance Checklist
      </button>
    </div>
  );

  const renderCompliance = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Compliance Checklist</h2>
      </div>

      <div style={styles.complianceCard}>
        {requirements.map((req, index) => (
          <div key={index} style={styles.complianceItem}>
            <div style={styles.complianceCheckmark}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
            </div>
            <span style={styles.complianceText}>{req.task}</span>
          </div>
        ))}
      </div>

      <button style={styles.continueButton} onClick={() => setCurrentStep('rolling')}>
        Complete Checklist
      </button>
    </div>
  );

  const renderRolling = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Ready to Depart</h2>
      </div>

      <div style={styles.questionCard}>
        <p style={styles.questionText}>Loaded and rolling?</p>
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.acceptButton} onClick={() => handleRollingResponse(true)}>
          Yes
        </button>
        <button style={styles.denyButton} onClick={() => handleRollingResponse(false)}>
          No
        </button>
      </div>
    </div>
  );

  const renderRollingConfirmed = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Confirmed!</h2>
      </div>

      <div style={styles.confirmationCard}>
        <p style={styles.confirmationText}>Loaded and rolling with 1 pallet for reference #US3111U5</p>
      </div>

      <button style={styles.continueButton} onClick={handleViewRoutePlan}>
        View Route Plan
      </button>
    </div>
  );

  const renderRoutePlan = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Route Plan</h2>
      </div>

      <div style={styles.routePlanCard}>
        <div style={styles.mapContainer}>
          <svg width="100%" height="250" viewBox="0 0 400 250" style={styles.routeSvg}>
            {/* Main geofenced route */}
            <path d="M 20 125 Q 100 75 200 125 T 380 125" stroke="#00ff41" strokeWidth="4" fill="none"/>
            <path d="M 15 120 Q 95 70 195 120 T 385 120" stroke="rgba(0, 255, 65, 0.3)" strokeWidth="20" fill="none"/>
            
            {/* Red zones (avoid stopping) */}
            <circle cx="120" cy="80" r="25" fill="rgba(255, 0, 64, 0.2)" stroke="#ff0040" strokeWidth="2"/>
            <text x="120" y="85" textAnchor="middle" fill="#ff0040" fontSize="8">AVOID</text>
            
            <circle cx="280" cy="160" r="25" fill="rgba(255, 0, 64, 0.2)" stroke="#ff0040" strokeWidth="2"/>
            <text x="280" y="165" textAnchor="middle" fill="#ff0040" fontSize="8">AVOID</text>
            
            {/* Green zones (approved stops) */}
            <rect x="180" y="40" width="40" height="25" fill="rgba(0, 255, 65, 0.2)" stroke="#00ff41" strokeWidth="2" rx="5"/>
            <text x="200" y="55" textAnchor="middle" fill="#00ff41" fontSize="7">FUEL</text>
            
            <rect x="320" y="180" width="40" height="25" fill="rgba(0, 255, 65, 0.2)" stroke="#00ff41" strokeWidth="2" rx="5"/>
            <text x="340" y="195" textAnchor="middle" fill="#00ff41" fontSize="7">YARD</text>
            
            {/* Origin and destination */}
            <circle cx="20" cy="125" r="8" fill="#00ffff"/>
            <text x="20" y="150" textAnchor="middle" fill="#00ffff" fontSize="10">Chicago</text>
            
            <circle cx="380" cy="125" r="8" fill="#ff00ff"/>
            <text x="380" y="150" textAnchor="middle" fill="#ff00ff" fontSize="10">Denver</text>
            
            {/* Current truck position */}
            <circle cx="40" cy="125" r="6" fill="#00ff41">
              <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>

        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: 'rgba(0, 255, 65, 0.3)'}}></div>
            <span style={styles.legendText}>Geofenced Route</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: 'rgba(255, 0, 64, 0.3)'}}></div>
            <span style={styles.legendText}>Avoid Stopping</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: 'rgba(0, 255, 65, 0.3)', border: '2px solid #00ff41'}}></div>
            <span style={styles.legendText}>Approved Stops</span>
          </div>
        </div>
      </div>

      <button style={styles.continueButton} onClick={onBack}>
        Complete Journey
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 'loadOffer': return renderLoadOffer();
      case 'accepted': return renderAccepted();
      case 'navigation': return renderNavigation();
      case 'arrival': return renderArrival();
      case 'confirmed': return renderConfirmed();
      case 'compliance': return renderCompliance();
      case 'rolling': return renderRolling();
      case 'rollingConfirmed': return renderRollingConfirmed();
      case 'routePlan': return renderRoutePlan();
      default: return renderLoadOffer();
    }
  };

  return (
    <div style={styles.container}>
      {/* Matrix Background */}
      <div style={styles.matrixBackground}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.matrixColumn,
              left: `${i * 8.33}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {[...Array(6)].map((_, j) => (
              <span key={j} style={styles.matrixChar}>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={styles.header}>
        <img src={logoImage} alt="FreighTrix" style={styles.logoImage} />
        <div style={styles.headerTitle}>Driver App</div>
      </div>

      {/* Main Content */}
      <div className="load-workflow-main-content" style={styles.mainContent}>
        {renderCurrentStep()}
      </div>

      {/* Bottom Navigation - Simplified */}
      <div style={styles.bottomNav}>
        <div style={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#00ff41" strokeWidth="2"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="#00ff41" strokeWidth="2"/>
          </svg>
          <span style={styles.navLabel}>Home</span>
        </div>
        <div style={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polygon points="3 6 9 9 15 15 21 12 21 18 15 21 9 15 3 12" stroke="#666" strokeWidth="2"/>
          </svg>
          <span style={{...styles.navLabel, color: '#666'}}>Route</span>
        </div>
        <div style={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="#666" strokeWidth="2"/>
          </svg>
          <span style={{...styles.navLabel, color: '#666'}}>Shipments</span>
        </div>
        <div style={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polyline points="9 11 12 14 22 4" stroke="#666" strokeWidth="2"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="#666" strokeWidth="2"/>
          </svg>
          <span style={{...styles.navLabel, color: '#666'}}>Compliance</span>
        </div>
        <div style={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#666" strokeWidth="2"/>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="#666" strokeWidth="2"/>
          </svg>
          <span style={{...styles.navLabel, color: '#666'}}>Settings</span>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
          
          @keyframes matrixFall {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          
          @keyframes slideIn {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }

          /* Hide scrollbars while keeping scroll functionality */
          .load-workflow-main-content::-webkit-scrollbar {
            display: none;
          }
          
          .load-workflow-main-content {
            -ms-overflow-style: none;
            scrollbar-width: none;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0d0208',
    color: '#e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  matrixBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    opacity: 0.06,
    zIndex: 0,
  },
  matrixColumn: {
    position: 'absolute',
    top: 0,
    fontSize: '10px',
    color: '#00ff41',
    animation: 'matrixFall 25s linear infinite',
    display: 'flex',
    flexDirection: 'column',
  },
  matrixChar: {
    display: 'block',
    marginBottom: '6px',
    fontFamily: 'monospace',
  },
  header: {
    zIndex: 1,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(13, 2, 8, 0.9)',
    gap: '1rem',
  },
  logoImage: {
    height: '32px',
    width: 'auto',
    filter: 'drop-shadow(0 0 6px rgba(0, 255, 65, 0.3))',
  },
  headerTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 600,
    background: 'linear-gradient(90deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
    padding: '1rem',
    paddingBottom: '100px',
    overflow: 'auto',
    animation: 'slideIn 0.5s ease-out',
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  },
  headerCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    width: '100%',
    position: 'relative',
  },
  stepTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.3rem',
    fontWeight: 600,
    margin: '0 0 1rem 0',
    color: '#00ff41',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-10px',
    right: '20px',
    width: '30px',
    height: '30px',
    backgroundColor: '#ff0040',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px #ff0040',
  },
  notificationNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  qualificationContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  qualificationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    justifyContent: 'center',
  },
  checkmark: {
    width: '20px',
    height: '20px',
    backgroundColor: '#00ff41',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualificationText: {
    color: '#e0e0e0',
    fontWeight: 500,
  },
  loadDetailsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  loadInfo: {
    textAlign: 'center',
  },
  loadTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ffff',
    margin: '0 0 0.5rem 0',
  },
  loadRoute: {
    fontSize: '1.1rem',
    color: '#e0e0e0',
    margin: '0 0 1rem 0',
    fontWeight: 500,
  },
  loadMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  loadDistance: {
    color: '#999',
    fontSize: '0.9rem',
  },
  loadPayment: {
    color: '#00ff41',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  loadTiming: {
    textAlign: 'left',
  },
  timingText: {
    color: '#ff00ff',
    fontSize: '0.9rem',
    margin: '0.25rem 0',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    maxWidth: '300px',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#00ff41',
    color: '#0d0208',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  denyButton: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#ff0040',
    border: '2px solid #ff0040',
    borderRadius: '8px',
    padding: '1rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  continueButton: {
    backgroundColor: '#00ff41',
    color: '#0d0208',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '300px',
  },
  gpsButton: {
    backgroundColor: '#00ffff',
    color: '#0d0208',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '300px',
  },
  requirementsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  requirementsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
    textAlign: 'center',
  },
  requirementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  requirementItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  },
  requirementCheckbox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  requirementText: {
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  addressContainer: {
    textAlign: 'center',
  },
  addressText: {
    fontSize: '1.1rem',
    color: '#e0e0e0',
    margin: '0.25rem 0',
  },
  mapCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  mapTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
    textAlign: 'center',
  },
  mapContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    marginBottom: '1rem',
  },
  routeSvg: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  geofenceText: {
    textAlign: 'center',
    color: '#999',
    fontSize: '0.9rem',
    margin: 0,
  },
  questionCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '2rem',
    width: '100%',
    textAlign: 'center',
  },
  questionText: {
    fontSize: '1.2rem',
    color: '#e0e0e0',
    margin: 0,
    lineHeight: '1.4',
  },
  confirmationCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '2rem',
    width: '100%',
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: '1.1rem',
    color: '#e0e0e0',
    margin: 0,
    lineHeight: '1.4',
  },
  complianceCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  complianceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  complianceCheckmark: {
    width: '20px',
    height: '20px',
    backgroundColor: '#00ff41',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  complianceText: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    lineHeight: '1.4',
  },
  routePlanCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  legendContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  legendColor: {
    width: '20px',
    height: '15px',
    borderRadius: '3px',
  },
  legendText: {
    fontSize: '0.8rem',
    color: '#e0e0e0',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(13, 2, 8, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(0, 255, 65, 0.2)',
    padding: '0.5rem',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.5rem',
    minWidth: '60px',
  },
  navLabel: {
    fontSize: '0.7rem',
    color: '#00ff41',
    fontWeight: 500,
    marginTop: '0.25rem',
  },
};

export default LoadWorkflow;
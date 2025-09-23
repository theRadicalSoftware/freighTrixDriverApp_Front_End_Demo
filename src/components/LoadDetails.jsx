import React, { useState, useEffect } from 'react';
import logoImage from '../logos/FreightTrixHeader_Graphic.png';
import LiveMap from '../trimble/LiveMap';

const LoadDetails = ({ loadData, onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showPulse, setShowPulse] = useState(true);
  const [truckProgress, setTruckProgress] = useState(35); // Mock progress along route

  useEffect(() => {
    // Pulse animation for alerts
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    // Mock truck movement animation
    const truckInterval = setInterval(() => {
      setTruckProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
    }, 1000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(truckInterval);
    };
  }, []);

  const sectionTabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 'route', 
      label: 'Route', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <polygon points="3 6 9 9 15 15 21 12 21 18 15 21 9 15 3 12" stroke="currentColor" strokeWidth="2"/>
          <line x1="9" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
          <line x1="15" y1="15" x2="15" y2="21" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 'equipment', 
      label: 'Equipment', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="3" width="15" height="13" stroke="currentColor" strokeWidth="2"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="currentColor" strokeWidth="2"/>
          <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
          <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 'requirements', 
      label: 'Requirements', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <polyline points="9 11 12 14 22 4" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  const renderOverview = () => (
    <div style={styles.sectionContent}>
      <div style={styles.statusCard}>
        <div style={styles.statusHeader}>
          <div style={styles.statusLight}></div>
          <span style={styles.statusText}>Load Status: En Route</span>
        </div>
        <div style={styles.etaContainer}>
          <h3 style={styles.etaTitle}>Estimated Delivery</h3>
          <div style={styles.etaTime}>Dec 15, 2024 • 2:30 PM</div>
          <div style={styles.etaDistance}>347 miles remaining</div>
        </div>
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="1" x2="12" y2="23" stroke="#00ff41" strokeWidth="2"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#00ff41" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div style={styles.infoLabel}>Payment</div>
            <div style={styles.infoValue}>$2,850</div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#00ff41" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div style={styles.infoLabel}>Weight</div>
            <div style={styles.infoValue}>42,500 lbs</div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#00ff41" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="#00ff41" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div style={styles.infoLabel}>Transit Time</div>
            <div style={styles.infoValue}>18 hours</div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#00ff41" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="#00ff41" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div style={styles.infoLabel}>Distance</div>
            <div style={styles.infoValue}>1,003 miles</div>
          </div>
        </div>
      </div>

      <div style={styles.progressCard}>
        <h4 style={styles.progressTitle}>Delivery Progress</h4>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${truckProgress}%`}}></div>
        </div>
        <div style={styles.progressText}>{Math.round(truckProgress)}% Complete</div>
      </div>
    </div>
  );

  const renderRoute = () => (
    <div style={styles.sectionContent}>
      <div style={styles.routeMap}>
        <div style={styles.mapContainer}>
          <LiveMap
            height={220}
            showRoute={true}
            shipment={{
              id: loadData?.id || 'FT-2024-1247',
              origin: 'Chicago, IL',
              destination: 'Denver, CO',
              truck: 'FT-2024-TR-456',
              driver: 'Assigned',
              currentLocation: `Progress ${Math.round(truckProgress)}%`,
              temperature: '4.2°C',
              progress: Math.max(0, Math.min(100, truckProgress)),
              onTime: true,
              eta: 'Dec 15, 2:30 PM'
            }}
          />
        </div>
        
        <div style={styles.routeDetails}>
          <div style={styles.routeStop}>
            <div style={styles.stopMarker}></div>
            <div style={styles.stopInfo}>
              <div style={styles.stopTitle}>Origin: Chicago, IL</div>
              <div style={styles.stopAddress}>2150 W Fulton St, Chicago, IL 60612</div>
              <div style={styles.stopTime}>Pickup: Dec 13, 2024 • 8:00 AM</div>
            </div>
          </div>
          
          <div style={styles.routeStop}>
            <div style={{...styles.stopMarker, backgroundColor: '#ff00ff'}}></div>
            <div style={styles.stopInfo}>
              <div style={styles.stopTitle}>Destination: Denver, CO</div>
              <div style={styles.stopAddress}>5500 E 58th Ave, Commerce City, CO 80022</div>
              <div style={styles.stopTime}>Delivery: Dec 15, 2024 • 2:30 PM</div>
            </div>
          </div>
        </div>

        <div style={styles.trimbleInfo}>
          <h4 style={styles.trimbleTitle}>Trimble ETA Analysis</h4>
          <div style={styles.trimbleData}>
            <div style={styles.trimbleItem}>
              <span style={styles.trimbleLabel}>Current Speed:</span>
              <span style={styles.trimbleValue}>67 mph</span>
            </div>
            <div style={styles.trimbleItem}>
              <span style={styles.trimbleLabel}>Avg Speed:</span>
              <span style={styles.trimbleValue}>58 mph</span>
            </div>
            <div style={styles.trimbleItem}>
              <span style={styles.trimbleLabel}>Fuel Usage:</span>
              <span style={styles.trimbleValue}>6.2 mpg</span>
            </div>
            <div style={styles.trimbleItem}>
              <span style={styles.trimbleLabel}>Weather Impact:</span>
              <span style={styles.trimbleValue}>+15 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div style={styles.sectionContent}>
      <div style={styles.equipmentCard}>
        <h4 style={styles.cardTitle}>Tractor Unit</h4>
        <div style={styles.equipmentDetails}>
          <div style={styles.equipmentItem}>
            <span style={styles.equipmentLabel}>Unit ID:</span>
            <span style={styles.equipmentValue}>FT-2024-TR-456</span>
          </div>
          <div style={styles.equipmentItem}>
            <span style={styles.equipmentLabel}>Model:</span>
            <span style={styles.equipmentValue}>Volvo VNL 760</span>
          </div>
          <div style={styles.equipmentItem}>
            <span style={styles.equipmentLabel}>License:</span>
            <span style={styles.equipmentValue}>IL-ABC-1234</span>
          </div>
          <div style={styles.equipmentItem}>
            <span style={styles.equipmentLabel}>DOT Status:</span>
            <span style={{...styles.equipmentValue, color: '#00ff41'}}>Current</span>
          </div>
        </div>
      </div>

      <div style={styles.equipmentCard}>
        <h4 style={styles.cardTitle}>Trailer</h4>
        <div style={styles.equipmentDetails}>
          <div style={styles.equipmentItem}>
            <span style={styles.equipmentLabel}>Trailer ID:</span>
            <span style={styles.equipmentValue}>FT-2024-TR-789</span>
          </div>
          <div style={styles.equipmentItem}>
            <span style={styles.equipmentLabel}>Type:</span>
            <span style={styles.equipmentValue}>53' Dry Van</span>
          </div>
          <div style={styles.equipmentItem}>
            <span style={styles.equipmentLabel}>Capacity:</span>
            <span style={styles.equipmentValue}>80,000 lbs GVWR</span>
          </div>
          <div style={styles.equipmentItem}>
            <span style={styles.equipmentLabel}>Temperature:</span>
            <span style={styles.equipmentValue}>Ambient</span>
          </div>
        </div>
      </div>

      <div style={styles.equipmentCard}>
        <h4 style={styles.cardTitle}>Safety Equipment</h4>
        <div style={styles.checklistContainer}>
          {['Load Locks', 'Straps & Chains', 'Emergency Kit', 'Fire Extinguisher', 'Reflective Triangles'].map((item, index) => (
            <div key={index} style={styles.checklistItem}>
              <div style={styles.checkbox}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
                </svg>
              </div>
              <span style={styles.checklistText}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div style={styles.sectionContent}>
      <div style={styles.requirementCard}>
        <h4 style={styles.cardTitle}>Driver Certifications</h4>
        <div style={styles.certificationList}>
          {[
            { name: 'CDL Class A', status: 'Valid', expires: '03/2026' },
            { name: 'HAZMAT Endorsement', status: 'Valid', expires: '08/2025' },
            { name: 'DOT Medical', status: 'Valid', expires: '12/2024' }
          ].map((cert, index) => (
            <div key={index} style={styles.certificationItem}>
              <div style={styles.certificationInfo}>
                <span style={styles.certificationName}>{cert.name}</span>
                <span style={styles.certificationExpiry}>Expires: {cert.expires}</span>
              </div>
              <div style={{...styles.statusBadge, backgroundColor: cert.status === 'Valid' ? '#00ff41' : '#ff0040'}}>
                {cert.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.requirementCard}>
        <h4 style={styles.cardTitle}>Pre-Trip Inspection</h4>
        <div style={styles.inspectionList}>
          {[
            { task: 'Engine Fluids Check', completed: true },
            { task: 'Tire Pressure & Condition', completed: true },
            { task: 'Brake System', completed: true },
            { task: 'Lights & Electrical', completed: false },
            { task: 'Cargo Securement', completed: false }
          ].map((task, index) => (
            <div key={index} style={styles.inspectionItem}>
              <div style={{
                ...styles.inspectionCheckbox,
                backgroundColor: task.completed ? '#00ff41' : 'transparent',
                border: task.completed ? '2px solid #00ff41' : '2px solid #666'
              }}>
                {task.completed && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <polyline points="20,6 9,17 4,12" stroke="#0d0208" strokeWidth="2"/>
                  </svg>
                )}
              </div>
              <span style={{
                ...styles.inspectionText,
                color: task.completed ? '#e0e0e0' : '#999'
              }}>{task.task}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.requirementCard}>
        <h4 style={styles.cardTitle}>Delivery Requirements</h4>
        <div style={styles.deliveryRequirements}>
          <div style={styles.requirementItem}>
            <div style={styles.requirementIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#00ff41" strokeWidth="2"/>
                <circle cx="12" cy="16" r="1" fill="#00ff41"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#00ff41" strokeWidth="2"/>
              </svg>
            </div>
            <div style={styles.requirementText}>
              <div style={styles.requirementTitle}>Security Seal Required</div>
              <div style={styles.requirementDesc}>Maintain seal integrity throughout transport</div>
            </div>
          </div>

          <div style={styles.requirementItem}>
            <div style={styles.requirementIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2"/>
                <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2"/>
              </svg>
            </div>
            <div style={styles.requirementText}>
              <div style={styles.requirementTitle}>Signature Required</div>
              <div style={styles.requirementDesc}>Authorized personnel signature on delivery</div>
            </div>
          </div>

          <div style={styles.requirementItem}>
            <div style={styles.requirementIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke="#00ff41" strokeWidth="2"/>
                <polyline points="17,2 12,7 7,2" stroke="#00ff41" strokeWidth="2"/>
              </svg>
            </div>
            <div style={styles.requirementText}>
              <div style={styles.requirementTitle}>Photo Documentation</div>
              <div style={styles.requirementDesc}>Photos of cargo condition at delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div style={styles.sectionContent}>
      <div style={styles.documentsCard}>
        <h4 style={styles.cardTitle}>Load Documents</h4>
        <div style={styles.documentsList}>
          {[
            { name: 'Bill of Lading', status: 'Signed', type: 'PDF' },
            { name: 'Delivery Receipt', status: 'Pending', type: 'PDF' },
            { name: 'Load Confirmation', status: 'Complete', type: 'PDF' },
            { name: 'Insurance Certificate', status: 'Active', type: 'PDF' },
            { name: 'Route Manifest', status: 'Current', type: 'PDF' }
          ].map((doc, index) => (
            <div key={index} style={styles.documentItem}>
              <div style={styles.documentIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.documentInfo}>
                <div style={styles.documentName}>{doc.name}</div>
                <div style={styles.documentType}>{doc.type}</div>
              </div>
              <div style={styles.documentStatus}>{doc.status}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.emergencyCard}>
        <h4 style={styles.cardTitle}>Emergency Contacts</h4>
        <div style={styles.contactsList}>
          <div style={styles.contactItem}>
            <div style={styles.contactType}>Dispatch</div>
            <div style={styles.contactNumber}>(312) 555-0123</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactType}>Emergency Roadside</div>
            <div style={styles.contactNumber}>(800) 555-HELP</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactType}>Customer Service</div>
            <div style={styles.contactNumber}>(312) 555-0456</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'overview': return renderOverview();
      case 'route': return renderRoute();
      case 'equipment': return renderEquipment();
      case 'requirements': return renderRequirements();
      case 'documents': return renderDocuments();
      default: return renderOverview();
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
        <button style={styles.backButton} onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#00ff41" strokeWidth="2"/>
          </svg>
        </button>
        <div style={styles.headerInfo}>
          <img src={logoImage} alt="FreighTrix" style={styles.logoImage} />
          <div style={styles.loadTitle}>Load #{loadData?.id || 'FT-2024-1247'}</div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="tabs-container" style={styles.tabsContainer}>
        <div style={styles.tabsScrollable}>
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeSection === tab.id ? styles.tabActive : {}),
              }}
              onClick={() => setActiveSection(tab.id)}
            >
              <div style={{
                ...styles.tabIcon,
                ...(activeSection === tab.id ? styles.tabIconActive : {}),
              }}>
                {tab.icon}
              </div>
              <span style={{
                ...styles.tabLabel,
                ...(activeSection === tab.id ? styles.tabLabelActive : {}),
              }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {renderContent()}
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
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 65, 0.3); }
            50% { box-shadow: 0 0 25px rgba(0, 255, 65, 0.6); }
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
    gap: '1rem',
    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(13, 2, 8, 0.9)',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#00ff41',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1,
  },
  logoImage: {
    height: '32px',
    width: 'auto',
    filter: 'drop-shadow(0 0 6px rgba(0, 255, 65, 0.3))',
  },
  loadTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    background: 'linear-gradient(90deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  tabsContainer: {
    zIndex: 1,
    borderBottom: '1px solid rgba(0, 255, 65, 0.1)',
    backgroundColor: 'rgba(13, 2, 8, 0.8)',
    backdropFilter: 'blur(10px)',
    overflowX: 'auto',
  },
  tabsScrollable: {
    display: 'flex',
    padding: '0 1rem',
    minWidth: 'max-content',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: '8px 8px 0 0',
    minWidth: '80px',
    gap: '0.25rem',
  },
  tabActive: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderBottom: '2px solid #00ff41',
  },
  tabIcon: {
    color: '#666',
    transition: 'all 0.3s ease',
  },
  tabIconActive: {
    color: '#00ff41',
    filter: 'drop-shadow(0 0 6px #00ff41)',
  },
  tabLabel: {
    fontSize: '0.7rem',
    color: '#666',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  tabLabelActive: {
    color: '#00ff41',
    fontWeight: 600,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
    padding: '1rem',
    overflow: 'auto',
    animation: 'slideIn 0.5s ease-out',
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  statusCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
  },
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  statusLight: {
    width: '12px',
    height: '12px',
    backgroundColor: '#00ff41',
    borderRadius: '50%',
    boxShadow: '0 0 10px #00ff41',
    animation: 'pulse 2s ease-in-out infinite',
  },
  statusText: {
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 600,
    color: '#00ff41',
  },
  etaContainer: {
    textAlign: 'center',
  },
  etaTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: '0 0 0.5rem 0',
    color: '#e0e0e0',
  },
  etaTime: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#00ffff',
    marginBottom: '0.25rem',
  },
  etaDistance: {
    color: '#999',
    fontSize: '0.9rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  infoCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  infoIcon: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
  },
  infoLabel: {
    fontSize: '0.8rem',
    color: '#999',
    marginBottom: '0.25rem',
  },
  infoValue: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#e0e0e0',
  },
  progressCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  progressTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    margin: '0 0 1rem 0',
    color: '#e0e0e0',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff41',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
    boxShadow: '0 0 10px #00ff41',
  },
  progressText: {
    fontSize: '0.9rem',
    color: '#00ff41',
    fontWeight: 600,
    textAlign: 'center',
  },
  routeMap: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  mapContainer: {
    marginBottom: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.2)',
  },
  routeSvg: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  routeDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  routeStop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  stopMarker: {
    width: '12px',
    height: '12px',
    backgroundColor: '#00ffff',
    borderRadius: '50%',
    marginTop: '0.25rem',
    boxShadow: '0 0 8px currentColor',
  },
  stopInfo: {
    flex: 1,
  },
  stopTitle: {
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  stopAddress: {
    color: '#999',
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  stopTime: {
    color: '#00ff41',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  trimbleInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  trimbleTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    margin: '0 0 1rem 0',
    color: '#00ff41',
  },
  trimbleData: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '0.5rem',
  },
  trimbleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trimbleLabel: {
    fontSize: '0.8rem',
    color: '#999',
  },
  trimbleValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#e0e0e0',
  },
  equipmentCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  cardTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: '0 0 1rem 0',
    color: '#00ff41',
  },
  equipmentDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  equipmentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(0, 255, 65, 0.1)',
  },
  equipmentLabel: {
    color: '#999',
    fontSize: '0.9rem',
  },
  equipmentValue: {
    color: '#e0e0e0',
    fontWeight: 500,
  },
  checklistContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    border: '2px solid #00ff41',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ff41',
  },
  checklistText: {
    color: '#e0e0e0',
  },
  requirementCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  certificationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  certificationItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  certificationInfo: {
    flex: 1,
  },
  certificationName: {
    display: 'block',
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  certificationExpiry: {
    fontSize: '0.8rem',
    color: '#999',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#0d0208',
  },
  inspectionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  inspectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  inspectionCheckbox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspectionText: {
    fontSize: '0.9rem',
  },
  deliveryRequirements: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  requirementItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  requirementIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
  },
  requirementText: {
    flex: 1,
  },
  requirementTitle: {
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  requirementDesc: {
    fontSize: '0.8rem',
    color: '#999',
  },
  documentsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem',
  },
  documentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  documentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  documentIcon: {
    color: '#00ff41',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  documentType: {
    fontSize: '0.8rem',
    color: '#999',
  },
  documentStatus: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#00ff41',
  },
  emergencyCard: {
    backgroundColor: 'rgba(255, 0, 64, 0.05)',
    border: '1px solid rgba(255, 0, 64, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  contactsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  contactItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 0, 64, 0.2)',
  },
  contactType: {
    fontWeight: 600,
    color: '#e0e0e0',
  },
  contactNumber: {
    color: '#ff0040',
    fontWeight: 500,
    fontFamily: 'monospace',
  },
};

export default LoadDetails;
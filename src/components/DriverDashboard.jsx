import React, { useState, useEffect } from 'react';
import logoImage from '../logos/FreightTrixHeader_Graphic.png';

const DriverDashboard = ({ onLoadAssigned }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [showPulse, setShowPulse] = useState(true);
  const [hasLoad, setHasLoad] = useState(false);

  useEffect(() => {
    // Pulse animation for notifications
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    // Simulate load assignment after 3 seconds for demo
    const loadTimer = setTimeout(() => {
      setHasLoad(true);
    }, 3000);

    return () => {
      clearInterval(pulseInterval);
      clearTimeout(loadTimer);
    };
  }, []);

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'route',
      label: 'Route',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polygon points="3 6 9 9 15 15 21 12 21 18 15 21 9 15 3 12" stroke="currentColor" strokeWidth="2"/>
          <line x1="9" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
          <line x1="15" y1="15" x2="15" y2="21" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'shipments',
      label: 'Shipments',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polyline points="9 11 12 14 22 4" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  const handleNewLoad = () => {
    onLoadAssigned();
  };

  const renderHome = () => (
    <div style={styles.contentArea}>
      <div style={styles.statusCard}>
        <div style={styles.statusHeader}>
          <div style={styles.statusLight}></div>
          <span style={styles.statusText}>Driver Status: Available</span>
        </div>
        <div style={styles.statusDetails}>
          <p style={styles.statusDescription}>Ready for load assignment</p>
        </div>
      </div>

      {hasLoad ? (
        <div style={styles.loadNotification}>
          <div style={styles.notificationHeader}>
            <div style={styles.notificationBadge}>
              <span style={{...styles.notificationNumber, opacity: showPulse ? 1 : 0.6}}>1</span>
            </div>
            <h3 style={styles.notificationTitle}>New Load Assignment</h3>
          </div>
          <div style={styles.notificationBody}>
            <p style={styles.notificationText}>
              A new load has been assigned to your route. Click below to review details and accept.
            </p>
            <button style={styles.viewLoadButton} onClick={handleNewLoad}>
              View Load Assignment
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.noLoadCard}>
          <div style={styles.noLoadIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="#666" strokeWidth="2"/>
              <line x1="8" y1="21" x2="16" y2="21" stroke="#666" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke="#666" strokeWidth="2"/>
            </svg>
          </div>
          <h3 style={styles.noLoadTitle}>No Active Load</h3>
          <p style={styles.noLoadDescription}>
            You are currently available for assignment. A new load will appear here when assigned.
          </p>
        </div>
      )}

      <div style={styles.quickStats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>47</div>
          <div style={styles.statLabel}>Loads Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>98.5%</div>
          <div style={styles.statLabel}>On-Time Rate</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>4.9</div>
          <div style={styles.statLabel}>Safety Rating</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return renderHome();
      case 'route':
        return (
          <div style={styles.contentArea}>
            <h2 style={styles.contentTitle}>Route Planning</h2>
            <div style={styles.placeholderCard}>
              <p style={styles.placeholderText}>No active route. Routes will appear here when assigned.</p>
            </div>
          </div>
        );
      case 'shipments':
        return (
          <div style={styles.contentArea}>
            <h2 style={styles.contentTitle}>Shipments</h2>
            <div style={styles.placeholderCard}>
              <p style={styles.placeholderText}>No active shipments. Shipment details will appear here when assigned.</p>
            </div>
          </div>
        );
      case 'compliance':
        return (
          <div style={styles.contentArea}>
            <h2 style={styles.contentTitle}>Compliance Status</h2>
            <div style={styles.complianceCard}>
              <div style={styles.complianceItem}>
                <div style={styles.complianceIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                </div>
                <span style={styles.complianceText}>CDL Valid</span>
              </div>
              <div style={styles.complianceItem}>
                <div style={styles.complianceIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                </div>
                <span style={styles.complianceText}>DOT Physical Current</span>
              </div>
              <div style={styles.complianceItem}>
                <div style={styles.complianceIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                </div>
                <span style={styles.complianceText}>TAPA Certified</span>
              </div>
              <div style={styles.complianceItem}>
                <div style={styles.complianceIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                </div>
                <span style={styles.complianceText}>GDP Qualified</span>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div style={styles.contentArea}>
            <h2 style={styles.contentTitle}>Settings</h2>
            <div style={styles.placeholderCard}>
              <p style={styles.placeholderText}>Driver preferences and account settings</p>
            </div>
          </div>
        );
      default:
        return renderHome();
    }
  };

  return (
    <div style={styles.container}>
      {/* Matrix Background */}
      <div style={styles.matrixBackground}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.matrixColumn,
              left: `${i * 6.67}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            {[...Array(8)].map((_, j) => (
              <span key={j} style={styles.matrixChar}>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={styles.header}>
        <img 
          src={logoImage} 
          alt="FreighTrix Logo" 
          style={styles.logoImage}
        />
        <div style={styles.welcomeContainer}>
          <h1 style={styles.welcomeText}>Driver Portal</h1>
          <p style={styles.statusIndicator}>● Online</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <div style={styles.navContainer}>
          {navItems.map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(activeTab === item.id ? styles.navItemActive : {}),
              }}
              onClick={() => setActiveTab(item.id)}
            >
              <div style={{
                ...styles.navIcon,
                ...(activeTab === item.id ? styles.navIconActive : {}),
              }}>
                {item.icon}
              </div>
              <span style={{
                ...styles.navLabel,
                ...(activeTab === item.id ? styles.navLabelActive : {}),
              }}>
                {item.label}
              </span>
            </button>
          ))}
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
          
          @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }

          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.3); }
            50% { box-shadow: 0 0 30px rgba(0, 255, 65, 0.6); }
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
    opacity: 0.08,
    zIndex: 0,
  },
  matrixColumn: {
    position: 'absolute',
    top: 0,
    fontSize: '12px',
    color: '#00ff41',
    animation: 'matrixFall 20s linear infinite',
    display: 'flex',
    flexDirection: 'column',
  },
  matrixChar: {
    display: 'block',
    marginBottom: '8px',
    fontFamily: 'monospace',
  },
  header: {
    zIndex: 1,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(13, 2, 8, 0.8)',
  },
  logoImage: {
    height: '40px',
    width: 'auto',
    filter: 'drop-shadow(0 0 8px rgba(0, 255, 65, 0.3))',
  },
  welcomeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  welcomeText: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 600,
    margin: 0,
    background: 'linear-gradient(90deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  statusIndicator: {
    color: '#00ff41',
    fontSize: '0.9rem',
    margin: 0,
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 500,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
    padding: '1rem',
    paddingBottom: '100px',
    overflow: 'auto',
  },
  contentArea: {
    animation: 'slideUp 0.5s ease-out',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  contentTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 600,
    margin: '0 0 1rem 0',
    color: '#00ff41',
    textAlign: 'center',
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
  statusDetails: {
    textAlign: 'center',
  },
  statusDescription: {
    color: '#e0e0e0',
    margin: 0,
    fontSize: '1rem',
  },
  loadNotification: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    border: '2px solid #00ff41',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
    animation: 'glow 2s ease-in-out infinite',
    position: 'relative',
  },
  notificationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  notificationBadge: {
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
    transition: 'opacity 0.5s ease',
  },
  notificationTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  notificationBody: {
    textAlign: 'center',
  },
  notificationText: {
    color: '#e0e0e0',
    marginBottom: '1.5rem',
    lineHeight: '1.4',
  },
  viewLoadButton: {
    backgroundColor: '#00ff41',
    color: '#0d0208',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  noLoadCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  noLoadIcon: {
    marginBottom: '1rem',
    opacity: 0.5,
  },
  noLoadTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#999',
    margin: '0 0 1rem 0',
  },
  noLoadDescription: {
    color: '#666',
    margin: 0,
    lineHeight: '1.4',
  },
  quickStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },
  statCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#00ff41',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#999',
  },
  placeholderCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  placeholderText: {
    color: '#999',
    margin: 0,
  },
  complianceCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
  },
  complianceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  complianceIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  complianceText: {
    color: '#e0e0e0',
    fontWeight: 500,
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
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: '8px',
    minWidth: '70px',
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  navIcon: {
    position: 'relative',
    color: '#666',
    marginBottom: '0.3rem',
    transition: 'all 0.3s ease',
  },
  navIconActive: {
    color: '#00ff41',
    filter: 'drop-shadow(0 0 8px #00ff41)',
  },
  navLabel: {
    fontSize: '0.7rem',
    color: '#666',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  navLabelActive: {
    color: '#00ff41',
    fontWeight: 600,
  },
};

export default DriverDashboard;
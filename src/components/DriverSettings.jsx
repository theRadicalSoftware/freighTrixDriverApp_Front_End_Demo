import React, { useState } from 'react';
import logoImage from '../logos/FreightTrixHeader_Graphic.png';

const DriverSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPulse, setShowPulse] = useState(true);
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'Marcus',
      lastName: 'Rodriguez', 
      email: 'marcus.rodriguez@freightrix.com',
      phone: '+1 (312) 555-0147',
      cdlNumber: 'IL-CDL-789456',
      employeeId: 'FT-2024-DR-1247'
    },
    notifications: {
      loadOffers: true,
      routeUpdates: true,
      weatherAlerts: true,
      trafficAlerts: true,
      complianceReminders: true,
      promotions: false
    },
    preferences: {
      maxDistance: 1200,
      preferredLoadTypes: ['Dry Van', 'Refrigerated'],
      avoidTollRoads: false,
      preferDaytimeDelivery: true,
      temperatureUnit: 'fahrenheit',
      distanceUnit: 'miles'
    },
    privacy: {
      shareLocation: true,
      analyticsTracking: true,
      crashReporting: true,
      performanceTracking: true
    },
    app: {
      theme: 'dark',
      autoLock: true,
      biometricAuth: true,
      offlineMode: false
    }
  });

  React.useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const sectionTabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Alerts',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'preferences',
      label: 'Loads',
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
      id: 'privacy',
      label: 'Privacy',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'app',
      label: 'App',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const renderProfile = () => (
    <div style={styles.sectionContent}>
      <div style={styles.settingsCard}>
        <h3 style={styles.cardTitle}>Driver Information</h3>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#00ff41" strokeWidth="2"/>
              <circle cx="12" cy="7" r="4" stroke="#00ff41" strokeWidth="2"/>
            </svg>
          </div>
          <button style={styles.changeAvatarBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <polyline points="17,2 12,7 7,2" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Upload Photo
          </button>
        </div>

        <div style={styles.formFields}>
          <div style={styles.fieldRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>First Name</label>
              <input
                style={styles.input}
                value={settings.profile.firstName}
                onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                style={styles.input}
                value={settings.profile.lastName}
                onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              style={styles.input}
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
            />
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>CDL Number</label>
              <input
                style={styles.input}
                value={settings.profile.cdlNumber}
                onChange={(e) => handleSettingChange('profile', 'cdlNumber', e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Employee ID</label>
              <input
                style={styles.input}
                value={settings.profile.employeeId}
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        <button style={styles.saveButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
            <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div style={styles.sectionContent}>
      <div style={styles.settingsCard}>
        <h3 style={styles.cardTitle}>Notification Preferences</h3>
        <div style={styles.toggleList}>
          {[
            { key: 'loadOffers', label: 'Load Offers', desc: 'Get notified about new load assignments' },
            { key: 'routeUpdates', label: 'Route Updates', desc: 'Traffic and route optimization alerts' },
            { key: 'weatherAlerts', label: 'Weather Alerts', desc: 'Severe weather warnings along route' },
            { key: 'trafficAlerts', label: 'Traffic Alerts', desc: 'Real-time traffic condition updates' },
            { key: 'complianceReminders', label: 'Compliance Reminders', desc: 'HOS and inspection due dates' },
            { key: 'promotions', label: 'Promotional Offers', desc: 'Marketing and bonus opportunities' }
          ].map((item) => (
            <div key={item.key} style={styles.toggleItem}>
              <div style={styles.toggleInfo}>
                <div style={styles.toggleLabel}>{item.label}</div>
                <div style={styles.toggleDesc}>{item.desc}</div>
              </div>
              <button
                style={{
                  ...styles.toggle,
                  backgroundColor: settings.notifications[item.key] ? '#00ff41' : 'rgba(102, 102, 102, 0.3)'
                }}
                onClick={() => handleSettingChange('notifications', item.key, !settings.notifications[item.key])}
              >
                <div style={{
                  ...styles.toggleHandle,
                  transform: settings.notifications[item.key] ? 'translateX(24px)' : 'translateX(2px)'
                }}></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div style={styles.sectionContent}>
      <div style={styles.settingsCard}>
        <h3 style={styles.cardTitle}>Load Preferences</h3>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Maximum Distance (miles)</label>
          <div style={styles.sliderContainer}>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={settings.preferences.maxDistance}
              onChange={(e) => handleSettingChange('preferences', 'maxDistance', parseInt(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.sliderValue}>{settings.preferences.maxDistance} miles</div>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Preferred Load Types</label>
          <div style={styles.checkboxGroup}>
            {['Dry Van', 'Refrigerated', 'Flatbed', 'Tanker', 'HAZMAT'].map((type) => (
              <button
                key={type}
                style={{
                  ...styles.checkboxButton,
                  backgroundColor: settings.preferences.preferredLoadTypes.includes(type) 
                    ? 'rgba(0, 255, 65, 0.2)' 
                    : 'rgba(102, 102, 102, 0.1)',
                  borderColor: settings.preferences.preferredLoadTypes.includes(type) 
                    ? '#00ff41' 
                    : '#666'
                }}
                onClick={() => {
                  const currentTypes = settings.preferences.preferredLoadTypes;
                  const newTypes = currentTypes.includes(type)
                    ? currentTypes.filter(t => t !== type)
                    : [...currentTypes, type];
                  handleSettingChange('preferences', 'preferredLoadTypes', newTypes);
                }}
              >
                {settings.preferences.preferredLoadTypes.includes(type) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                    <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                )}
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.toggleList}>
          <div style={styles.toggleItem}>
            <div style={styles.toggleInfo}>
              <div style={styles.toggleLabel}>Avoid Toll Roads</div>
              <div style={styles.toggleDesc}>Prefer toll-free routes when possible</div>
            </div>
            <button
              style={{
                ...styles.toggle,
                backgroundColor: settings.preferences.avoidTollRoads ? '#00ff41' : 'rgba(102, 102, 102, 0.3)'
              }}
              onClick={() => handleSettingChange('preferences', 'avoidTollRoads', !settings.preferences.avoidTollRoads)}
            >
              <div style={{
                ...styles.toggleHandle,
                transform: settings.preferences.avoidTollRoads ? 'translateX(24px)' : 'translateX(2px)'
              }}></div>
            </button>
          </div>

          <div style={styles.toggleItem}>
            <div style={styles.toggleInfo}>
              <div style={styles.toggleLabel}>Prefer Daytime Delivery</div>
              <div style={styles.toggleDesc}>Prioritize loads with daytime delivery windows</div>
            </div>
            <button
              style={{
                ...styles.toggle,
                backgroundColor: settings.preferences.preferDaytimeDelivery ? '#00ff41' : 'rgba(102, 102, 102, 0.3)'
              }}
              onClick={() => handleSettingChange('preferences', 'preferDaytimeDelivery', !settings.preferences.preferDaytimeDelivery)}
            >
              <div style={{
                ...styles.toggleHandle,
                transform: settings.preferences.preferDaytimeDelivery ? 'translateX(24px)' : 'translateX(2px)'
              }}></div>
            </button>
          </div>
        </div>
      </div>

      <div style={styles.settingsCard}>
        <h3 style={styles.cardTitle}>Units & Measurements</h3>
        <div style={styles.radioGroup}>
          <div style={styles.radioItem}>
            <span style={styles.radioLabel}>Temperature</span>
            <div style={styles.radioOptions}>
              {['fahrenheit', 'celsius'].map((unit) => (
                <button
                  key={unit}
                  style={{
                    ...styles.radioButton,
                    backgroundColor: settings.preferences.temperatureUnit === unit 
                      ? '#00ff41' 
                      : 'transparent',
                    color: settings.preferences.temperatureUnit === unit 
                      ? '#0d0208' 
                      : '#e0e0e0'
                  }}
                  onClick={() => handleSettingChange('preferences', 'temperatureUnit', unit)}
                >
                  {unit === 'fahrenheit' ? '°F' : '°C'}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.radioItem}>
            <span style={styles.radioLabel}>Distance</span>
            <div style={styles.radioOptions}>
              {['miles', 'kilometers'].map((unit) => (
                <button
                  key={unit}
                  style={{
                    ...styles.radioButton,
                    backgroundColor: settings.preferences.distanceUnit === unit 
                      ? '#00ff41' 
                      : 'transparent',
                    color: settings.preferences.distanceUnit === unit 
                      ? '#0d0208' 
                      : '#e0e0e0'
                  }}
                  onClick={() => handleSettingChange('preferences', 'distanceUnit', unit)}
                >
                  {unit === 'miles' ? 'MI' : 'KM'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div style={styles.sectionContent}>
      <div style={styles.settingsCard}>
        <h3 style={styles.cardTitle}>Privacy & Data</h3>
        <div style={styles.toggleList}>
          {[
            { key: 'shareLocation', label: 'Share Location', desc: 'Allow FreighTrix to track your location for route optimization' },
            { key: 'analyticsTracking', label: 'Analytics Tracking', desc: 'Help improve the app by sharing usage analytics' },
            { key: 'crashReporting', label: 'Crash Reporting', desc: 'Automatically send crash reports to improve stability' },
            { key: 'performanceTracking', label: 'Performance Tracking', desc: 'Share performance data to optimize app speed' }
          ].map((item) => (
            <div key={item.key} style={styles.toggleItem}>
              <div style={styles.toggleInfo}>
                <div style={styles.toggleLabel}>{item.label}</div>
                <div style={styles.toggleDesc}>{item.desc}</div>
              </div>
              <button
                style={{
                  ...styles.toggle,
                  backgroundColor: settings.privacy[item.key] ? '#00ff41' : 'rgba(102, 102, 102, 0.3)'
                }}
                onClick={() => handleSettingChange('privacy', item.key, !settings.privacy[item.key])}
              >
                <div style={{
                  ...styles.toggleHandle,
                  transform: settings.privacy[item.key] ? 'translateX(24px)' : 'translateX(2px)'
                }}></div>
              </button>
            </div>
          ))}
        </div>

        <div style={styles.privacyActions}>
          <button style={styles.privacyButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Download My Data
          </button>
          <button style={styles.privacyButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderApp = () => (
    <div style={styles.sectionContent}>
      <div style={styles.settingsCard}>
        <h3 style={styles.cardTitle}>App Preferences</h3>
        
        <div style={styles.toggleList}>
          {[
            { key: 'autoLock', label: 'Auto-Lock', desc: 'Automatically lock app when idle for 5 minutes' },
            { key: 'biometricAuth', label: 'Biometric Authentication', desc: 'Use fingerprint or face recognition to unlock' },
            { key: 'offlineMode', label: 'Offline Mode', desc: 'Cache data for use when connection is poor' }
          ].map((item) => (
            <div key={item.key} style={styles.toggleItem}>
              <div style={styles.toggleInfo}>
                <div style={styles.toggleLabel}>{item.label}</div>
                <div style={styles.toggleDesc}>{item.desc}</div>
              </div>
              <button
                style={{
                  ...styles.toggle,
                  backgroundColor: settings.app[item.key] ? '#00ff41' : 'rgba(102, 102, 102, 0.3)'
                }}
                onClick={() => handleSettingChange('app', item.key, !settings.app[item.key])}
              >
                <div style={{
                  ...styles.toggleHandle,
                  transform: settings.app[item.key] ? 'translateX(24px)' : 'translateX(2px)'
                }}></div>
              </button>
            </div>
          ))}
        </div>

        <div style={styles.appActions}>
          <button style={styles.actionButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Contact Support
          </button>
          <button style={styles.actionButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
            </svg>
            App Version: v2.4.1
          </button>
        </div>
      </div>

      <div style={styles.settingsCard}>
        <h3 style={styles.cardTitle}>Account Actions</h3>
        <div style={styles.dangerZone}>
          <button style={styles.logoutButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'profile': return renderProfile();
      case 'notifications': return renderNotifications();
      case 'preferences': return renderPreferences();
      case 'privacy': return renderPrivacy();
      case 'app': return renderApp();
      default: return renderProfile();
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
        <div style={styles.headerTitle}>Driver Settings</div>
      </div>

      {/* Section Tabs */}
      <div style={styles.tabsContainer}>
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
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
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
    paddingBottom: '2rem',
    overflow: 'auto',
    animation: 'slideIn 0.5s ease-out',
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  settingsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
  },
  cardTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(0, 255, 65, 0.3)',
  },
  changeAvatarBtn: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    color: '#00ff41',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
  },
  formFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#e0e0e0',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '6px',
    padding: '0.75rem',
    color: '#e0e0e0',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  saveButton: {
    backgroundColor: '#00ff41',
    color: '#0d0208',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  toggleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  toggleInfo: {
    flex: 1,
    marginRight: '1rem',
  },
  toggleLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  toggleDesc: {
    fontSize: '0.8rem',
    color: '#999',
    lineHeight: '1.3',
  },
  toggle: {
    width: '48px',
    height: '24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  toggleHandle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease',
    position: 'absolute',
    top: '2px',
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  slider: {
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    background: 'linear-gradient(to right, #00ff41 0%, rgba(0, 255, 65, 0.3) 100%)',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
  },
  sliderValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#00ff41',
    minWidth: '80px',
    textAlign: 'right',
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  checkboxButton: {
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
    border: '1px solid #666',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#e0e0e0',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  radioItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  radioLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#e0e0e0',
  },
  radioOptions: {
    display: 'flex',
    gap: '0.5rem',
  },
  radioButton: {
    backgroundColor: 'transparent',
    border: '1px solid #666',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    color: '#e0e0e0',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  privacyActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(0, 255, 65, 0.1)',
  },
  privacyButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.75rem',
    color: '#00ff41',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
  },
  appActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(0, 255, 65, 0.1)',
  },
  actionButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.75rem',
    color: '#00ff41',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
  },
  dangerZone: {
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 0, 64, 0.2)',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 64, 0.1)',
    border: '1px solid #ff0040',
    borderRadius: '6px',
    padding: '0.75rem',
    color: '#ff0040',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
};

export default DriverSettings;
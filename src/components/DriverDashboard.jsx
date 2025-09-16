import React, { useState, useEffect } from 'react';
import logoImage from '../logos/FreightTrixHeader_Graphic.png';
import LoadWorkFlow from './LoadWorkFlow';
import DriverSettings from './DriverSettings';


const DriverDashboard = ({ 
  onLoadAssigned, 
  loadWorkflowState, 
  onWorkflowStepChange, 
  onWorkflowComplete 
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    // Pulse animation for notifications
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    return () => {
      clearInterval(pulseInterval);
    };
  }, []);

  // Update the navItems to show notifications when load is active
  const navItems = [
    {
      id: 'home',
      label: 'Load',
      hasNotification: loadWorkflowState?.hasActiveLoad && ['loadOffer', 'accepted'].includes(loadWorkflowState.currentStep),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="3" width="15" height="13" stroke="currentColor" strokeWidth="2"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="currentColor" strokeWidth="2"/>
          <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
          <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'route',
      label: 'Route',
      hasNotification: loadWorkflowState?.hasActiveLoad && ['navigation', 'arrival', 'confirmed', 'rolling', 'rollingConfirmed', 'routePlan'].includes(loadWorkflowState.currentStep),
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
      hasNotification: false,
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
      hasNotification: loadWorkflowState?.hasActiveLoad && ['compliance'].includes(loadWorkflowState.currentStep),
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
      hasNotification: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  const handleNewLoad = () => {
    setActiveTab('home'); // Switch to home tab to show workflow
    onLoadAssigned();
  };

  const renderHome = () => (
    <div style={styles.contentArea}>
      {/* Show Load Workflow if active */}
      {loadWorkflowState?.hasActiveLoad ? (
        <LoadWorkFlow 
          currentStep={loadWorkflowState.currentStep}
          loadData={loadWorkflowState.loadData}
          requirements={loadWorkflowState.requirements}
          onStepChange={onWorkflowStepChange}
          onComplete={onWorkflowComplete}
          isEmbedded={true} // Flag to indicate it's embedded in dashboard
        />
      ) : (
        <>
          {/* Driver Status Section */}
          <div style={styles.statusCard}>
            <div style={styles.statusHeader}>
              <div style={styles.statusLight}></div>
              <span style={styles.statusText}>Driver Status: Available</span>
              <div style={styles.statusTime}>Online: 2h 34m</div>
            </div>
            <div style={styles.statusDetails}>
              <p style={styles.statusDescription}>Ready for load assignment</p>
              <div style={styles.locationInfo}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#00ff41" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="#00ff41" strokeWidth="2"/>
                </svg>
                <span style={styles.locationText}>Current Location: Chicago, IL</span>
              </div>
            </div>
          </div>

          {/* Load Assignment Section - Show demo load button */}
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
            <div style={styles.availabilityActions}>
              <button style={styles.refreshButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                  <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="1 20 1 14 7 14" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Refresh
              </button>
              <button style={styles.preferencesButton} onClick={handleNewLoad}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                  <rect x="1" y="3" width="15" height="13" stroke="currentColor" strokeWidth="2"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Demo Load Assignment
              </button>
            </div>
          </div>

          {/* Enhanced Performance Dashboard */}
          <div style={styles.performanceSection}>
            <h3 style={styles.sectionTitle}>Performance Dashboard</h3>
            <div style={styles.quickStats}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>47</div>
                <div style={styles.statLabel}>Loads Completed</div>
                <div style={styles.statTrend}>+3 this week</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>98.5%</div>
                <div style={styles.statLabel}>On-Time Rate</div>
                <div style={styles.statTrend}>+2.1% this month</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>4.9</div>
                <div style={styles.statLabel}>Safety Rating</div>
                <div style={styles.statTrend}>Excellent</div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div style={styles.activitySection}>
            <h3 style={styles.sectionTitle}>Recent Activity</h3>
            <div style={styles.activityList}>
              <div style={styles.activityItem}>
                <div style={styles.activityIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.activityContent}>
                  <div style={styles.activityTitle}>Load FT-2024-1245 Delivered</div>
                  <div style={styles.activityTime}>2 hours ago • Denver, CO</div>
                </div>
              </div>
              <div style={styles.activityItem}>
                <div style={styles.activityIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ffff" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.activityContent}>
                  <div style={styles.activityTitle}>DOT Inspection Completed</div>
                  <div style={styles.activityTime}>1 day ago • Passed</div>
                </div>
              </div>
              <div style={styles.activityItem}>
                <div style={styles.activityIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#ff00ff" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="#ff00ff" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.activityContent}>
                  <div style={styles.activityTitle}>HOS Reset Available</div>
                  <div style={styles.activityTime}>In 6 hours • 34hr restart</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActionsSection}>
            <h3 style={styles.sectionTitle}>Quick Actions</h3>
            <div style={styles.quickActions}>
              <button style={styles.quickActionButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polyline points="9 11 12 14 22 4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Pre-Trip Inspection
              </button>
              <button style={styles.quickActionButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Log HOS
              </button>
              <button style={styles.quickActionButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Contact Dispatch
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return renderHome();
      case 'route':
        return (
          <div style={styles.contentArea}>
            <h2 style={styles.contentTitle}>Intelligent Route Management</h2>
            
            {loadWorkflowState?.hasActiveLoad ? (
              <>
                {/* Active Route Status */}
                <div style={styles.routeStatusCard}>
                  <div style={styles.routeStatusHeader}>
                    <div style={styles.routeStatusIndicator}>
                      <div style={styles.statusLight}></div>
                      <span style={styles.routeStatusText}>
                        Active Route: {loadWorkflowState.loadData?.origin} → {loadWorkflowState.loadData?.destination}
                      </span>
                    </div>
                    <div style={styles.routeProgress}>
                      <span style={styles.progressLabel}>Status:</span>
                      <span style={styles.progressValue}>
                        {loadWorkflowState.currentStep === 'loadOffer' && 'Load Offered'}
                        {loadWorkflowState.currentStep === 'accepted' && 'Load Accepted'}
                        {loadWorkflowState.currentStep === 'navigation' && 'Navigating to Pickup'}
                        {loadWorkflowState.currentStep === 'arrival' && 'Arrived at Pickup'}
                        {loadWorkflowState.currentStep === 'confirmed' && 'Pickup Confirmed'}
                        {loadWorkflowState.currentStep === 'compliance' && 'Loading in Progress'}
                        {loadWorkflowState.currentStep === 'rolling' && 'Ready to Depart'}
                        {loadWorkflowState.currentStep === 'rollingConfirmed' && 'En Route to Delivery'}
                        {loadWorkflowState.currentStep === 'routePlan' && 'Following Route Plan'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={styles.etaSection}>
                    <div style={styles.etaBlock}>
                      <div style={styles.etaLabel}>Current ETA</div>
                      <div style={styles.etaTime}>Dec 15, 2:30 PM</div>
                      <div style={styles.etaStatus}>On Schedule</div>
                    </div>
                    <div style={styles.remainingBlock}>
                      <div style={styles.remainingLabel}>Load Details</div>
                      <div style={styles.remainingTime}>{loadWorkflowState.loadData?.id}</div>
                      <div style={styles.remainingDistance}>{loadWorkflowState.loadData?.distance}</div>
                    </div>
                  </div>
                </div>

                {/* Live Route Map */}
                <div style={styles.routeMapCard}>
                  <div style={styles.mapHeader}>
                    <h3 style={styles.mapTitle}>Live Route Tracking</h3>
                    <div style={styles.mapControls}>
                      <button style={styles.mapControlButton}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Real-Time
                      </button>
                      <button style={styles.mapControlButton}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Navigate
                      </button>
                    </div>
                  </div>
                  
                  <div style={styles.mapContainer}>
                    <svg width="100%" height="250" viewBox="0 0 500 250" style={styles.routeSvg}>
                      {/* Geofenced route corridor */}
                      <path d="M 30 125 Q 150 80 250 125 T 470 125" stroke="rgba(0, 255, 65, 0.3)" strokeWidth="25" fill="none"/>
                      <path d="M 30 125 Q 150 80 250 125 T 470 125" stroke="#00ff41" strokeWidth="4" fill="none"/>
                      
                      {/* Traffic conditions */}
                      <circle cx="180" cy="95" r="4" fill="#00ff41"/>
                      <text x="180" y="85" textAnchor="middle" fill="#00ff41" fontSize="8">CLEAR</text>
                      
                      <circle cx="320" cy="140" r="4" fill="#ffff00"/>
                      <text x="320" y="155" textAnchor="middle" fill="#ffff00" fontSize="8">MODERATE</text>
                      
                      {/* Waypoints */}
                      <rect x="110" y="185" width="40" height="15" fill="rgba(0, 255, 65, 0.2)" stroke="#00ff41" strokeWidth="1" rx="3"/>
                      <text x="130" y="195" textAnchor="middle" fill="#00ff41" fontSize="7">FUEL</text>
                      
                      <rect x="380" y="80" width="40" height="15" fill="rgba(0, 255, 65, 0.2)" stroke="#00ff41" strokeWidth="1" rx="3"/>
                      <text x="400" y="90" textAnchor="middle" fill="#00ff41" fontSize="7">REST</text>
                      
                      {/* Weather indicator */}
                      <g transform="translate(280, 60)">
                        <circle cx="0" cy="0" r="8" fill="rgba(255, 255, 0, 0.3)" stroke="#ffff00" strokeWidth="1"/>
                        <text x="0" y="20" textAnchor="middle" fill="#ffff00" fontSize="6">RAIN</text>
                      </g>
                      
                      {/* Origin and destination */}
                      <circle cx="30" cy="125" r="8" fill="#00ffff"/>
                      <text x="30" y="145" textAnchor="middle" fill="#00ffff" fontSize="9">Chicago</text>
                      
                      <circle cx="470" cy="125" r="8" fill="#ff00ff"/>
                      <text x="470" y="145" textAnchor="middle" fill="#ff00ff" fontSize="9">Denver</text>
                      
                      {/* Current position with animation */}
                      <circle cx="180" cy="95" r="6" fill="#00ff41">
                        <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <text x="180" y="75" textAnchor="middle" fill="#00ff41" fontSize="8">YOU</text>
                    </svg>
                  </div>
                  
                  <div style={styles.routeMetrics}>
                    <div style={styles.routeMetric}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                        <circle cx="12" cy="12" r="10" stroke="#00ff41" strokeWidth="2"/>
                        <path d="M12 6v6l4 2" stroke="#00ff41" strokeWidth="2"/>
                      </svg>
                      <span>Current Speed: 67 mph</span>
                    </div>
                    <div style={styles.routeMetric}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#ffff00" strokeWidth="2"/>
                      </svg>
                      <span>Weather: Light rain ahead</span>
                    </div>
                    <div style={styles.routeMetric}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                        <path d="M14 9V5a3 3 0 0 0-6 0v4M3 9h18l-1 10H4L3 9z" stroke="#00ffff" strokeWidth="2"/>
                      </svg>
                      <span>Fuel: 68% remaining</span>
                    </div>
                  </div>
                </div>

                {/* Route Intelligence */}
                <div style={styles.routeIntelligenceCard}>
                  <h3 style={styles.intelligenceTitle}>AI Route Optimization</h3>
                  <div style={styles.intelligenceGrid}>
                    <div style={styles.intelligenceItem}>
                      <div style={styles.intelligenceIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#00ff41" strokeWidth="2"/>
                          <path d="M2 17l10 5 10-5" stroke="#00ff41" strokeWidth="2"/>
                          <path d="M2 12l10 5 10-5" stroke="#00ff41" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div style={styles.intelligenceContent}>
                        <div style={styles.intelligenceLabel}>Route Optimization</div>
                        <div style={styles.intelligenceDesc}>AI suggests alternate route saving 23 minutes</div>
                        <button style={styles.intelligenceAction}>View Alternative</button>
                      </div>
                    </div>
                    
                    <div style={styles.intelligenceItem}>
                      <div style={styles.intelligenceIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M14 9V5a3 3 0 0 0-6 0v4M3 9h18l-1 10H4L3 9z" stroke="#00ffff" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div style={styles.intelligenceContent}>
                        <div style={styles.intelligenceLabel}>Fuel Optimization</div>
                        <div style={styles.intelligenceDesc}>Next fuel stop: Pilot Travel Center (147 mi)</div>
                        <button style={styles.intelligenceAction}>Add Stop</button>
                      </div>
                    </div>
                    
                    <div style={styles.intelligenceItem}>
                      <div style={styles.intelligenceIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#ff0040" strokeWidth="2"/>
                          <line x1="15" y1="9" x2="9" y2="15" stroke="#ff0040" strokeWidth="2"/>
                          <line x1="9" y1="9" x2="15" y2="15" stroke="#ff0040" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div style={styles.intelligenceContent}>
                        <div style={styles.intelligenceLabel}>Security Alert</div>
                        <div style={styles.intelligenceDesc}>High-theft zone detected at mile 420</div>
                        <button style={styles.intelligenceAction}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Waypoints */}
                <div style={styles.waypointsCard}>
                  <h3 style={styles.waypointsTitle}>Upcoming Waypoints</h3>
                  <div style={styles.waypointsList}>
                    <div style={styles.waypointItem}>
                      <div style={styles.waypointIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M14 9V5a3 3 0 0 0-6 0v4M3 9h18l-1 10H4L3 9z" stroke="#00ff41" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div style={styles.waypointInfo}>
                        <div style={styles.waypointName}>Pilot Travel Center</div>
                        <div style={styles.waypointDetails}>147 miles • 2h 15m • Fuel, Food, Rest</div>
                        <div style={styles.waypointEta}>ETA: 11:45 PM</div>
                      </div>
                      <div style={styles.waypointStatus}>Required</div>
                    </div>
                    
                    <div style={styles.waypointItem}>
                      <div style={styles.waypointIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="3" width="20" height="14" rx="2" stroke="#00ffff" strokeWidth="2"/>
                          <line x1="8" y1="21" x2="16" y2="21" stroke="#00ffff" strokeWidth="2"/>
                          <line x1="12" y1="17" x2="12" y2="21" stroke="#00ffff" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div style={styles.waypointInfo}>
                        <div style={styles.waypointName}>DOT Inspection Station</div>
                        <div style={styles.waypointDetails}>285 miles • 4h 30m • Mandatory inspection</div>
                        <div style={styles.waypointEta}>ETA: 2:15 AM</div>
                      </div>
                      <div style={styles.waypointStatus}>Mandatory</div>
                    </div>
                    
                    <div style={styles.waypointItem}>
                      <div style={styles.waypointIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#ff00ff" strokeWidth="2"/>
                          <circle cx="12" cy="10" r="3" stroke="#ff00ff" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div style={styles.waypointInfo}>
                        <div style={styles.waypointName}>Delivery Destination</div>
                        <div style={styles.waypointDetails}>656 miles • 11h 45m • Commerce City, CO</div>
                        <div style={styles.waypointEta}>ETA: 2:30 PM</div>
                      </div>
                      <div style={styles.waypointStatus}>Final</div>
                    </div>
                  </div>
                </div>

                {/* Route Controls */}
                <div style={styles.routeControlsCard}>
                  <h3 style={styles.controlsTitle}>Route Management</h3>
                  <div style={styles.controlsGrid}>
                    <button style={styles.controlButton}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Start Navigation
                    </button>
                    <button style={styles.controlButton}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="1 20 1 14 7 14" stroke="currentColor" strokeWidth="2"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Recalculate Route
                    </button>
                    <button style={styles.controlButton}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Contact Dispatch
                    </button>
                    <button style={styles.controlButton}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Emergency Stop
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={styles.placeholderCard}>
                <p style={styles.placeholderText}>No active route. Route information will appear here when a load is assigned.</p>
              </div>
            )}
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
            return <DriverSettings />;
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
                position: 'relative'
              }}>
                {item.icon}
                {item.hasNotification && (
                  <div style={styles.notificationDot}></div>
                )}
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
    justifyContent: 'space-between',
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
  statusTime: {
    marginLeft: 'auto',
    fontSize: '0.8rem',
    color: '#00ffff',
    fontFamily: 'Orbitron, sans-serif',
  },
  statusDetails: {
    textAlign: 'center',
  },
  statusDescription: {
    color: '#e0e0e0',
    margin: 0,
    fontSize: '1rem',
  },
  locationInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '0.5rem',
  },
  locationText: {
    fontSize: '0.9rem',
    color: '#999',
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
  priorityBadge: {
    backgroundColor: '#ff0040',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    marginLeft: 'auto',
  },
  notificationBody: {
    textAlign: 'center',
  },
  notificationText: {
    color: '#e0e0e0',
    marginBottom: '1.5rem',
    lineHeight: '1.4',
  },
  loadPreview: {
    marginBottom: '1.5rem',
  },
  loadRoute: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  routeOrigin: {
    color: '#00ffff',
  },
  routeDestination: {
    color: '#ff00ff',
  },
  loadDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  loadDetailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadDetailLabel: {
    color: '#999',
    fontSize: '0.8rem',
  },
  loadDetailValue: {
    color: '#e0e0e0',
    fontWeight: 600,
    fontSize: '0.9rem',
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
  availabilityActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  refreshButton: {
    flex: 1,
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem',
    color: '#00ff41',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  preferencesButton: {
    flex: 1,
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem',
    color: '#00ffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  performanceSection: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  sectionTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
    textAlign: 'center',
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
  statTrend: {
    fontSize: '0.7rem',
    color: '#00ff41',
    marginTop: '0.25rem',
    fontWeight: 500,
  },
  activitySection: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  activityIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: '#e0e0e0',
    fontWeight: 600,
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  activityTime: {
    color: '#999',
    fontSize: '0.8rem',
  },
  quickActionsSection: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  quickActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  quickActionButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    color: '#e0e0e0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
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
  // New route-related styles
  routeStatusCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
  },
  routeStatusHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  routeStatusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  routeStatusText: {
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 600,
    color: '#00ff41',
  },
  routeProgress: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  progressLabel: {
    fontSize: '0.8rem',
    color: '#999',
  },
  progressValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#00ffff',
  },
  etaSection: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '2rem',
  },
  etaBlock: {
    textAlign: 'center',
    flex: 1,
  },
  etaLabel: {
    fontSize: '0.8rem',
    color: '#999',
    marginBottom: '0.25rem',
  },
  etaTime: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#00ff41',
    marginBottom: '0.25rem',
  },
  etaStatus: {
    fontSize: '0.8rem',
    color: '#00ffff',
    fontWeight: 500,
  },
  remainingBlock: {
    textAlign: 'center',
    flex: 1,
  },
  remainingLabel: {
    fontSize: '0.8rem',
    color: '#999',
    marginBottom: '0.25rem',
  },
  remainingTime: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  remainingDistance: {
    fontSize: '0.8rem',
    color: '#999',
  },
  routeMapCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  mapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  mapTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  mapControls: {
    display: 'flex',
    gap: '0.5rem',
  },
  mapControlButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#00ff41',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    transition: 'all 0.3s ease',
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
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  routeMetrics: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
  },
  routeMetric: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#e0e0e0',
    flex: 1,
    minWidth: '150px',
  },
  routeIntelligenceCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  intelligenceTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  intelligenceGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  intelligenceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  intelligenceIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  intelligenceContent: {
    flex: 1,
  },
  intelligenceLabel: {
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  intelligenceDesc: {
    fontSize: '0.9rem',
    color: '#999',
    marginBottom: '0.75rem',
    lineHeight: '1.4',
  },
  intelligenceAction: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    color: '#00ff41',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  waypointsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  waypointsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  waypointsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  waypointItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  waypointIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  waypointInfo: {
    flex: 1,
  },
  waypointName: {
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  waypointDetails: {
    fontSize: '0.8rem',
    color: '#999',
    marginBottom: '0.25rem',
  },
  waypointEta: {
    fontSize: '0.8rem',
    color: '#00ffff',
    fontWeight: 500,
  },
  waypointStatus: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    color: '#00ff41',
  },
  routeControlsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  controlsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  controlButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    color: '#e0e0e0',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    textAlign: 'center',
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
  notificationDot: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    width: '8px',
    height: '8px',
    backgroundColor: '#ff0040',
    borderRadius: '50%',
    boxShadow: '0 0 6px #ff0040',
    animation: 'pulse 2s ease-in-out infinite',
  },
};

export default DriverDashboard;
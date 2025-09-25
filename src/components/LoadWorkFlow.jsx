import React, { useState, useEffect } from 'react';
import logoImage from '../logos/FreightTrixHeader_Graphic.png';
import LiveMap from '../trimble/LiveMap';

// ⬆️ top of file, under imports
const PRE_TRIP_REQUIREMENTS = Object.freeze([
  { task: 'Sweep floor clear of debris', completed: false },
  { task: 'Get acidic trailer washout to prevent odors', completed: false },
  { task: 'Trailer must be completely empty prior to pickup', completed: false },
  { task: 'Bring trailer seal', completed: false },
  { task: 'Print paperwork prior to pickup', completed: false },
  { task: 'Precondition trailer to 41F prior to pickup', completed: false },
]);

// Small rectangle helper for restricted zones (about ~5–8 km across)
const rect = (lng, lat, dLng = 0.060, dLat = 0.045) => ([
  [lng - dLng, lat - dLat],
  [lng - dLng, lat + dLat],
  [lng + dLng, lat + dLat],
  [lng + dLng, lat - dLat],
  [lng - dLng, lat - dLat], // close ring
]);




// Planned waypoints (BLUE) – per client sketch
// 1) West of Davenport (Walcott, IA – I-80 Truck Stop vicinity)
// 3) Midway between Davenport, IA and DeKalb, IL
const PLANNED_WAYPOINTS = Object.freeze([
  {
    id: 'wp-walcott',
    name: 'Planned Waypoint – West of Davenport (Walcott, IA)',
    lat: 41.6128,
    lng: -90.7782,
  },
  {
    id: 'wp-mid-davenport-dekalb',
    name: 'Planned Waypoint – Midpoint (Sterling/Dixon area, IL)',
    lat: 41.7266,
    lng: -89.6640,
  },
]);


// Restricted zones (RED) – tight boxes centered on requested points
// 2) Davenport, IA
// 4) DeKalb, IL
// 5) ORD / Bensenville, IL (slightly west of Chicago)
// 6) Chicago proper (as close to the lake as possible)
const RESTRICTED_ZONES = Object.freeze([
  {
    id: 'rz-davenport',
    name: 'Restricted – Davenport, IA',
    // Davenport: 41.5236, -90.5776
    polygon: rect(-90.5776, 41.5236),
  },
  {
    id: 'rz-dekalb',
    name: 'Restricted – DeKalb, IL',
    // DeKalb: 41.9295, -88.7504
    polygon: rect(-88.7504, 41.9295),
  },
  {
    id: 'rz-ord-bensenville',
    name: 'Restricted – ORD / Bensenville, IL',
    // O'Hare area: 41.9742, -87.9073
    polygon: rect(-87.9073, 41.9742),
  },
  {
    id: 'rz-chicago-core',
    name: 'Restricted – Chicago (Downtown/Lakefront)',
    // Near lakefront downtown: ~41.8850, -87.6200
    polygon: rect(-87.6200, 41.8850, 0.045, 0.035), // a bit tighter to hug lakefront
  },
]);


// helper keeps any existing completion state but enforces items + order
const normalizeRequirements = (incoming = []) => {
  const byTask = new Map(incoming.map(r => [r.task, r]));
  return PRE_TRIP_REQUIREMENTS.map(r => byTask.get(r.task) ?? { ...r });
};

// Approx FreshNet pickup coords (you can tweak)
const PICKUP_COORDS = { lat: 41.8881, lng: -87.6298 }; // Chicago, IL

// NEW: brand blue pulled from FTRX logo ("Load")
const LOGO_BLUE = '#00A3FF';

const LoadWorkflow = ({
  currentStep: propCurrentStep,
  loadData: propLoadData,
  requirements: propRequirements,
  onStepChange,
  onComplete,
  isEmbedded = false
}) => {
  const [currentStep, setCurrentStep] = useState(propCurrentStep || 'loadOffer');
  const [showPulse, setShowPulse] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [driverPos, setDriverPos] = useState({ lat: 41.881, lng: -87.64 }); // fallback Loop
  
  const [requirements, setRequirements] = useState(() =>
    normalizeRequirements(propRequirements)
  );

  // Update internal state when props change
  useEffect(() => {
    if (propCurrentStep) setCurrentStep(propCurrentStep);
  }, [propCurrentStep]);

  // Keep it in sync if props change (but still normalized & ordered):
  useEffect(() => {
    setRequirements(normalizeRequirements(propRequirements));
  }, [propRequirements]);
  
  // (Optionally) when the user first lands on “Pre-Trip Requirements”:
  useEffect(() => {
    if (currentStep === 'accepted') {
      setRequirements(prev => normalizeRequirements(prev));
    }
  }, [currentStep]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setDriverPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}, // ignore errors; keep fallback
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Centralized step change handler
  const handleStepChange = (newStep, additionalData = {}) => {
    setCurrentStep(newStep);
    if (onStepChange) {
      onStepChange(newStep, additionalData);
    }
  };

  const handleAcceptLoad = () => {
    handleStepChange('accepted');
  };

  const handleDenyLoad = () => {
    handleStepChange('denied'); // Notify parent of denial
  };

  const handleStartGPS = () => {
    handleStepChange('arrival');
  };

  const handleArrivalResponse = (arrived) => {
    if (arrived) {
      handleStepChange('confirmed');
    }
  };

  const handleCompliance = () => {
    handleStepChange('compliance');
  };

  const handleRollingResponse = (rolling) => {
    if (rolling) {
      handleStepChange('rollingConfirmed');
    }
  };

  const handleViewRoutePlan = () => {
    handleStepChange('routePlan');
  };

  const toggleRequirement = (index) => {
    const newRequirements = [...requirements];
    newRequirements[index].completed = !newRequirements[index].completed;
    setRequirements(newRequirements);
  };

  const renderLoadOffer = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <div style={styles.priorityIndicator}>
          <span style={styles.priorityText}>HIGH PRIORITY</span>
          <div style={styles.urgencyTimer}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <circle cx="12" cy="12" r="10" stroke="#ff0040" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="#ff0040" strokeWidth="2"/>
            </svg>
            <span>Expires in 12:34</span>
          </div>
        </div>
        <h2 style={styles.stepTitle}>Premium Load Available</h2>
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
          <div style={styles.qualificationItem}>
            <div style={styles.checkmark}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
            </div>
            <span style={styles.qualificationText}>HAZMAT Certified</span>
          </div>
        </div>
      </div>

      <div style={styles.loadDetailsCard}>
        <div style={styles.loadInfo}>
          <div style={styles.loadHeader}>
            <h3 style={styles.loadTitle}>Load #FT-2024-1247</h3>
            <div style={styles.loadType}>Temperature Controlled</div>
          </div>
          <div style={styles.routeDisplay}>
            <div style={styles.locationBlock}>
              <div style={styles.locationLabel}>PICKUP</div>
              <div style={styles.locationCity}>Chicago, IL</div>
              <div style={styles.locationAddress}>2150 W Fulton St</div>
              <div style={styles.locationTime}>Dec 13, 2024 • 8:00 AM</div>
            </div>
            <div style={styles.routeArrow}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#00ff41" strokeWidth="2"/>
              </svg>
            </div>
            <div style={styles.locationBlock}>
              <div style={styles.locationLabel}>DELIVERY</div>
              <div style={styles.locationCity}>Denver, CO</div>
              <div style={styles.locationAddress}>5500 E 58th Ave</div>
              <div style={styles.locationTime}>Dec 15, 2024 • 2:30 PM</div>
            </div>
          </div>

          <div style={styles.loadMetrics}>
            <div style={styles.metricItem}>
              <div style={styles.metricIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#00ffff" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="#00ffff" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.metricInfo}>
                <div style={styles.metricValue}>1,003 mi</div>
                <div style={styles.metricLabel}>Total Distance</div>
              </div>
            </div>
            <div style={styles.metricItem}>
              <div style={styles.metricIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <line x1="12" y1="1" x2="12" y2="23" stroke="#00ff41" strokeWidth="2"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#00ff41" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.metricInfo}>
                <div style={styles.metricValue}>$2,850</div>
                <div style={styles.metricLabel}>Total Payment</div>
              </div>
            </div>
            <div style={styles.metricItem}>
              <div style={styles.metricIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#ff00ff" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="#ff00ff" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.metricInfo}>
                <div style={styles.metricValue}>18 hrs</div>
                <div style={styles.metricLabel}>Transit Time</div>
              </div>
            </div>
          </div>

          <div style={styles.cargoDetails}>
            <h4 style={styles.cargoTitle}>Cargo Information</h4>
            <div style={styles.cargoGrid}>
              <div style={styles.cargoItem}>
                <span style={styles.cargoLabel}>Weight:</span>
                <span style={styles.cargoValue}>2850 lbs</span>
              </div>
              <div style={styles.cargoItem}>
                <span style={styles.cargoLabel}>Commodity:</span>
                <span style={styles.cargoValue}>Pharmaceuticals</span>
              </div>
              <div style={styles.cargoItem}>
                <span style={styles.cargoLabel}>Temperature:</span>
                <span style={styles.cargoValue}>2-8°C</span>
              </div>
              <div style={styles.cargoItem}>
                <span style={styles.cargoLabel}>Value:</span>
                <span style={styles.cargoValue}>$2.3M</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.acceptButton} onClick={handleAcceptLoad}>
          Accept Load
        </button>
        <button style={styles.denyButton} onClick={handleDenyLoad}>
          Decline
        </button>
      </div>
    </div>
  );

  const renderAccepted = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <div style={styles.successIndicator}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#00ff41"/>
            <path d="m9 12 2 2 4-4" stroke="#0d0208" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={styles.successText}>Load Accepted</span>
        </div>
        <h2 style={{ ...styles.stepTitle, fontSize: '1.6rem' }}>Pre-Trip Requirements</h2>
        <div style={styles.timeStamp}>
          Accepted: {currentTime.toLocaleTimeString()} • Load #FT-2024-1247
        </div>
      </div>

      <div style={styles.requirementsCard}>
        <div style={styles.progressHeader}>
          <h3 style={{ ...styles.requirementsTitle, fontSize: '1.3rem' }}>Compliance Checklist</h3>
          <div style={styles.completionBadge}>
            {requirements.filter(req => req.completed).length}/{requirements.length} Complete
          </div>
        </div>
        
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
              <div style={styles.requirementContent}>
                <span style={styles.requirementText}>{req.task}</span>
                {req.completed && (
                  <div style={styles.completedTime}>
                    Completed: {currentTime.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.additionalInfo}>
          <div style={styles.infoItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <circle cx="12" cy="12" r="10" stroke="#00ffff" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="#00ffff" strokeWidth="2"/>
            </svg>
            <span>Pickup window: 7:30 AM - 8:30 AM</span>
          </div>
          <div style={styles.infoItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#ff00ff" strokeWidth="2"/>
            </svg>
            <span>Contact: Sarah Johnson (312) 555-0147</span>
          </div>
        </div>
      </div>

      <button style={styles.continueButton} onClick={() => handleStepChange('navigation')}>
        Proceed to Navigation
      </button>
    </div>
  );

  const renderNavigation = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Navigate to Pickup Location</h2>
        <div style={styles.navigationInfo}>
          <div style={styles.addressContainer}>
            <div style={styles.facilityName}>FreshNet Warehouse</div>
            <p style={styles.addressText}>2150 W Fulton St</p>
            <p style={styles.addressText}>Chicago, IL 60612</p>
          </div>
          <div style={styles.etaInfo}>
            <div style={styles.etaLabel}>ETA</div>
            <div style={styles.etaTime}>23 min</div>
            <div style={styles.trafficStatus}>Light traffic</div>
          </div>
        </div>
      </div>

      <div style={styles.navigationControls}>
        <button style={styles.gpsButton} onClick={handleStartGPS}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
            <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Start Navigation
        </button>
        <button style={styles.callButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Call Shipper
        </button>
      </div>

      <div style={styles.mapCard}>
        <div style={styles.mapHeader}>
          <h3 style={styles.mapTitle}>Live Route Tracking</h3>
          <div style={styles.gpsStatus}>
            <div style={styles.gpsIndicator}></div>
            <span>GPS Active</span>
          </div>
        </div>
        <div style={styles.mapContainer}>
          <LiveMap
            height={220}
            showRoute={true}
            shipment={{
              id: 'nav-pickup-FT-2024-1247',
              origin: 'Current Position',
              destination: 'FreshNet Warehouse, 2150 W Fulton St, Chicago, IL 60612',
              originCoords: driverPos,            // ← explicit coordinates (new)
              destCoords: PICKUP_COORDS,            // ← explicit coordinates (new)
              truck: 'FT-2024-TR-456',
              driver: 'You',
              currentLocation: 'En route to pickup',
              temperature: '—',
              progress: 0,
              onTime: true,
              eta: '—'
            }}
          />
        </div>
        
        <div style={styles.routeDetails}>
          <div style={styles.routeMetric}>
            <span style={styles.metricLabel}>Distance:</span>
            <span style={styles.metricValue}>14.7 mi</span>
          </div>
          <div style={styles.routeMetric}>
            <span style={styles.metricLabel}>Duration:</span>
            <span style={styles.metricValue}>23 min</span>
          </div>
          <div style={styles.routeMetric}>
            <span style={styles.metricLabel}>Traffic:</span>
            <span style={styles.metricValue}>Light</span>
          </div>
        </div>
        
        <p style={styles.geofenceText}>Stay within the highlighted geofenced area for optimal tracking</p>
      </div>
    </div>
  );

  const renderArrival = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <div style={styles.notificationBadge}>
          <span style={styles.notificationNumber}>!</span>
        </div>
        <h2 style={styles.stepTitle}>Geofence Detection</h2>
        <div style={styles.locationConfirm}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#00ff41" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="#00ff41" strokeWidth="2"/>
          </svg>
          <span>Located at FreshNet Warehouse</span>
        </div>
      </div>

      <div style={styles.arrivalCard}>
        <div style={styles.facilityInfo}>
          <h3 style={styles.facilityTitle}>FreshNet Warehouse</h3>
          <div style={styles.facilityDetails}>
            <p style={styles.addressText}>2150 W Fulton St, Chicago, IL 60612</p>
            <div style={styles.arrivalTime}>
              Arrived: {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div style={styles.checkInPrompt}>
          <div style={styles.promptIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#00ff41" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="#00ff41" strokeWidth="2"/>
            </svg>
          </div>
          <div style={styles.promptText}>
            <h4 style={styles.promptTitle}>Confirm On-Site Arrival</h4>
            <p style={styles.promptDesc}>System detected you've arrived at the pickup location. You're on site — please confirm to begin the loading process.</p>
          </div>
        </div>
      </div>

      <div style={styles.questionCard}>
        <p style={styles.questionText}>Have you arrived on site for pickup at FreshNet Warehouse in Chicago, IL?</p>
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.acceptButton} onClick={() => handleArrivalResponse(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
            <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Yes, I'm On-Site
        </button>
        <button style={styles.denyButton} onClick={() => handleArrivalResponse(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Not Yet
        </button>
      </div>
    </div>
  );

  const renderConfirmed = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <div style={styles.successIndicator}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#00ff41"/>
            <path d="m9 12 2 2 4-4" stroke="#0d0208" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={styles.successText}>Arrival Confirmed</span>
        </div>
        <h2 style={styles.stepTitle}>Check-In Complete</h2>
      </div>

      <div style={styles.confirmationCard}>
        <div style={styles.confirmationDetails}>
          <div style={styles.confirmationItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <circle cx="12" cy="12" r="10" stroke="#00ff41" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="#00ff41" strokeWidth="2"/>
            </svg>
            <span>On-site arrival logged at {currentTime.toLocaleTimeString()}</span>
          </div>
          <div style={styles.confirmationItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#00ffff" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="#00ffff" strokeWidth="2"/>
            </svg>
            <span>GPS coordinates: 41.8881°N, 87.6298°W</span>
          </div>
          <div style={styles.confirmationItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="#ff00ff" strokeWidth="2"/>
              <line x1="8" y1="21" x2="16" y2="21" stroke="#ff00ff" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke="#ff00ff" strokeWidth="2"/>
            </svg>
            <span>Load #FT-2024-1247 status updated</span>
          </div>
        </div>
        
        <div style={styles.nextStepsInfo}>
          <h4 style={styles.nextStepsTitle}>Next Steps</h4>
          <ul style={styles.nextStepsList}>
            <li>Proceed to loading dock #7</li>
            <li>Present BOL to facility manager</li>
            <li>Complete compliance checklist</li>
            <li>Document cargo loading process</li>
          </ul>
        </div>
      </div>

      <button style={styles.continueButton} onClick={handleCompliance}>
        Begin Loading Process
      </button>
    </div>
  );

  const renderCompliance = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Loading compliance protocol</h2>
        <div style={styles.facilityBadge}>
          <span>Loading Dock #7 • FreshNet Warehouse</span>
        </div>
      </div>

      <div style={styles.complianceCard}>
        <div style={styles.complianceHeader}>
          <h3 style={styles.complianceTitle}>Required Documentation & Procedures</h3>
          <div style={styles.complianceProgress}>
            {requirements.filter(req => req.completed).length}/{requirements.length} Verified
          </div>
        </div>

        <div style={styles.complianceList}>
          {requirements.map((req, index) => (
            <div key={index} style={styles.complianceItem}>
              <div style={styles.complianceCheckmark}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
                </svg>
              </div>
              <div style={styles.complianceContent}>
                <span style={styles.complianceText}>{req.task}</span>
                <div style={styles.complianceDetails}>
                  {index === 0 && <span>Debris removed • Floor swept</span>}
                  {index === 1 && <span>Use acidic washout to prevent odors</span>}
                  {index === 2 && <span>Verify trailer is empty (no pallets/returns)</span>}
                  {index === 3 && <span>Seal on hand • Record seal # at shipper</span>}
                  {index === 4 && <span>BOL printed and ready</span>}
                  {index === 5 && <span>Reefer preconditioned to 41°F (pre-cool ~30 min)</span>}
                </div>
              </div>
              <div style={styles.statusBadge}>Verified</div>
            </div>
          ))}
          {/* NEW: bottom requirement (red, unchecked, upload photo) */}
          <div style={styles.complianceItem}>
            <div
              style={{
                ...styles.complianceCheckmark,
                backgroundColor: 'transparent',
                border: '2px solid #ff0040'
              }}
            />
            <div style={styles.complianceContent}>
              <span style={styles.complianceText}>Shipper signs Bill of Lading</span>
              <div style={styles.complianceDetails}>
                Upload a photo of the signed BOL before departure
              </div>
            </div>
            <div
              style={{
                ...styles.statusBadge,
                backgroundColor: '#ff0040',
                color: '#fff'
              }}
            >
              Upload Photo
            </div>
          </div>
        </div>

        <div style={styles.additionalChecks}>
          <h4 style={styles.additionalTitle}>Additional Verifications</h4>
          <div style={styles.checkGrid}>
            <div style={styles.checkItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <span>Chain of custody verified</span>
            </div>
            <div style={styles.checkItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <span>Temperature monitoring active</span>
            </div>
            <div style={styles.checkItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <span>Load securement inspected</span>
            </div>
            <div style={styles.checkItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <span>Bill of lading signed</span>
            </div>
          </div>
        </div>
      </div>

      <button style={styles.continueButton} onClick={() => handleStepChange('rolling')}>
        Complete Loading Protocol
      </button>
    </div>
  );

  const renderRolling = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Departure Clearance</h2>
        <div style={styles.departureInfo}>
          <div style={styles.loadTime}>
            Loading completed: {currentTime.toLocaleTimeString()}
          </div>
          <div style={styles.duration}>
            Total loading time: 1h 27m
          </div>
        </div>
      </div>

      <div style={styles.departureCard}>
        <div style={styles.preFlightChecks}>
          <h3 style={styles.preFlightTitle}>Pre-Departure Verification</h3>
          <div style={styles.checksList}>
            <div style={styles.systemCheck}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <span>Trailer door sealed and locked</span>
              <div style={styles.checkValue}>Seal #TMP-847592</div>
            </div>
            <div style={styles.systemCheck}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <span>Temperature system operational</span>
              <div style={styles.checkValue}>4.2°C Stable</div>
            </div>
            <div style={styles.systemCheck}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <span>GPS tracking active</span>
              <div style={styles.checkValue}>Signal Strong</div>
            </div>
            <div style={styles.systemCheck}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <span>Documentation complete</span>
              <div style={styles.checkValue}>All verified</div>
            </div>
          </div>
        </div>

        <div style={styles.cargoSummary}>
          <h4 style={styles.summaryTitle}>Load Summary</h4>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Cargo:</span>
              <span style={styles.summaryValue}>1 pallet pharmaceuticals</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Reference:</span>
              <span style={styles.summaryValue}>#US3111U5</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Weight:</span>
              <span style={styles.summaryValue}>2850 lbs</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Value:</span>
              <span style={styles.summaryValue}>$2.3M insured</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.questionCard}>
        <div style={styles.questionHeader}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="3" width="15" height="13" stroke="#00ff41" strokeWidth="2"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="#00ff41" strokeWidth="2"/>
            <circle cx="5.5" cy="18.5" r="2.5" stroke="#00ff41" strokeWidth="2"/>
            <circle cx="18.5" cy="18.5" r="2.5" stroke="#00ff41" strokeWidth="2"/>
          </svg>
          <span style={styles.questionTitle}>Ready for Departure?</span>
        </div>
        <p style={styles.questionText}>Confirm that you are loaded, secured, and ready to depart for Denver, CO</p>
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.acceptButton} onClick={() => handleRollingResponse(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
            <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Begin Transit
        </button>
        <button style={styles.denyButton} onClick={() => handleRollingResponse(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Hold Position
        </button>
      </div>
    </div>
  );

  const renderRollingConfirmed = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <div style={styles.successIndicator}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="#00ff41" strokeWidth="2"/>
          </svg>
          <span style={styles.successText}>En Route</span>
        </div>
        <h2 style={styles.stepTitle}>Transit Initiated</h2>
      </div>

      <div style={styles.transitCard}>
        <div style={styles.transitStatus}>
          <h3 style={styles.transitTitle}>Active Transport Status</h3>
          <div style={styles.statusIndicators}>
            <div style={styles.indicator}>
              <div style={styles.indicatorLight}></div>
              <span>GPS Tracking Active</span>
            </div>
            <div style={styles.indicator}>
              <div style={styles.indicatorLight}></div>
              <span>Temperature Monitoring</span>
            </div>
            <div style={styles.indicator}>
              <div style={styles.indicatorLight}></div>
              <span>Route Optimization</span>
            </div>
          </div>
        </div>

        <div style={styles.transitDetails}>
          <div style={styles.transitInfo}>
            <div style={styles.infoBlock}>
              <div style={styles.infoLabel}>Departure Time</div>
              <div style={styles.infoValue}>{currentTime.toLocaleTimeString()}</div>
            </div>
            <div style={styles.infoBlock}>
              <div style={styles.infoLabel}>Expected Arrival</div>
              <div style={styles.infoValue}>Dec 15, 2:30 PM</div>
            </div>
            <div style={styles.infoBlock}>
              <div style={styles.infoLabel}>Current Temp</div>
              <div style={styles.infoValue}>4.2°C ✓</div>
            </div>
          </div>
          
          <div style={styles.cargoConfirmation}>
            <p style={styles.confirmationText}>
              Loaded and rolling with 1 pallet for reference #US3111U5
            </p>
            <div style={styles.cargoSpecs}>
              <span>Weight: 2850 lbs • Value: $2.3M • Temperature Controlled</span>
            </div>
          </div>
        </div>
      </div>

      <button style={styles.continueButton} onClick={handleViewRoutePlan}>
        View Full Route Plan
      </button>
    </div>
  );

  const renderRoutePlan = () => (
    <div style={styles.stepContainer}>
      <div style={styles.headerCard}>
        <h2 style={styles.stepTitle}>Intelligent Route Management</h2>
        <div style={styles.routeStats}>
          <div style={styles.routeStat}>
            <span style={styles.statValue}>1,003 mi</span>
            <span style={styles.statLabel}>Total Distance</span>
          </div>
          <div style={styles.routeStat}>
            <span style={styles.statValue}>18h 24m</span>
            <span style={styles.statLabel}>Est. Transit</span>
          </div>
          <div style={styles.routeStat}>
            <span style={styles.statValue}>ETA</span>
            <span style={styles.statLabel}>Tomorrow morning at 8am</span>
          </div>
        </div>
      </div>

      <div style={styles.routePlanCard}>
        <div style={styles.mapHeader}>
          <h3 style={styles.mapTitle}>AI-Optimized Route with Geofencing</h3>
          <div style={styles.optimizationBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#00ff41" strokeWidth="2"/>
              <path d="M2 17l10 5 10-5" stroke="#00ff41" strokeWidth="2"/>
              <path d="M2 12l10 5 10-5" stroke="#00ff41" strokeWidth="2"/>
            </svg>
            <span>AI Optimized</span>
          </div>
        </div>
        
        <div style={styles.mapContainer}>
        <LiveMap
            height={280}
            showRoute={true}
            // NEW: overlays for this screen
            plannedWaypoints={PLANNED_WAYPOINTS}
            restrictedZones={RESTRICTED_ZONES}
            showGeofenceCorridor={true}
            shipment={{
              id: 'route-plan-FT-2024-1247',
              origin: 'Chicago, IL',
              destination: 'Denver, CO',
              truck: 'FT-2024-TR-456',
              driver: '—',
              currentLocation: 'Chicago, IL',
              temperature: '4.2°C',
              progress: 10,
              onTime: true,
              eta: 'Dec 15, 2:30 PM'
            }}
          />

        </div>

        <div style={styles.routeAnalytics}>
          <div style={styles.analyticsSection}>
            <h4 style={styles.analyticsTitle}>Route Intelligence</h4>
            <div style={styles.analyticsGrid}>
              <div style={styles.analyticsItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#ffff00" strokeWidth="2"/>
                </svg>
                <span>Weather: Light rain expected near mile 400</span>
              </div>
              <div style={styles.analyticsItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                  <circle cx="12" cy="12" r="10" stroke="#ff0040" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="#ff0040" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="#ff0040" strokeWidth="2"/>
                </svg>
                <span>Avoid: High-theft zones marked in red</span>
              </div>
              <div style={styles.analyticsItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                  <circle cx="12" cy="12" r="10" stroke="#00ff41" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="#00ff41" strokeWidth="2"/>
                </svg>
                <span>Optimal, secure fuel stops identified for cost savings</span>
              </div>
              <div style={styles.analyticsItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke="#00ffff" strokeWidth="2"/>
                  <line x1="8" y1="21" x2="16" y2="21" stroke="#00ffff" strokeWidth="2"/>
                  <line x1="12" y1="17" x2="12" y2="21" stroke="#00ffff" strokeWidth="2"/>
                </svg>
                <span>Real-time tracking for customer updates</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.legendContainer}>
          <h4 style={styles.legendTitle}>Route Legend</h4>
          <div style={styles.legendGrid}>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, backgroundColor: 'rgba(0, 255, 65, 0.3)'}}></div>
              <span style={styles.legendText}>Geofenced Corridor</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, backgroundColor: 'rgba(255, 0, 64, 0.3)'}}></div>
              <span style={styles.legendText}>Restricted Zones</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, backgroundColor: 'rgba(0, 255, 65, 0.3)', border: '2px solid #00ff41'}}></div>
              <span style={styles.legendText}>Approved Stops</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, backgroundColor: '#00ffff'}}></div>
              <span style={styles.legendText}>Planned Waypoints</span>
            </div>
          </div>
        </div>
      </div>

      <button style={styles.continueButton} onClick={onComplete}>
        Begin Monitored Transit
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

      {/* Main Content */}
      <div className="load-workflow-main-content" style={styles.mainContent}>
        {renderCurrentStep()}
      </div>

      {/* Conditionally render bottom nav */}
      {!isEmbedded && (
        <div style={styles.bottomNav}>
          <div style={styles.navItem}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="3" width="15" height="13" stroke="#00ff41" strokeWidth="2"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="#00ff41" strokeWidth="2"/>
              <circle cx="5.5" cy="18.5" r="2.5" stroke="#00ff41" strokeWidth="2"/>
              <circle cx="18.5" cy="18.5" r="2.5" stroke="#00ff41" strokeWidth="2"/>
            </svg>
            <span style={styles.navLabel}>Load</span>
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
      )}

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

          @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 65, 0.3); }
            50% { box-shadow: 0 0 25px rgba(0, 255, 65, 0.6); }
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
  priorityIndicator: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  priorityText: {
    backgroundColor: '#ff0040',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  urgencyTimer: {
    display: 'flex',
    alignItems: 'center',
    color: '#ff0040',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  stepTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.3rem',
    fontWeight: 600,
    margin: '0 0 1rem 0',
    color: '#00ff41',
  },
  successIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  successText: {
    color: '#00ff41',
    fontWeight: 600,
    fontFamily: 'Orbitron, sans-serif',
  },
  timeStamp: {
    color: '#999',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
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
  locationConfirm: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#00ff41',
    fontWeight: 500,
    marginTop: '0.5rem',
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
  loadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  loadTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ffff',
    margin: 0,
  },
  loadType: {
    backgroundColor: 'rgba(255, 0, 255, 0.2)',
    color: '#ff00ff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  routeDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    gap: '1rem',
  },
  locationBlock: {
    flex: 1,
    textAlign: 'center',
  },
  locationLabel: {
    fontSize: '0.7rem',
    color: '#999',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  locationCity: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  locationAddress: {
    fontSize: '0.8rem',
    color: '#999',
    marginBottom: '0.25rem',
  },
  locationTime: {
    fontSize: '0.8rem',
    color: '#ff00ff',
    fontWeight: 500,
  },
  routeArrow: {
    color: '#00ff41',
  },
  loadMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  metricIcon: {
    marginBottom: '0.5rem',
  },
  metricInfo: {
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  metricLabel: {
    fontSize: '0.8rem',
    color: '#999',
  },
  cargoDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  cargoTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 0.75rem 0',
    textAlign: 'center',
  },
  cargoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
  },
  cargoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cargoLabel: {
    color: '#999',
    fontSize: '0.8rem',
  },
  cargoValue: {
    color: '#e0e0e0',
    fontWeight: 500,
    fontSize: '0.8rem',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  navigationInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  },
  addressContainer: {
    textAlign: 'left',
  },
  facilityName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ffff',
    marginBottom: '0.25rem',
  },
  addressText: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    margin: '0.1rem 0',
  },
  etaInfo: {
    textAlign: 'right',
  },
  etaLabel: {
    fontSize: '0.7rem',
    color: '#999',
    marginBottom: '0.25rem',
  },
  etaTime: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#00ff41',
    marginBottom: '0.25rem',
  },
  trafficStatus: {
    fontSize: '0.8rem',
    color: '#00ff41',
  },
  navigationControls: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
  },
  gpsButton: {
    flex: 2,
    backgroundColor: '#00ffff',
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
  callButton: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#ff00ff',
    border: '2px solid #ff00ff',
    borderRadius: '8px',
    padding: '1rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  mapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  mapTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  gpsStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#00ff41',
    fontSize: '0.8rem',
  },
  gpsIndicator: {
    width: '8px',
    height: '8px',
    backgroundColor: '#00ff41',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  mapContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    // padding: '1rem', // Padding removed to allow map to fill container
    border: '1px solid rgba(0, 255, 65, 0.2)',
    marginBottom: '1rem',
    overflow: 'hidden', // Ensure map corners are rounded
  },
  routeSvg: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  routeDetails: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '1rem',
  },
  routeMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  geofenceText: {
    textAlign: 'center',
    color: '#999',
    fontSize: '0.8rem',
    margin: 0,
  },
  arrivalCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  facilityInfo: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  facilityTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ffff',
    margin: '0 0 0.5rem 0',
  },
  facilityDetails: {
    color: '#e0e0e0',
  },
  arrivalTime: {
    color: '#00ff41',
    fontSize: '0.9rem',
    fontWeight: 500,
    marginTop: '0.5rem',
  },
  checkInPrompt: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  promptIcon: {
    flexShrink: 0,
  },
  promptText: {
    flex: 1,
  },
  promptTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 0.5rem 0',
  },
  promptDesc: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    margin: 0,
    lineHeight: '1.4',
  },
  questionCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '2rem',
    width: '100%',
    textAlign: 'center',
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  questionTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
  },
  questionText: {
    fontSize: '1rem',
    color: '#e0e0e0',
    margin: 0,
    lineHeight: '1.4',
  },
  confirmationCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  confirmationDetails: {
    marginBottom: '1.5rem',
  },
  confirmationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
    color: '#e0e0e0',
  },
  nextStepsInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  nextStepsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 0.75rem 0',
  },
  nextStepsList: {
    margin: 0,
    paddingLeft: '1.5rem',
    color: '#e0e0e0',
  },
  facilityBadge: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    color: '#00ffff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 500,
    marginTop: '0.5rem',
  },
  requirementsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  requirementsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  completionBadge: {
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    color: '#00ff41',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  requirementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  requirementItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    cursor: 'pointer',
    padding: '0.75rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
  requirementContent: {
    flex: 1,
  },
  requirementText: {
    fontSize: '0.95rem',
    lineHeight: '1.4',
    marginBottom: '0.25rem',
    color: LOGO_BLUE,
    fontWeight: 500,
  },
  completedTime: {
    fontSize: '0.7rem',
    color: '#00ff41',
    fontStyle: 'italic',
  },
  additionalInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#e0e0e0',
    marginBottom: '0.5rem',
  },
  complianceCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  complianceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  complianceTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  complianceProgress: {
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    color: '#00ff41',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  complianceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  complianceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
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
  complianceContent: {
    flex: 1,
  },
  complianceText: {
    fontSize: '0.9rem',
    color: LOGO_BLUE,
    lineHeight: '1.4',
    marginBottom: '0.25rem',
    fontWeight: 500,
  },
  complianceDetails: {
    fontSize: '0.7rem',
    color: '#999',
    fontStyle: 'italic',
  },
  statusBadge: {
    backgroundColor: '#00ff41',
    color: '#0d0208',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    alignSelf: 'flex-start',
  },
  additionalChecks: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  additionalTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 0.75rem 0',
  },
  checkGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#e0e0e0',
  },
  departureCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  departureInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#999',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
  },
  loadTime: {
    color: '#00ff41',
  },
  duration: {
    color: '#00ffff',
  },
  preFlightChecks: {
    marginBottom: '1.5rem',
  },
  preFlightTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  checksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  systemCheck: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  checkValue: {
    marginLeft: 'auto',
    fontSize: '0.8rem',
    color: '#00ff41',
    fontWeight: 500,
  },
  cargoSummary: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  summaryTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 0.75rem 0',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#999',
    fontSize: '0.8rem',
  },
  summaryValue: {
    color: '#e0e0e0',
    fontWeight: 500,
    fontSize: '0.8rem',
  },
  transitCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  transitStatus: {
    marginBottom: '1.5rem',
  },
  transitTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  statusIndicators: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  indicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    color: '#e0e0e0',
  },
  indicatorLight: {
    width: '8px',
    height: '8px',
    backgroundColor: '#00ff41',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  transitDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  transitInfo: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '1rem',
  },
  infoBlock: {
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: '0.7rem',
    color: '#999',
    marginBottom: '0.25rem',
  },
  infoValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#e0e0e0',
  },
  cargoConfirmation: {
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: '1rem',
    color: '#e0e0e0',
    margin: '0 0 0.5rem 0',
    lineHeight: '1.4',
  },
  cargoSpecs: {
    fontSize: '0.8rem',
    color: '#999',
    fontStyle: 'italic',
  },
  routePlanCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
  },
  routeStats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1rem',
  },
  routeStat: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.7rem',
    color: '#999',
  },
  optimizationBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    color: '#00ff41',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  routeAnalytics: {
    marginTop: '1rem',
  },
  analyticsSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  analyticsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 0.75rem 0',
  },
  analyticsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  analyticsItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#e0e0e0',
  },
  legendContainer: {
    marginTop: '1rem',
  },
  legendTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 0.75rem 0',
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
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
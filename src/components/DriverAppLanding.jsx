import React, { useState, useEffect } from 'react';
import handImage from '../logos/driver_app_hand_login.png';
import logoImage from '../logos/FreightTrixHeader_Graphic.png';

const DriverAppLanding = ({ onAuthSuccess }) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    // Pulse animation interval
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handlePalmScan = () => {
    setIsScanning(true);
    setShowPulse(false);
    
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setScanComplete(true);
          setTimeout(() => {
            // Navigate to dashboard by calling the callback
            if (onAuthSuccess) {
              onAuthSuccess();
            }
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div style={styles.container}>
      {/* Matrix Background */}
      <div style={styles.matrixBackground}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.matrixColumn,
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {[...Array(10)].map((_, j) => (
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
        <p style={styles.subtitle}>Driver App</p>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.instructionContainer}>
          <p style={styles.instruction}>
            {scanComplete 
              ? "Access Granted" 
              : isScanning 
                ? "Scanning..." 
                : "Place palm to scan"}
          </p>
        </div>

        {/* Palm Scanner */}
        <div 
          style={{
            ...styles.palmContainer,
            transform: `scale(${showPulse && !isScanning ? 1.05 : 1})`,
          }}
          onClick={!isScanning && !scanComplete ? handlePalmScan : undefined}
        >
          {/* Scanning Ring */}
          <div style={{
            ...styles.scanningRing,
            opacity: isScanning ? 1 : 0,
            transform: `rotate(${scanProgress * 3.6}deg)`,
          }}>
            <div style={styles.scanningLine}></div>
          </div>

          {/* Palm Hand Image */}
          <div style={styles.handContainer}>
            <img
              src={handImage}
              alt="Palm Scanner"
              style={{
                ...styles.handImage,
                filter: scanComplete 
                  ? 'drop-shadow(0 0 30px #00ff41) brightness(1.2) saturate(1.3)' 
                  : isScanning 
                    ? `drop-shadow(0 0 20px #00ff41) brightness(${1 + scanProgress * 0.003}) hue-rotate(${scanProgress}deg)`
                    : 'drop-shadow(0 0 15px rgba(0, 255, 65, 0.3)) brightness(1.1)',
                opacity: scanComplete ? 1 : isScanning ? 0.8 + (scanProgress * 0.002) : 0.9,
              }}
            />
            
            {/* Scanning overlay effect */}
            {isScanning && (
              <div style={{
                ...styles.scanOverlay,
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  transparent ${scanProgress - 10}%, 
                  rgba(0, 255, 65, 0.3) ${scanProgress - 5}%, 
                  rgba(0, 255, 65, 0.6) ${scanProgress}%, 
                  rgba(0, 255, 65, 0.3) ${scanProgress + 5}%, 
                  transparent ${scanProgress + 10}%, 
                  transparent 100%)`,
              }}></div>
            )}

            {/* Scanning grid effect */}
            {isScanning && (
              <div style={styles.scanGrid}>
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.gridLine,
                      opacity: Math.sin((scanProgress + i * 15) * 0.05) * 0.4 + 0.2,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}

            {/* Scanning dots effect */}
            {isScanning && [...Array(16)].map((_, i) => {
              const angle = (i / 16) * 2 * Math.PI;
              const radius = 80 + (scanProgress * 0.5);
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#00ff41',
                    borderRadius: '50%',
                    opacity: Math.sin((scanProgress + i * 22.5) * 0.08) * 0.8 + 0.4,
                    boxShadow: '0 0 6px #00ff41',
                    animation: `pulse 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.05}s`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              );
            })}
          </div>

          {/* Progress Bar */}
          {isScanning && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${scanProgress}%`,
                  }}
                ></div>
              </div>
              <span style={styles.progressText}>{Math.round(scanProgress)}%</span>
            </div>
          )}
        </div>

        {/* Status Message */}
        <div style={styles.statusContainer}>
          {scanComplete ? (
            <div style={styles.successMessage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={styles.checkIcon}>
                <circle cx="12" cy="12" r="12" fill="#00ff41"/>
                <path d="m9 12 2 2 4-4" stroke="#0d0208" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Welcome to FreighTrix
            </div>
          ) : (
            <p style={styles.statusText}>
              {isScanning 
                ? "Verifying biometric data..." 
                : "Secure biometric authentication required"}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>Powered by FreighTrix AI</p>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
          
          @keyframes matrixFall {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.3); }
            50% { box-shadow: 0 0 40px rgba(0, 255, 65, 0.6); }
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2rem 1rem',
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
    opacity: 0.1,
    zIndex: 0,
  },
  matrixColumn: {
    position: 'absolute',
    top: 0,
    fontSize: '14px',
    color: '#00ff41',
    animation: 'matrixFall 15s linear infinite',
    display: 'flex',
    flexDirection: 'column',
  },
  matrixChar: {
    display: 'block',
    marginBottom: '10px',
    fontFamily: 'monospace',
  },
  header: {
    zIndex: 1,
    textAlign: 'center',
    marginTop: '2rem',
  },
  logoImage: {
    height: 'clamp(60px, 12vw, 120px)',
    width: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 10px rgba(0, 255, 65, 0.3))',
    marginBottom: '1rem',
  },
  subtitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
    fontWeight: 600,
    margin: '0.5rem 0 0 0',
    background: 'linear-gradient(90deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    opacity: 0.9,
  },
  content: {
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: '2rem',
  },
  instructionContainer: {
    textAlign: 'center',
  },
  instruction: {
    fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
    fontWeight: 500,
    margin: 0,
    color: '#00ff41',
    fontFamily: 'Orbitron, sans-serif',
  },
  palmContainer: {
    position: 'relative',
    width: '280px',
    height: '280px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '50%',
    border: '2px solid rgba(0, 255, 65, 0.3)',
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    backdropFilter: 'blur(10px)',
  },
  scanningRing: {
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    borderRadius: '50%',
    border: '3px solid transparent',
    borderTopColor: '#00ff41',
    transition: 'all 0.3s ease',
    zIndex: 2,
  },
  scanningLine: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '4px',
    height: '30px',
    backgroundColor: '#00ff41',
    transform: 'translate(-50%, -50%)',
    borderRadius: '2px',
    boxShadow: '0 0 10px #00ff41',
  },
  handContainer: {
    position: 'relative',
    zIndex: 1,
  },
  handImage: {
    width: '220px',
    height: '220px',
    objectFit: 'contain',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '10px',
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '10px',
    pointerEvents: 'none',
    zIndex: 2,
  },
  scanGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '1px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  gridLine: {
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    border: '1px solid rgba(0, 255, 65, 0.1)',
    animation: 'pulse 1s ease-in-out infinite',
  },
  progressContainer: {
    position: 'absolute',
    bottom: '-50px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    width: '200px',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff41',
    borderRadius: '2px',
    transition: 'width 0.1s ease',
    boxShadow: '0 0 10px #00ff41',
  },
  progressText: {
    fontSize: '0.9rem',
    color: '#00ff41',
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 600,
  },
  statusContainer: {
    textAlign: 'center',
    minHeight: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
    margin: 0,
    color: '#e0e0e0',
    opacity: 0.7,
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    color: '#00ff41',
    fontWeight: 600,
    fontFamily: 'Orbitron, sans-serif',
  },
  checkIcon: {
    animation: 'pulse 0.5s ease-in-out',
  },
  footer: {
    zIndex: 1,
    textAlign: 'center',
    marginBottom: '1rem',
  },
  footerText: {
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    margin: 0,
    color: '#e0e0e0',
    opacity: 0.5,
    fontFamily: 'Inter, sans-serif',
  },
};

export default DriverAppLanding;
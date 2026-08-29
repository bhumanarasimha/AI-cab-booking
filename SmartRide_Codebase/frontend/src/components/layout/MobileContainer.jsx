import { Outlet } from 'react-router-dom';

const MobileContainer = () => (
  <div style={styles.outerWrapper}>
    <div style={styles.phoneFrame}>
      {/* Subtle compact camera island at top that never overlaps buttons */}
      <div style={styles.cameraIsland}>
        <div style={styles.cameraDot} />
      </div>

      <div style={styles.contentArea}>
        <Outlet />
      </div>
    </div>
  </div>
);

const styles = {
  outerWrapper: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#040608',
    alignItems: 'center',
    justify: 'center',
    overflow: 'hidden',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: '430px',
    height: '100vh',
    maxHeight: '920px',
    backgroundColor: '#080C14',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  cameraIsland: {
    position: 'absolute',
    top: 6,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '8px',
    backgroundColor: '#1A2340',
    borderRadius: '6px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justify: 'center',
    pointerEvents: 'none',
  },
  cameraDot: {
    width: '4px',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#00D8FF',
    opacity: 0.6,
  },
  contentArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
};

export default MobileContainer;

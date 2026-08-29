import { View, StyleSheet, Dimensions } from 'react-native';
import { Outlet } from 'react-router-dom';

const MobileContainer = () => (
  <div style={styles.outerWrapper}>
    <div style={styles.phoneFrame}>
      {/* Notch bar for desktop framing */}
      <div style={styles.notchContainer}>
        <div style={styles.notch} />
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
    justifyContent: 'center',
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
  notchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '24px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  notch: {
    width: '120px',
    height: '18px',
    backgroundColor: '#1A2340',
    borderBottomLeftRadius: '14px',
    borderBottomRightRadius: '14px',
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

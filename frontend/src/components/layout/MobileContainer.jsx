import { View, StyleSheet, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Outlet } from 'react-router-dom';

const { width } = Dimensions.get('window');

const MobileContainer = () => (
  <SafeAreaView style={styles.outerContainer}>
    <View style={[styles.innerContainer, width > 640 && styles.desktopFrame]}>
      {/* Notch bar for desktop preview */}
      {width > 640 && (
        <View style={styles.notchContainer}>
          <View style={styles.notch} />
        </View>
      )}

      <View style={styles.content}>
        <Outlet />
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#040608',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 390,
    height: '100%',
    backgroundColor: '#080C14',
    overflow: 'hidden',
  },
  desktopFrame: {
    borderRadius: 48,
    borderWidth: 10,
    borderColor: '#0A0D16',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  notchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    zIndex: 999,
    alignItems: 'center',
    paddingTop: 8,
  },
  notch: {
    width: 120,
    height: 20,
    backgroundColor: '#0A0D16',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default MobileContainer;

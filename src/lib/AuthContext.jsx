import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  getAdditionalUserInfo,
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).then(async (result) => {
      if (result) {
        const { user: firebaseUser } = result;
        const additionalUserInfo = getAdditionalUserInfo(result);
        
        if (additionalUserInfo?.isNewUser) {
          // Initialize user in Firestore if they are new
          const userRef = doc(db, 'users', firebaseUser.uid);
          setDoc(userRef, {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            createdAt: new Date().toISOString(),
            preferences: { theme: 'dark-ai', language: 'en' }
          }).catch(err => console.error("New user doc creation failed:", err));
        }
      }
    }).catch((error) => {
      console.error("Redirect login error:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Set basic user info immediately
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        });

        // Fetch extra data in background
        const fetchExtraData = async () => {
          try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setUser(prev => ({ ...prev, ...userSnap.data() }));
            }
          } catch (error) {
            console.error("Background Firestore error:", error);
          }
        };
        fetchExtraData();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Force loading to false after 2 seconds to prevent blank page if Firebase hangs
    const forceLoad = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(forceLoad);
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    console.log("Starting Google login (trying popup first)...");
    try {
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        console.warn("Popup blocked, falling back to redirect...");
        return await signInWithRedirect(auth, provider);
      }
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        return await signInWithRedirect(auth, provider);
      }
      console.error("Facebook login failed:", error);
      throw error;
    }
  };

  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        return await signInWithRedirect(auth, provider);
      }
      console.error("Apple login failed:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email login failed:", error);
      throw error;
    }
  };

  const registerWithEmail = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      
      // Manually trigger doc creation if it's a new registration
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        name,
        email,
        createdAt: new Date().toISOString(),
        preferences: { theme: 'dark-ai', language: 'en' }
      });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  const setupRecaptcha = (containerId) => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
        }
      });
    } catch (error) {
      console.error("Recaptcha setup failed:", error);
    }
  };

  const sendOtp = async (phoneNumber) => {
    try {
      setupRecaptcha('recaptcha-container');
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      return result;
    } catch (error) {
      console.error("SMS Sending failed:", error);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      throw error;
    }
  };

  const confirmOtp = async (otpCode) => {
    if (!confirmationResult) throw new Error("No pending OTP request.");
    try {
      const result = await confirmationResult.confirm(otpCode);
      return result.user;
    } catch (error) {
      console.error("OTP Verification failed:", error);
      throw error;
    }
  };

  const updateUserProfile = async (newData) => {
    if (!auth.currentUser) return;
    
    try {
      // 1. Update Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, newData, { merge: true });

      // 2. Update Firebase Auth Profile if name changed
      if (newData.name) {
        await updateProfile(auth.currentUser, { displayName: newData.name });
      }

      // 3. Update local state
      setUser(prev => ({ ...prev, ...newData }));
    } catch (error) {
      console.error("Update profile failed:", error);
      throw error;
    }
  };


  return (
    <AuthContext.Provider value={{ 
      user, loading, 
      loginWithGoogle, loginWithFacebook, loginWithApple, 
      loginWithEmail, registerWithEmail, 
      logout, updateUserProfile,
      sendOtp, confirmOtp,
      currentLocation, setCurrentLocation
    }}>
      {!loading && children}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

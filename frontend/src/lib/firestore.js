import { db } from './firebase';
import {
  collection, addDoc, serverTimestamp, updateDoc, doc, onSnapshot,
  query, where, orderBy, getDocs, arrayUnion
} from 'firebase/firestore';

// RIDES
export const createRideRequest = async (userId, rideData) => {
  try {
    const docRef = await addDoc(collection(db, 'rides'), {
      userId,
      ...rideData,
      status: 'searching',
      aiInsights: {
        latency: Math.floor(Math.random() * 20) + 10,
        confidence: 0.95 + (Math.random() * 0.04),
        agents: 14,
        hewro: { walkingReduced: 240, effortSaved: 34 },
        stability: { road: 92, vehicle: 98, route: 87 }
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating ride:", error);
    throw error;
  }
};

// USER PROFILE & PREFERENCES
export const updateUserPreferences = async (userId, preferences) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    preferences,
    updatedAt: serverTimestamp()
  });
};

export const updateSavedPlaces = async (userId, savedPlaces) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    savedPlaces,
    updatedAt: serverTimestamp()
  });
};

export const updateEmergencyContacts = async (userId, emergencyContacts) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    emergencyContacts,
    updatedAt: serverTimestamp()
  });
};

export const updateCommuteProfile = async (userId, commuteProfile) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    commuteProfile,
    updatedAt: serverTimestamp()
  });
};

export const getUserRides = async (userId) => {
  try {
    const q = query(
      collection(db, 'rides'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching rides:", error);
    throw error;
  }
};

export const updateRideStatus = async (rideId, status) => {
  const rideRef = doc(db, 'rides', rideId);
  await updateDoc(rideRef, {
    status,
    updatedAt: serverTimestamp()
  });
};

// PARCELS
export const createParcelOrder = async (userId, parcelData) => {
  try {
    const docRef = await addDoc(collection(db, 'parcels'), {
      userId,
      ...parcelData,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating parcel:", error);
    throw error;
  }
};

// REAL-TIME UPDATES
export const subscribeToRide = (rideId, callback) => {
  return onSnapshot(doc(db, 'rides', rideId), (doc) => {
    callback({ id: doc.id, ...doc.data() });
  });
};

// CHATS
export const createChatSession = async (userId, targetUserId) => {
  try {
    const docRef = await addDoc(collection(db, 'chats'), {
      participants: [userId, targetUserId],
      lastMessage: "Interested in sharing tomorrow's commute?",
      updatedAt: serverTimestamp(),
      messages: [
        { text: "Hey! Saw we have a 94% route overlap. Interested in sharing tomorrow's commute?", senderId: targetUserId, timestamp: new Date() }
      ]
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw error;
  }
};

export const subscribeToChat = (chatId, callback) => {
  return onSnapshot(doc(db, 'chats', chatId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

export const sendChatMessage = async (chatId, senderId, text) => {
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    messages: arrayUnion({
      text,
      senderId,
      timestamp: new Date()
    }),
    lastMessage: text,
    updatedAt: serverTimestamp()
  });
};

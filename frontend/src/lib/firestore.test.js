import { vi, describe, test, expect, beforeEach } from 'vitest';

// 1. Mock the relative config import so it doesn't fail on missing env variables or build issues
vi.mock('./firebase', () => ({
  db: { type: 'mocked-db-instance' }
}));

// 2. Setup mock spies using vi.hoisted so they are defined before vi.mock hoisting
const { 
  mockAddDoc, 
  mockUpdateDoc, 
  mockGetDocs, 
  mockDoc, 
  mockCollection, 
  mockOnSnapshot, 
  mockServerTimestamp, 
  mockArrayUnion 
} = vi.hoisted(() => ({
  mockAddDoc: vi.fn(),
  mockUpdateDoc: vi.fn(),
  mockGetDocs: vi.fn(),
  mockDoc: vi.fn((db, colName, id) => ({ path: `${colName}/${id}`, id })),
  mockCollection: vi.fn((db, colName) => ({ colName })),
  mockOnSnapshot: vi.fn(),
  mockServerTimestamp: vi.fn(() => 'mocked-server-timestamp'),
  mockArrayUnion: vi.fn((val) => ({ unionValue: val }))
}));

vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  doc: mockDoc,
  getDocs: mockGetDocs,
  onSnapshot: mockOnSnapshot,
  serverTimestamp: mockServerTimestamp,
  arrayUnion: mockArrayUnion,
  query: vi.fn((...args) => ({ type: 'query', args })),
  where: vi.fn((field, op, val) => ({ type: 'where', field, op, val })),
  orderBy: vi.fn((field, direction) => ({ type: 'orderBy', field, direction }))
}));

// Import helper functions under test
import {
  createRideRequest,
  updateUserPreferences,
  updateSavedPlaces,
  updateEmergencyContacts,
  updateCommuteProfile,
  getUserRides,
  updateRideStatus,
  createParcelOrder,
  subscribeToRide,
  createChatSession,
  subscribeToChat,
  sendChatMessage
} from './firestore';

describe('Firestore database operations helper tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Ride request tests
  test('createRideRequest should correctly format and write ride data to database', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'ride_abc123' });

    const userId = 'user_99';
    const rideData = { from: 'Origin Point', to: 'Destination Point', fare: 450 };
    const result = await createRideRequest(userId, rideData);

    expect(result).toBe('ride_abc123');
    expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'rides');
    expect(mockAddDoc).toHaveBeenCalledTimes(1);

    const callPayload = mockAddDoc.mock.calls[0][1];
    expect(callPayload.userId).toBe(userId);
    expect(callPayload.from).toBe('Origin Point');
    expect(callPayload.status).toBe('searching');
    expect(callPayload.aiInsights).toBeDefined();
    expect(callPayload.createdAt).toBe('mocked-server-timestamp');
  });

  test('createRideRequest should throw an error if db call fails', async () => {
    mockAddDoc.mockRejectedValueOnce(new Error('Firebase network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(createRideRequest('user_99', {}))
      .rejects.toThrow('Firebase network error');
    consoleSpy.mockRestore();
  });

  // User preference update tests
  test('updateUserPreferences should update preferences inside user document', async () => {
    const preferences = { dark_mode: true, language: 'Hindi' };
    await updateUserPreferences('user_99', preferences);

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'users', 'user_99');
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    
    const updatePayload = mockUpdateDoc.mock.calls[0][1];
    expect(updatePayload.preferences).toEqual(preferences);
    expect(updatePayload.updatedAt).toBe('mocked-server-timestamp');
  });

  // Saved places update tests
  test('updateSavedPlaces should write list of saved places to user doc', async () => {
    const savedPlaces = [{ name: 'Home', address: '123 St' }];
    await updateSavedPlaces('user_99', savedPlaces);

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'users', 'user_99');
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);

    const updatePayload = mockUpdateDoc.mock.calls[0][1];
    expect(updatePayload.savedPlaces).toEqual(savedPlaces);
  });

  // Emergency contact tests
  test('updateEmergencyContacts should write contacts to user doc', async () => {
    const emergencyContacts = [{ name: 'Police', phone: '100' }];
    await updateEmergencyContacts('user_99', emergencyContacts);

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'users', 'user_99');
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);

    const updatePayload = mockUpdateDoc.mock.calls[0][1];
    expect(updatePayload.emergencyContacts).toEqual(emergencyContacts);
  });

  // Commute profile tests
  test('updateCommuteProfile should save commute settings to user doc', async () => {
    const commuteProfile = { vehicleNum: 'KA01AB1234', hasVerifiedLicense: true };
    await updateCommuteProfile('user_99', commuteProfile);

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'users', 'user_99');
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);

    const updatePayload = mockUpdateDoc.mock.calls[0][1];
    expect(updatePayload.commuteProfile).toEqual(commuteProfile);
  });

  // Get user rides tests
  test('getUserRides should build query and retrieve documents', async () => {
    const mockRidesDocs = [
      { id: '1', data: () => ({ rideName: 'Ride A' }) },
      { id: '2', data: () => ({ rideName: 'Ride B' }) }
    ];
    mockGetDocs.mockResolvedValueOnce({ docs: mockRidesDocs });

    const rides = await getUserRides('user_99');

    expect(rides).toHaveLength(2);
    expect(rides[0]).toEqual({ id: '1', rideName: 'Ride A' });
    expect(rides[1]).toEqual({ id: '2', rideName: 'Ride B' });
    expect(mockGetDocs).toHaveBeenCalledTimes(1);
  });

  test('getUserRides should propagate database failures', async () => {
    mockGetDocs.mockRejectedValueOnce(new Error('Permission denied'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(getUserRides('user_99')).rejects.toThrow('Permission denied');
    consoleSpy.mockRestore();
  });

  // Update ride status
  test('updateRideStatus should modify ride state', async () => {
    await updateRideStatus('ride_11', 'completed');
    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'rides', 'ride_11');
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    
    const updatePayload = mockUpdateDoc.mock.calls[0][1];
    expect(updatePayload.status).toBe('completed');
  });

  // Parcel delivery orders
  test('createParcelOrder should compile parcel specs and save', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'parcel_55' });

    const parcelData = { weight: '5kg', description: 'Fragile vase' };
    const id = await createParcelOrder('user_99', parcelData);

    expect(id).toBe('parcel_55');
    expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'parcels');
    expect(mockAddDoc).toHaveBeenCalledTimes(1);

    const payload = mockAddDoc.mock.calls[0][1];
    expect(payload.userId).toBe('user_99');
    expect(payload.status).toBe('pending');
    expect(payload.createdAt).toBe('mocked-server-timestamp');
  });

  test('createParcelOrder handles db exceptions correctly', async () => {
    mockAddDoc.mockRejectedValueOnce(new Error('Database full'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(createParcelOrder('user_99', {})).rejects.toThrow('Database full');
    consoleSpy.mockRestore();
  });

  // Real-time listener checks
  test('subscribeToRide should trigger listener binding', () => {
    const callback = vi.fn();
    subscribeToRide('ride_101', callback);

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'rides', 'ride_101');
    expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
  });

  // Chat Sessions creation
  test('createChatSession should initialize connection document with target user', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'chat_session_88' });

    const chatId = await createChatSession('user_a', 'user_b');

    expect(chatId).toBe('chat_session_88');
    expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'chats');
    
    const payload = mockAddDoc.mock.calls[0][1];
    expect(payload.participants).toEqual(['user_a', 'user_b']);
    expect(payload.messages).toHaveLength(1);
    expect(payload.messages[0].senderId).toBe('user_b');
  });

  // Chat subscription
  test('subscribeToChat should bind state callback', () => {
    const callback = vi.fn();
    subscribeToChat('chat_88', callback);

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'chats', 'chat_88');
    expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
  });

  // Send message
  test('sendChatMessage should update array union list with message metadata', async () => {
    await sendChatMessage('chat_88', 'user_a', 'Hello there!');

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'chats', 'chat_88');
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);

    const payload = mockUpdateDoc.mock.calls[0][1];
    expect(payload.lastMessage).toBe('Hello there!');
    expect(payload.messages).toBeDefined();
    expect(mockArrayUnion).toHaveBeenCalledTimes(1);
  });
});

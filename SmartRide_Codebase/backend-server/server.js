require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const Ride = require('./models/Ride');
const Parcel = require('./models/Parcel');
const Chat = require('./models/Chat');
const authMiddleware = require('./middleware/auth');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'smartride_jwt_secret_key';

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Setup demo user on database connect
const setupDemoUser = async () => {
  try {
    const demoEmail = 'demo@smartride.com';
    let user = await User.findOne({ email: demoEmail });
    if (!user) {
      user = new User({
        email: demoEmail,
        password: 'demo', // Will be hashed by pre-save hook
        preferences: { theme: 'dark', language: 'en' },
        savedPlaces: [
          { name: 'Home', address: '123 Tech Park, Phase 1' },
          { name: 'Office', address: '456 Innovations Way, Block B' }
        ],
        emergencyContacts: [
          { name: 'Safety Dispatch', phone: '+1-800-555-0199' }
        ]
      });
      await user.save();
      console.log('Demo user demo@smartride.com created successfully');
    }
  } catch (err) {
    console.error('Error setting up demo user:', err.message);
  }
};

setTimeout(setupDemoUser, 3000); // Wait for DB connection

// Helper to sign JWT
const signToken = (userId) => {
  const payload = {
    user: {
      id: userId
    }
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// --- AUTHENTICATION ROUTES ---

// Register User
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (password && password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ email, password, name });
    await user.save();

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = signToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
        savedPlaces: user.savedPlaces,
        emergencyContacts: user.emergencyContacts,
        commuteProfile: user.commuteProfile
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Social Login (Simulated / Mocked)
app.post('/api/auth/social-login', async (req, res) => {
  const { email, name, provider, photoURL } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name: name || `Demo ${provider} User`,
        password: Math.random().toString(36).substring(7), // Random password
        preferences: { theme: 'dark-ai', language: 'en' }
      });
      await user.save();
    }
    const token = signToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        photoURL,
        preferences: user.preferences,
        savedPlaces: user.savedPlaces,
        emergencyContacts: user.emergencyContacts,
        commuteProfile: user.commuteProfile
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Current User (authenticated)
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Generic Profile Update
app.put('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const fieldsToUpdate = ['name', 'preferences', 'savedPlaces', 'emergencyContacts', 'commuteProfile'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    user.updatedAt = Date.now();
    await user.save();
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      preferences: user.preferences,
      savedPlaces: user.savedPlaces,
      emergencyContacts: user.emergencyContacts,
      commuteProfile: user.commuteProfile
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- USER PROFILE & SETTINGS ROUTES ---

// Update Preferences
app.put('/api/users/preferences', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.preferences = req.body.preferences;
    user.updatedAt = Date.now();
    await user.save();
    res.json(user.preferences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Saved Places
app.put('/api/users/saved-places', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedPlaces = req.body.savedPlaces;
    user.updatedAt = Date.now();
    await user.save();
    res.json(user.savedPlaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Emergency Contacts
app.put('/api/users/emergency-contacts', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.emergencyContacts = req.body.emergencyContacts;
    user.updatedAt = Date.now();
    await user.save();
    res.json(user.emergencyContacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Commute Profile
app.put('/api/users/commute-profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.commuteProfile = req.body.commuteProfile;
    user.updatedAt = Date.now();
    await user.save();
    res.json(user.commuteProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- RIDES ROUTES ---

// Create Ride Request
app.post('/api/rides', authMiddleware, async (req, res) => {
  try {
    const newRide = new Ride({
      userId: req.user.id,
      pickup: req.body.pickup,
      dropoff: req.body.dropoff,
      pickupCoords: req.body.pickupCoords,
      dropoffCoords: req.body.dropoffCoords,
      vehicleType: req.body.vehicleType,
      price: req.body.price,
      duration: req.body.duration,
      distance: req.body.distance,
      aiInsights: req.body.aiInsights || {
        latency: Math.floor(Math.random() * 20) + 10,
        confidence: 0.95 + (Math.random() * 0.04),
        agents: 14,
        hewro: { walkingReduced: 240, effortSaved: 34 },
        stability: { road: 92, vehicle: 98, route: 87 }
      }
    });

    const ride = await newRide.save();
    
    // Broadcast creation to listeners (for live logs/monitoring)
    io.emit('rideCreated', ride);
    
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get User's Rides
app.get('/api/rides', authMiddleware, async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Specific Ride
app.get('/api/rides/:id', authMiddleware, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Ride Status
app.put('/api/rides/:id/status', authMiddleware, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });

    ride.status = req.body.status;
    ride.updatedAt = Date.now();
    await ride.save();

    // Broadcast status change to clients listening to this ride
    io.to(`ride_${ride.id}`).emit('rideStatusUpdate', ride);
    // Also emit global update
    io.emit('rideUpdated', ride);

    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- PARCEL ROUTES ---

// Create Parcel Order
app.post('/api/parcels', authMiddleware, async (req, res) => {
  try {
    const newParcel = new Parcel({
      userId: req.user.id,
      ...req.body
    });
    const parcel = await newParcel.save();
    res.json(parcel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get User's Parcels
app.get('/api/parcels', authMiddleware, async (req, res) => {
  try {
    const parcels = await Parcel.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(parcels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- CHATS ROUTES ---

// Create Chat Session
app.post('/api/chats', authMiddleware, async (req, res) => {
  const { targetUserId } = req.body;
  try {
    // Find or create chat with participants
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, targetUserId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.user.id, targetUserId],
        lastMessage: "Interested in sharing tomorrow's commute?",
        messages: [
          { text: "Hey! Saw we have a 94% route overlap. Interested in sharing tomorrow's commute?", senderId: targetUserId, timestamp: new Date() }
        ]
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get User's Chats
app.get('/api/chats', authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Specific Chat Room
app.get('/api/chats/:id', authMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ msg: 'Chat session not found' });
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Send Message inside Chat Session
app.post('/api/chats/:id/messages', authMiddleware, async (req, res) => {
  const { text } = req.body;
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ msg: 'Chat not found' });

    const message = {
      text,
      senderId: req.user.id,
      timestamp: new Date()
    };

    chat.messages.push(message);
    chat.lastMessage = text;
    chat.updatedAt = Date.now();
    await chat.save();

    // Broadcast new message to room
    io.to(`chat_${chat.id}`).emit('chatMessageUpdate', chat);

    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- TELEMETRY / PERFORMANCE BENCHMARKING ENDPOINT ---
app.post('/api/performance-logs', async (req, res) => {
  try {
    // Return success to simulate logging speed
    res.json({ success: true, timestamp: Date.now() });
  } catch (err) {
    res.status(500).send('Telemetry error');
  }
});

// --- SOCKET.IO CONNECTIONS ---
io.on('connection', (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  // Client joins a ride status subscription room
  socket.on('subscribeRide', (rideId) => {
    socket.join(`ride_${rideId}`);
    console.log(`Socket ${socket.id} joined room: ride_${rideId}`);
  });

  // Client joins a chat session room
  socket.on('subscribeChat', (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`Socket ${socket.id} joined room: chat_${chatId}`);
  });

  // Client leaves rooms on disconnect
  socket.on('disconnect', () => {
    console.log(`Socket Disconnected: ${socket.id}`);
  });
});

// Server Listen
server.listen(PORT, () => {
  console.log(`SmartRide Express server running on port ${PORT}`);
});

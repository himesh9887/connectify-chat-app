require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Online users tracking
const onlineUsers = new Map(); // userId -> socketId

// Create demo user if not exists
const initDemoUser = async () => {
  const demoEmail = 'test@test.com';
  const existing = await User.findOne({ email: demoEmail });
  if (!existing) {
    const hashedPassword = await bcrypt.hash('password', 10);
    await User.create({
      name: 'Demo User',
      email: demoEmail,
      password: hashedPassword
    });
    console.log('Demo user created: test@test.com / password');
  }
};

initDemoUser();

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Socket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', async (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    
    // Update user online status
    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
    
    // Broadcast online users
    io.emit('online_users', Array.from(onlineUsers.keys()));
    
    console.log(`User ${userId} joined`);
  });

  socket.on('send_message', async (message) => {
    // Save to DB
    const newMessage = await Message.create({
      from: message.from,
      to: message.to,
      text: message.text
    });
    
    const populatedMsg = await Message.findById(newMessage._id)
      .populate('from', 'name avatar')
      .populate('to', 'name')
      .lean();

    // Send to recipient if online
    const recipientSocket = onlineUsers.get(message.to);
    if (recipientSocket) {
      io.to(recipientSocket).emit('receive_message', populatedMsg);
    }
    
    // Send back to sender
    socket.emit('receive_message', populatedMsg);
  });

  socket.on('typing', (data) => {
    socket.to(data.to).emit('typing', { from: data.from, typing: data.typing });
  });

  socket.on('disconnect', async (userId) => {
    const userIdToRemove = Array.from(onlineUsers.entries())
      .find(([id, sockId]) => sockId === socket.id)?.[0];
    
    if (userIdToRemove) {
      onlineUsers.delete(userIdToRemove);
      await User.findByIdAndUpdate(userIdToRemove, { isOnline: false });
      io.emit('online_users', Array.from(onlineUsers.keys()));
      console.log(`User ${userIdToRemove} disconnected`);
    }
  });
});

// API Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });
    
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    res.status(201).json({ 
      user: { id: newUser._id, name: newUser.name, email: newUser.email, avatar: newUser.avatar },
      token 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res.json({ 
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        token 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users', authMiddleware, async (req, res) => {
  const users = await User.find({
    _id: { $ne: req.userId },
    $or: [{ isOnline: true }, { lastSeen: { $gte: new Date(Date.now() - 24*60*60*1000) } }]
  }).select('name email avatar isOnline lastSeen').lean();
  
  res.json(users);
});

app.get('/api/users/online', authMiddleware, async (req, res) => {
  res.json(Array.from(onlineUsers.keys()));
});

app.get('/api/messages/:userId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.userId, to: req.params.userId },
        { from: req.params.userId, to: req.userId }
      ]
    })
    .populate('from', 'name avatar')
    .populate('to', 'name')
    .sort({ timestamp: 1 })
    .limit(50)
    .lean();
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Connectify Server running on port ${PORT}`);
  console.log(`Demo login: test@test.com / password`);
});


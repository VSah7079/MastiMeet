import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { Server } from 'socket.io';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';

// Load .env file explicitly
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('✓ Environment variables loaded');
console.log('  Email User:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
console.log('  Email Pass:', process.env.EMAIL_PASSWORD ? `✓ Set (${process.env.EMAIL_PASSWORD.length} chars)` : '✗ Missing');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  next();
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Limit request body size
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'mastimeet-backend' });
});

app.use('/api/auth', authRoutes);

// In-memory tracking for queue, rooms, and messages
const waitingQueue = [];
const userRooms = new Map(); // socket.id -> roomId
const roomMessages = new Map(); // roomId -> [messages]
const MATCH_TIMEOUT = 10000; // 10 seconds before random match

const pickMatch = (socket, interests = []) => {
  if (waitingQueue.length === 0) return null;

  // Try to find someone with shared interests
  let matchIndex = -1;
  if (interests.length) {
    matchIndex = waitingQueue.findIndex((item) =>
      item.socketId !== socket.id &&
      item.interests?.some((i) => interests.includes(i))
    );
  }

  // If no interest match found, pick random from queue
  if (matchIndex === -1) {
    matchIndex = Math.floor(Math.random() * waitingQueue.length);
  }

  return waitingQueue.splice(matchIndex, 1)[0];
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Queue Management
  socket.on('queue:join', ({ interests = [] } = {}) => {
    console.log(`${socket.id} joining queue with interests:`, interests);
    const match = pickMatch(socket, interests);

    if (match) {
      const roomId = `room_${socket.id}_${match.socketId}`;
      socket.join(roomId);
      match.socket.join(roomId);

      // Track room mapping
      userRooms.set(socket.id, roomId);
      userRooms.set(match.socketId, roomId);

      // Initialize room message storage
      roomMessages.set(roomId, []);

      console.log(`Match found! Room: ${roomId}`);
      socket.emit('match:found', { roomId, partnerId: match.socketId, partnerInterests: match.interests });
      match.socket.emit('match:found', { roomId, partnerId: socket.id, partnerInterests: interests });
    } else {
      waitingQueue.push({ socket, socketId: socket.id, interests });
      console.log(`${socket.id} waiting in queue. Queue size: ${waitingQueue.length}`);
      socket.emit('queue:waiting');
    }
  });

  socket.on('queue:leave', () => {
    const index = waitingQueue.findIndex((item) => item.socketId === socket.id);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
      console.log(`${socket.id} left queue`);
    }
  });

  // WebRTC signaling passthrough
  socket.on('signal:offer', ({ roomId, offer }) => {
    console.log(`Offer from ${socket.id} in ${roomId}`);
    socket.to(roomId).emit('signal:offer', { offer, roomId });
  });

  socket.on('signal:answer', ({ roomId, answer }) => {
    console.log(`Answer from ${socket.id} in ${roomId}`);
    socket.to(roomId).emit('signal:answer', { answer, roomId });
  });

  socket.on('signal:ice', ({ roomId, candidate }) => {
    if (candidate) {
      socket.to(roomId).emit('signal:ice', { candidate, roomId });
    }
  });

  // Text Chat - Real messaging
  socket.on('chat:message', ({ roomId, message, sender, timestamp }) => {
    console.log(`Message from ${sender} in ${roomId}: ${message}`);
    
    // Store message
    if (roomMessages.has(roomId)) {
      roomMessages.get(roomId).push({
        sender,
        text: message,
        timestamp: new Date(timestamp).toISOString()
      });
    }
    
    // Send to partner
    socket.to(roomId).emit('chat:message', {
      message,
      sender,
      timestamp
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove from queue if waiting
    const queueIndex = waitingQueue.findIndex((item) => item.socketId === socket.id);
    if (queueIndex !== -1) {
      waitingQueue.splice(queueIndex, 1);
    }

    // Notify partner if in a room
    const roomId = userRooms.get(socket.id);
    if (roomId) {
      io.to(roomId).emit('partner:disconnected', { reason: 'Partner left the chat' });
      userRooms.delete(socket.id);
      
      // Clean up the other user's room mapping
      const allSockets = io.sockets.sockets;
      for (let [sid, s] of allSockets) {
        if (userRooms.get(sid) === roomId) {
          userRooms.delete(sid);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

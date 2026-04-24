import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { Server } from 'socket.io';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

// Load .env file explicitly
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('✓ Environment variables loaded');
console.log('  Email User:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
console.log('  Email Pass:', process.env.EMAIL_PASSWORD ? `✓ Set (${process.env.EMAIL_PASSWORD.length} chars)` : '✗ Missing');

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOriginHandler = (origin, callback) => {
  // Allow non-browser requests (no Origin header) and configured origins.
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }
  callback(new Error(`Origin ${origin} not allowed by CORS`));
};

const io = new Server(server, {
  cors: {
    origin: corsOriginHandler,
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
  origin: corsOriginHandler,
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
app.use('/api/admin', adminRoutes);

// In-memory tracking for queue, rooms, and messages
const waitingQueue = [];
const userRooms = new Map(); // socket.id -> roomId
const roomMessages = new Map(); // roomId -> [messages]

const normalizeInterests = (interests = []) =>
  interests
    .filter((interest) => typeof interest === 'string')
    .map((interest) => interest.trim().toLowerCase())
    .filter(Boolean);

const hasCommonInterest = (first = [], second = []) => {
  if (!first.length || !second.length) return false;
  const secondSet = new Set(second);
  return first.some((interest) => secondSet.has(interest));
};


const pickMatch = (socket, interests = []) => {
  if (waitingQueue.length === 0) return null;

  // Strict match: only connect users with at least one shared interest.
  const matchIndex = waitingQueue.findIndex((item) =>
    item.socketId !== socket.id && hasCommonInterest(interests, item.interests)
  );

  if (matchIndex === -1) {
    return null;
  }

  return waitingQueue.splice(matchIndex, 1)[0];
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Queue Management
  socket.on('queue:join', ({ interests = [] } = {}) => {
    const normalizedInterests = normalizeInterests(interests);
    console.log(`${socket.id} joining queue with interests:`, normalizedInterests);

    // Prevent duplicate queue entries for same socket.
    const existingIndex = waitingQueue.findIndex((item) => item.socketId === socket.id);
    if (existingIndex !== -1) {
      waitingQueue.splice(existingIndex, 1);
    }

    const match = pickMatch(socket, normalizedInterests);

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
      match.socket.emit('match:found', { roomId, partnerId: socket.id, partnerInterests: normalizedInterests });
    } else {
      waitingQueue.push({ socket, socketId: socket.id, interests: normalizedInterests });
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

  // Rejoin an existing matched room after route change/new socket connection.
  socket.on('room:join-existing', ({ roomId } = {}) => {
    if (!roomId) {
      socket.emit('room:error', { message: 'roomId is required' });
      return;
    }

    socket.join(roomId);
    userRooms.set(socket.id, roomId);

    if (!roomMessages.has(roomId)) {
      roomMessages.set(roomId, []);
    }

    const participants = io.sockets.adapter.rooms.get(roomId);
    const participantIds = participants ? Array.from(participants) : [];

    socket.emit('room:joined', {
      roomId,
      participantCount: participantIds.length,
      participantIds
    });

    // If both users have joined from chat route, start handshake immediately.
    if (participantIds.length >= 2) {
      io.to(roomId).emit('room:ready', { roomId, participantIds });
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
      userRooms.delete(socket.id);

      // Grace period avoids false disconnect events during route transitions.
      setTimeout(() => {
        const participants = io.sockets.adapter.rooms.get(roomId);
        const participantCount = participants ? participants.size : 0;

        // Notify only when exactly one peer is left in the room.
        // If 2 peers are present, both users have likely rejoined after route transition.
        if (participantCount === 1) {
          io.to(roomId).emit('partner:disconnected', { reason: 'Partner left the chat' });
        }
      }, 1500);
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

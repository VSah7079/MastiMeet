import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'mastimeet-backend' });
});

app.use('/api/auth', authRoutes);

// Simple in-memory queue for matching
const waitingQueue = [];

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

  // Fallback to first in queue
  if (matchIndex === -1) matchIndex = 0;

  return waitingQueue.splice(matchIndex, 1)[0];
};

io.on('connection', (socket) => {
  socket.on('queue:join', ({ interests = [] } = {}) => {
    const match = pickMatch(socket, interests);

    if (match) {
      const roomId = `room_${socket.id}_${match.socketId}`;
      socket.join(roomId);
      match.socket.join(roomId);

      socket.emit('match:found', { roomId, peerId: match.socketId });
      match.socket.emit('match:found', { roomId, peerId: socket.id });
    } else {
      waitingQueue.push({ socket, socketId: socket.id, interests });
      socket.emit('queue:waiting');
    }
  });

  socket.on('queue:leave', () => {
    const index = waitingQueue.findIndex((item) => item.socketId === socket.id);
    if (index !== -1) waitingQueue.splice(index, 1);
  });

  // WebRTC signaling passthrough
  socket.on('signal:offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('signal:offer', { offer, from: socket.id });
  });

  socket.on('signal:answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('signal:answer', { answer, from: socket.id });
  });

  socket.on('signal:ice', ({ roomId, candidate }) => {
    socket.to(roomId).emit('signal:ice', { candidate, from: socket.id });
  });

  socket.on('disconnect', () => {
    const index = waitingQueue.findIndex((item) => item.socketId === socket.id);
    if (index !== -1) waitingQueue.splice(index, 1);
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

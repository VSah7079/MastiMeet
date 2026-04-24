# MastiMeet - WebRTC Real-Time Video/Audio Implementation Guide

## Architecture Overview

### How Real-Time Connection Works

```
┌─────────────────────────────────────────────────┐
│         MastiMeet Real-Time Architecture        │
└─────────────────────────────────────────────────┘

1. USER A                          2. USER B
   ├─ Joins Queue                    ├─ Joins Queue
   └─ Sets Interests                 └─ Sets Interests
         ↓                                  ↓
   ┌───────────────────────────────────────────┐
   │    Backend Socket.io Signaling Server    │
   │  (Matching + WebRTC Signal Relay)        │
   └───────────────────────────────────────────┘
         ↓                                  ↓
   Match Found → Room Created → Match Found
         ↓                                  ↓
   Create Offer                  Create Answer
   (Send via Socket.io) ←→ (Send via Socket.io)
         ↓                                  ↓
   ICE Candidates Exchange (NAT/Firewall Traversal)
         ↓                                  ↓
   ┌────────────────────────────────────────────┐
   │  P2P WebRTC Connection Established       │
   │  (Direct Audio/Video Stream)             │
   └────────────────────────────────────────────┘
```

## Key Components

### 1. Frontend (React + WebRTC)
**File:** `mastimeet/src/pages/app/VideoChat.jsx`

**Core Elements:**
- `localVideoRef` → User's own camera feed
- `remoteVideoRef` → Partner's video feed
- `peerConnectionRef` → WebRTC peer connection
- `socketRef` → Socket.io for signaling
- `mediaStreamRef` → Audio/Video stream

**Flow:**
1. User allows camera/microphone permission
2. Joins matching queue (with interests)
3. Server finds matching user → creates room
4. WebRTC handshake (Offer → Answer → ICE Candidates)
5. P2P connection established
6. Direct audio/video stream flows between users

### 2. Backend (Node.js + Socket.io)
**File:** `backend/index.js`

**Key Events:**
- `queue:join` → Add user to matching queue
- `match:found` → Send match details
- `signal:offer` → Relay WebRTC offer
- `signal:answer` → Relay WebRTC answer
- `signal:ice` → Relay ICE candidates
- `partner:disconnected` → Handle disconnection

### 3. WebRTC Connection Process

#### Step 1: Initiator Creates Offer
```javascript
const peerConn = new RTCPeerConnection(config);
peerConn.addTrack(audioTrack, mediaStream);
peerConn.addTrack(videoTrack, mediaStream);
const offer = await peerConn.createOffer();
socket.emit('signal:offer', { offer, roomId });
```

#### Step 2: Receiver Sends Answer
```javascript
const answer = await peerConn.createAnswer();
socket.emit('signal:answer', { answer, roomId });
```

#### Step 3: ICE Candidates Exchange
```javascript
peerConn.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('signal:ice', { candidate: event.candidate });
  }
};
```

#### Step 4: Establish Stream
```javascript
peerConn.ontrack = (event) => {
  remoteVideoRef.current.srcObject = event.streams[0];
};
```

## Current Implementation Status

✅ **Working:**
- Queue management with interest-based matching
- WebRTC peer connection setup
- Camera/microphone permissions
- Offer/Answer/ICE signaling
- Video stream handling
- Socket.io connection

⚠️ **Check:**
- Network connectivity (ensure backend is running on correct port)
- STUN servers (Google STUN is free, or configure TURN for better NAT traversal)

## Setup & Testing

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
# Server should run on http://localhost:5000
```

### 2. Start Frontend
```bash
cd mastimeet
npm install
npm run dev
# Frontend should run on http://localhost:5173
```

### 3. Test Real-Time Connection
- Open 2 browser windows (localhost:5173)
- In window 1: Allow camera, select interests, join
- In window 2: Do the same
- When matched, user A initiates WebRTC → user B responds
- Video/audio starts flowing directly P2P

## Network Traversal (STUN/TURN)

### Current Setup
Using Google's free STUN servers:
```javascript
iceServers: [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
]
```

### Optional: Add TURN Server (For NAT/Firewall)
If P2P doesn't work, add a TURN server:
```javascript
iceServers: [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
]
```

Popular TURN providers:
- Xirsys (xirsys.com) - Free tier available
- Twilio (twilio.com) - Reliable
- metered.ca - Open source option

## Latency & Performance

| Metric | Target | Current |
|--------|--------|---------|
| Connection time | < 5s | Good (depends on queue size) |
| Audio latency | < 150ms | Excellent (P2P direct) |
| Video latency | < 250ms | Excellent (P2P direct) |
| Bandwidth | 1-4 Mbps | Depends on quality |

## Troubleshooting

### Video/Audio Not Working
1. Check browser permissions (chrome://settings/content/camera)
2. Verify backend is running (`npm run dev` in `/backend`)
3. Check browser console for WebRTC errors
4. Ensure both users allowed camera/mic

### Connection Takes Too Long
1. Might be waiting in queue (multiple users needed to test)
2. Check STUN server connectivity
3. Try different TURN server if behind restrictive NAT

### Audio/Video Freezes
1. Network congestion - reduce video quality
2. CPU overload - close other apps
3. Browser issue - try different browser

## Code Quality Notes

✅ **Good Practices:**
- Proper resource cleanup on disconnect
- Error handling for camera permission
- Connection state monitoring
- Interest-based matching
- Message persistence per room

🚀 **Future Improvements:**
- Add screen sharing capability
- Implement video quality adaptation
- Add recording feature
- Implement call statistics/monitoring
- Add call rating/feedback system

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, Socket.io client, WebRTC API |
| **Backend** | Node.js, Express, Socket.io, MongoDB |
| **Signaling** | Socket.io (events-based) |
| **Media** | WebRTC (browser native) |
| **NAT Traversal** | STUN (free) / TURN (optional paid) |

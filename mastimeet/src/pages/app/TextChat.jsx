import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const TextChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingRoomId = location.state?.roomId || null;
  const incomingPartnerId = location.state?.partnerId || null;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [chatTime, setChatTime] = useState(0);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const roomIdRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('Connected to signaling server');

      if (incomingRoomId) {
        roomIdRef.current = incomingRoomId;
        setPartnerInfo({
          name: incomingPartnerId ? `User ${incomingPartnerId.slice(0, 6)}` : 'Chat Partner',
          status: 'Online',
          interests: []
        });
        socketRef.current.emit('room:join-existing', { roomId: incomingRoomId });
        return;
      }

      // Fallback when chat page is opened directly.
      const userInterests = JSON.parse(sessionStorage.getItem('selectedInterests') || '[]');
      socketRef.current.emit('queue:join', { interests: userInterests });
    });

    socketRef.current.on('room:joined', ({ roomId, participantCount }) => {
      roomIdRef.current = roomId;
      setIsConnecting(participantCount < 2);
      if (participantCount >= 2) {
        setIsConnected(true);
      }
    });

    socketRef.current.on('room:ready', ({ roomId }) => {
      roomIdRef.current = roomId;
      setIsConnecting(false);
      setIsConnected(true);
      addSystemMessage('Connected! Say hello 👋');
    });

    socketRef.current.on('queue:waiting', () => {
      console.log('Waiting in queue...');
      setIsConnecting(true);
      setIsConnected(false);
      addSystemMessage('Searching for chat partner...');
    });

    socketRef.current.on('match:found', ({ roomId, partnerId, partnerInterests }) => {
      console.log('Match found!', { roomId, partnerId });
      roomIdRef.current = roomId;
      
      setPartnerInfo({
        name: partnerId ? `User ${partnerId.slice(0, 6)}` : 'Chat Partner',
        status: 'Online',
        interests: partnerInterests || []
      });
      
      setIsConnecting(false);
      setIsConnected(true);
      addSystemMessage('Connected! Say hello 👋');
    });

    socketRef.current.on('chat:message', ({ message, sender, timestamp }) => {
      console.log('Received message:', message);
      setMessages(prev => [
        ...prev,
        { 
          type: 'received', 
          text: message, 
          time: new Date(timestamp),
          sender
        }
      ]);
    });

    socketRef.current.on('partner:disconnected', ({ reason }) => {
      console.log('Partner disconnected:', reason);
      setIsConnected(false);
      addSystemMessage('Partner left the chat 👋');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        if (!incomingRoomId) {
          socketRef.current.emit('queue:leave');
        }
        socketRef.current.disconnect();
      }
    };
  }, [incomingPartnerId, incomingRoomId]);

  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => setChatTime(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, { type: 'system', text, time: new Date() }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected) return;

    // Add to local messages
    setMessages(prev => [
      ...prev,
      { type: 'sent', text: inputMessage, time: new Date(), sender: 'You' }
    ]);

    // Send to partner via Socket.io
    if (socketRef.current && roomIdRef.current) {
      socketRef.current.emit('chat:message', {
        roomId: roomIdRef.current,
        message: inputMessage,
        sender: 'You',
        timestamp: new Date().toISOString()
      });
    }

    setInputMessage('');
  };

  const handleNext = () => {
    if (confirm('Skip this chat and find someone new?')) {
      setMessages([]);
      setIsConnecting(true);
      setIsConnected(false);
      setChatTime(0);
      setPartnerInfo(null);
      roomIdRef.current = null;
      
      // Rejoin queue
      if (socketRef.current) {
        const userInterests = JSON.parse(sessionStorage.getItem('selectedInterests') || '[]');
        socketRef.current.emit('queue:join', { interests: userInterests });
      }
    }
  };

  const handleEndChat = () => {
    if (confirm('End chat and go back?')) {
      if (socketRef.current) {
        socketRef.current.emit('queue:leave');
        socketRef.current.disconnect();
      }
      navigate('/interest-select');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-[5%] py-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">💬 Text Chat</h2>
          <span className={`flex items-center gap-2 px-4 py-2 rounded-full ${isConnecting ? 'bg-yellow-600' : 'bg-green-600'}`}>
            {isConnecting ? '🔄 Searching...' : '🟢 Connected'}
          </span>
          {isConnected && <span className="bg-primary-500 px-4 py-2 rounded-full text-sm">⏱️ {formatTime(chatTime)}</span>}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/profile')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            👤 Profile
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            ⚙️ Settings
          </button>
          <button 
            onClick={handleEndChat}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Partner Info Bar (if connected) */}
      {isConnected && partnerInfo && (
        <div className="bg-gray-800 px-[5%] py-3 border-b border-gray-700 flex items-center gap-4">
          <span className="text-2xl">👤</span>
          <div className="flex-1">
            <p className="font-semibold">{partnerInfo.name}</p>
            <p className="text-sm text-green-400">{partnerInfo.status}</p>
          </div>
          {partnerInfo.interests && partnerInfo.interests.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {partnerInfo.interests.slice(0, 2).map((interest, idx) => (
                <span key={idx} className="bg-primary-600 px-3 py-1 rounded-full text-xs">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-[5%] py-6 space-y-4">
        {isConnecting && !isConnected ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-6xl mb-4 animate-bounce">🔄</div>
            <p className="text-2xl font-semibold mb-2">Searching for partner...</p>
            <p className="text-gray-400">Finding someone interesting to chat with</p>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-xl text-gray-400">Say something to start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'system' ? (
                    <div className="text-center text-gray-500 text-sm py-2 w-full">
                      <span className="bg-gray-800 px-4 py-1 rounded-full">{msg.text}</span>
                    </div>
                  ) : (
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        msg.type === 'sent'
                          ? 'bg-primary-600 text-white rounded-br-none'
                          : 'bg-gray-700 text-white rounded-bl-none'
                      }`}
                    >
                      <p className="break-word">{msg.text}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      {!isConnecting && (
        <div className="bg-gray-800 px-[5%] py-4 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isConnected ? "Type a message..." : "Searching for partner..."}
              disabled={!isConnected}
              className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-full border border-gray-600 focus:border-primary-500 focus:outline-none placeholder-gray-400 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleNext}
              className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
              disabled={!isConnected}
            >
              ⏭️ Next
            </button>
            <button
              type="submit"
              disabled={!isConnected}
              className="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
            >
              Send 📤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TextChat;

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TextChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [chatTime, setChatTime] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsConnecting(false);
      addSystemMessage('Connected! Say hello 👋');
    }, 2000);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setChatTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, { type: 'system', text, time: new Date() }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages(prev => [
      ...prev,
      { type: 'sent', text: inputMessage, time: new Date() }
    ]);
    setInputMessage('');

    // Simulate typing and response
    setTimeout(() => setIsTyping(true), 1000);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { type: 'received', text: 'Hey! Nice to meet you! 😊', time: new Date() }
      ]);
    }, 3000);
  };

  const handleNext = () => {
    setMessages([]);
    setIsConnecting(true);
    setChatTime(0);
    setTimeout(() => {
      setIsConnecting(false);
      addSystemMessage('New chat started!');
    }, 2000);
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
            {isConnecting ? '🔄 Connecting...' : '🟢 Connected'}
          </span>
          <span className="bg-primary-500 px-4 py-2 rounded-full text-sm">⏱️ {formatTime(chatTime)}</span>
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
            onClick={() => navigate('/interest-select')}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-[5%] py-6 space-y-4">
        {isConnecting ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-6xl mb-4 animate-bounce">🔄</div>
            <p className="text-2xl font-semibold mb-2">Connecting...</p>
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
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
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
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-full border border-gray-600 focus:border-primary-500 focus:outline-none placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleNext}
              className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-full font-semibold transition-colors"
            >
              ⏭️ Next
            </button>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-full font-semibold transition-colors"
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

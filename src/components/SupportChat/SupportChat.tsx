import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! Welcome to Sujit Kumar's digital workspace. I am his virtual assistant. How can I help you today? (Ask about: Skills, Projects, Experience, or how to contact him)",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();

    const queryToSend = textOverride || inputValue;
    if (!queryToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: queryToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: queryToSend })
      });

      const data = await response.json();

      const botReply: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply || "Sorry, I am having trouble connecting right now.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error('Chat API Error:', error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting right now. Please try again or email Sujit at valerius@example.com.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputValue(transcript);
        handleSend(undefined, transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Please allow Microphone permissions in your browser.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col gap-3 items-end">
      {/* Floating Chat Trigger Bubble */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="relative bg-gradient-to-r from-[#f5d77f] via-[#d4af37] to-[#9e7815] text-[#050505] p-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer flex items-center justify-center w-[60px] h-[60px]"
          aria-label="Open support chat"
          style={{ boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)' }}
        >
          {/* MessageSquare SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full animate-bounce">
              {unreadCount}
            </span>
          )}

          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#0c0c0c] text-[#fcfcfc] text-[12px] font-medium px-3 py-1.5 rounded border border-[rgba(212,175,55,0.15)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat with AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className="w-[360px] h-[500px] bg-[#0c0c0c] rounded-lg border border-[rgba(212,175,55,0.15)] shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
          role="dialog"
          aria-label="Live Support Chat"
          style={{
            backdropFilter: 'blur(16px)',
            background: 'rgba(12, 12, 12, 0.9)',
            boxShadow: '0 10px 40px 0 rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Header */}
          <div className="bg-[#050505] text-[#fcfcfc] p-4 flex items-center justify-between border-b border-[rgba(212,175,55,0.15)]">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#f5d77f] to-[#d4af37] p-2 rounded text-[#050505] flex items-center justify-center">
                {/* Robot SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                  <circle cx="12" cy="5" r="2"></circle>
                  <path d="M12 7v4"></path>
                  <line x1="8" y1="16" x2="8" y2="16"></line>
                  <line x1="16" y1="16" x2="16" y2="16"></line>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-[14px] leading-tight font-serif tracking-wide gold-text">
                  Sujit's Assistant
                </h4>
                <span className="text-[#a3a3a3] text-[11px] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online | Developer Agent
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-[#a3a3a3] hover:text-[#fcfcfc] p-1 rounded transition-colors cursor-pointer"
              aria-label="Close chat window"
            >
              {/* X SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto bg-[#141414] flex flex-col gap-4">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
                >
                  <div
                    className={`p-2 rounded shrink-0 h-8 w-8 flex items-center justify-center border ${
                      isBot
                        ? 'bg-transparent border-[rgba(212,175,55,0.2)] text-[#d4af37]'
                        : 'bg-[#d4af37] border-transparent text-[#050505]'
                    }`}
                  >
                    {isBot ? (
                      /* Robot SVG */
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <circle cx="12" cy="5" r="2"></circle>
                        <path d="M12 7v4"></path>
                        <line x1="8" y1="16" x2="8" y2="16"></line>
                        <line x1="16" y1="16" x2="16" y2="16"></line>
                      </svg>
                    ) : (
                      /* User SVG */
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div
                      className={`p-3 rounded text-[13px] leading-relaxed shadow-sm ${
                        isBot
                          ? 'bg-[#0c0c0c] text-[#fcfcfc] border border-[rgba(212,175,55,0.08)]'
                          : 'bg-[#d4af37] text-[#050505] font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-[#555555] self-end px-1">{msg.time}</span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 self-start max-w-[85%]">
                <div className="p-2 rounded shrink-0 bg-transparent border border-[rgba(212,175,55,0.2)] text-[#d4af37] h-8 w-8 flex items-center justify-center">
                  {/* Robot SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4"></path>
                    <line x1="8" y1="16" x2="8" y2="16"></line>
                    <line x1="16" y1="16" x2="16" y2="16"></line>
                  </svg>
                </div>
                <div className="bg-[#0c0c0c] border border-[rgba(212,175,55,0.08)] p-3 rounded shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-[rgba(212,175,55,0.15)] bg-[#050505] flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Ask a question...'}
              className="flex-grow text-[13px] px-3 py-2.5 rounded bg-[#0c0c0c] border border-[rgba(212,175,55,0.15)] text-[#fcfcfc] placeholder-[#555555] focus:border-[#d4af37] focus:outline-none"
              aria-label="Type your message"
            />

            {/* Mic Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded transition-colors duration-300 shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-[#0c0c0c] border border-[rgba(212,175,55,0.15)] text-[#a3a3a3] hover:text-[#d4af37]'
              }`}
              title="Voice Search"
              aria-label="Voice input"
            >
              {/* Mic SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>

            {/* Send Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#f5d77f] to-[#d4af37] text-[#050505] p-2.5 rounded hover:scale-105 transition-transform duration-300 cursor-pointer shrink-0"
              aria-label="Send message"
            >
              {/* Send SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

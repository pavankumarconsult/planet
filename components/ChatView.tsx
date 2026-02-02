
import React, { useState, useRef, useEffect } from 'react';
import { Message, Theme } from '../types';
import { Shield, Book, Send, Heart, Settings } from 'lucide-react';

interface ChatViewProps {
  messages: Message[];
    currentUser: 'jupiter' | 'mars' | null;
  onSendMessage: (text: string) => void;
  onTogglePanic: () => void;
  onToggleNotes: () => void;
  onToggleSettings: () => void;
  isTyping: boolean;
  theme: Theme;
  onTypingChange?: (isTyping: boolean) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  messages, 
    currentUser,
  onSendMessage, 
  onTogglePanic, 
  onToggleNotes,
  onToggleSettings,
  isTyping,
  theme,
  onTypingChange
}) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Track user typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (onTypingChange) {
      onTypingChange(e.target.value.length > 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      if (onTypingChange) {
        onTypingChange(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-rose-500 dark:text-rose-400">Planet</h1>
          <p className="text-[10px] md:text-xs text-zinc-500 font-medium">Jupiter ❤️ Mars</p>
        </div>
        
        <div className="flex items-center gap-1 md:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">In Orbit</span>
          </div>
          <button 
            onClick={onToggleSettings}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={onToggleNotes}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Notes"
          >
            <Book size={20} />
          </button>
          <button 
            onClick={onTogglePanic}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Panic Mode"
          >
            <Shield size={20} />
          </button>
        </div>
      </header>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-200/20 dark:from-zinc-900/40 via-transparent to-transparent"
      >
        {messages.map((msg) => {
          // Determine if message is from current user
          const isCurrentUser = currentUser && msg.sender.toLowerCase() === currentUser;
          
          return (
          <div 
            key={msg.id} 
            className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                isCurrentUser
                  ? 'bg-rose-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {msg.text}
            </div>
            <span className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-600 px-1">
              {msg.timestamp instanceof Date 
                ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            </span>
          </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start space-x-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white dark:bg-zinc-800 text-rose-500 dark:text-rose-400 border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1">
              <Heart size={14} className="heart-pulse text-rose-500 fill-rose-500" />
              <div className="flex gap-1 ml-1">
                <span className="w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce delay-75"></span>
                <span className="w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSubmit}
        className="sticky bottom-0 p-4 pb-8 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-900"
      >
        <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl p-1.5 pr-2 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <input 
            type="text" 
            value={inputText}
            onChange={handleInputChange}
            placeholder="Whisper something..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 p-2 rounded-xl text-white transition-all shadow-lg active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;

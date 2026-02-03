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
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-scroll to bottom */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    onTypingChange?.(e.target.value.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText);
    setInputText('');
    onTypingChange?.(false);

    /* Keep keyboard open on mobile */
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">

      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-rose-500">Planet</h1>
          <p className="text-xs text-zinc-500">Jupiter ❤️ Mars</p>
        </div>

        <div className="flex gap-2">
          <button onClick={onToggleSettings} className="icon-btn">
            <Settings size={20} />
          </button>
          <button onClick={onToggleNotes} className="icon-btn">
            <Book size={20} />
          </button>
          <button onClick={onTogglePanic} className="icon-btn text-red-500">
            <Shield size={20} />
          </button>
        </div>
      </header>

      {/* CHAT AREA */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4"
      >
        {messages.map(msg => {
          const isCurrentUser =
            currentUser && msg.sender.toLowerCase() === currentUser;

          return (
            <div key={msg.id} className="w-full min-w-0">
              {/* Message row */}
              <div
                className={`flex w-full min-w-0 ${
                  isCurrentUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* ------------------ */}
                <div
  className={`max-w-[80%] sm:max-w-[70%]
    px-4 py-2.5 rounded-2xl text-sm shadow-sm
    break-all whitespace-pre-wrap leading-relaxed
    ${
      isCurrentUser
        ? 'bg-rose-600 text-white rounded-tr-none ml-auto'
        : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-700'
    }`}
>
  {msg.text}
</div>
                {/*  */}
              </div>

              {/* Timestamp */}
              <div
                className={`flex w-full ${
                  isCurrentUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <span className="mt-1 text-[10px] text-zinc-400 px-1">
                  {msg.timestamp instanceof Date
                    ? msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : ''}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-white dark:bg-zinc-800 border px-4 py-2 rounded-2xl flex items-center gap-2">
              <Heart size={14} className="text-rose-500 animate-pulse" />
              <span className="text-xs text-zinc-500">typing…</span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur border-t border-zinc-200 dark:border-zinc-900 p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-1.5">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Whisper something..."
            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-zinc-900 dark:text-zinc-100 min-w-0"
          />

          <button
            type="submit"
            onMouseDown={(e) => e.preventDefault()}
            disabled={!inputText.trim()}
            className="bg-rose-600 disabled:opacity-50 text-white p-2 rounded-xl active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;

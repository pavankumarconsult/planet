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
    <div className="flex flex-col w-full max-w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">

      {/* HEADER */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800"
        style={{
          paddingTop: 'calc(var(--chat-padding-top) + env(safe-area-inset-top))', // User-adjustable top spacing
          paddingLeft: 'var(--chat-padding-horizontal)', // User-adjustable side padding
          paddingRight: 'var(--chat-padding-horizontal)' // User-adjustable side padding
        }}
      >
        <div>
          <h1 className="text-xl font-bold text-rose-500">Planet</h1>
          <p className="text-xs text-zinc-500">Jupiter ❤️ Mars</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSettings}
            className="p-2 rounded-lg border-2 border-zinc-200/70 dark:border-zinc-700/80 text-zinc-500 hover:text-rose-500 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={onToggleNotes}
            className="p-2 rounded-lg border-2 border-zinc-200/70 dark:border-zinc-700/80 text-zinc-500 hover:text-rose-500 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60"
            aria-label="Notes"
          >
            <Book size={20} />
          </button>
          <button
            onClick={onTogglePanic}
            className="p-2 mr-2 rounded-lg border-2 border-zinc-200/70 dark:border-zinc-700/80 text-red-500 hover:bg-red-500/10"
            aria-label="Panic Mode"
          >
            <Shield size={20} />
          </button>
        </div>
      </header>

      {/* CHAT AREA */}
      <div 
        ref={scrollRef}
        className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden"
        style={{
          paddingTop: 'calc(72px + var(--chat-padding-top) + env(safe-area-inset-top))', // Push chat below fixed header
          paddingBottom: 'calc(96px + var(--chat-padding-bottom) + env(safe-area-inset-bottom))', // Keep chat above input + keyboard
          paddingLeft: 'var(--chat-padding-horizontal)', // User-adjustable side padding
          paddingRight: 'var(--chat-padding-horizontal)', // User-adjustable side padding
          rowGap: 'var(--chat-row-gap)' // Compact/comfortable spacing
        }}
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
                {/* ---------------- */}
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
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur border-t border-zinc-200 dark:border-zinc-900"
        style={{
          paddingTop: '12px',
          paddingBottom: 'calc(16px + var(--chat-padding-bottom) + env(safe-area-inset-bottom))', // User-adjustable bottom spacing
          paddingLeft: 'var(--chat-padding-horizontal)', // User-adjustable side padding
          paddingRight: 'var(--chat-padding-horizontal)' // User-adjustable side padding
        }}
      >
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-1.5">
          {/* PANIC BUTTON — OUTSIDE FORM */}
          <button
            type="button"
            onClick={onTogglePanic}
            className="p-2 rounded-lg border-2 border-zinc-200/70 dark:border-zinc-700/80 text-red-500 hover:bg-red-500/10"
            aria-label="Panic Mode"
          >
            <Shield size={20} />
          </button>

          {/* FORM: INPUT + SEND ONLY */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Whisper something..."
              enterKeyHint="send"
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-zinc-900 dark:text-zinc-100 min-w-0"
            />

            <button
              type="submit"
              onMouseDown={(e) => e.preventDefault()}
              className="p-2 rounded-xl bg-rose-600 text-white"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatView;

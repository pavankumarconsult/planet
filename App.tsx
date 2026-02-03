
import React, { useState, useEffect } from 'react';
import { AppMode, Message, Note, Theme } from './types';
import { INITIAL_MESSAGES, INITIAL_NOTES } from './constants';
import ChatView from './components/ChatView';
import CalculatorView from './components/CalculatorView';
import NotesPanel from './components/NotesPanel';
import SettingsPanel from './components/SettingsPanel';
import LoginScreen from './components/LoginScreen';
import TypingIndicator from './components/TypingIndicator';
import { toggleAppState, addChatMessage, listenToChatMessages, listenToUserStatus, updateTypingStatus } from './index';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [messages, setMessages] = useState<Message[]>([]); // Start empty, load from Firestore
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [showNotes, setShowNotes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [chatUiAdjust, setChatUiAdjust] = useState({
    top: 12,
    bottom: 16,
    horizontal: 12,
    density: 'comfortable' as 'compact' | 'comfortable'
  });
  
  // ===== LOGIN STATE MANAGEMENT =====
  // User must log in first with time-based PIN
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<'jupiter' | 'mars' | null>(null);
  
  // UI states
  const [userIsTyping, setUserIsTyping] = useState(false);

  // ===== CHAT UI ADJUSTMENT (USER CONTROLLED) =====
  useEffect(() => {
    const raw = localStorage.getItem('chatUiAdjust');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setChatUiAdjust(prev => ({
        ...prev,
        ...parsed
      }));
    } catch {
      // Ignore malformed stored data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatUiAdjust', JSON.stringify(chatUiAdjust));
  }, [chatUiAdjust]);
  
  // ===== REAL-TIME CHAT LISTENER =====
  // Subscribe to Firestore messages ONLY when logged in
  useEffect(() => {
    if (!isLoggedIn || !currentUser) return;

    // Start listening to chat messages
    const unsubscribe = listenToChatMessages((firestoreMessages) => {
      // Convert Firestore messages to Message type
      const formattedMessages: Message[] = firestoreMessages.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender === 'jupiter' ? 'Jupiter' : 'Mars',
        text: msg.text,
        timestamp: msg.timestamp?.toDate() || new Date()
      }));
      
      // Sort by timestamp
      formattedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      setMessages(formattedMessages);
    });

    // Clean up listener on unmount or when user logs out
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isLoggedIn, currentUser]);

  // ===== REAL-TIME USER STATUS =====
  // Subscribe to partner for typing updates
  useEffect(() => {
    if (!isLoggedIn || !currentUser) return;

    const partnerUser = currentUser === 'jupiter' ? 'mars' : 'jupiter';

    const unsubscribePartner = listenToUserStatus(partnerUser, (data) => {
      if (!data) return;
      setIsTyping(!!data.isTyping);
    });

    return () => {
      if (unsubscribePartner) unsubscribePartner();
    };
  }, [isLoggedIn, currentUser]);

  // ===== REAL-TIME TYPING UPDATE =====
  // Push local typing state to Firestore
  useEffect(() => {
    if (!currentUser) return;
    updateTypingStatus(currentUser, userIsTyping);
  }, [currentUser, userIsTyping]);

  // ===== SEND MESSAGE HANDLER =====
  // Send message to Firestore (only if logged in)
  const handleSendMessage = async (text: string) => {
    // Safety checks
    if (!text.trim()) return;
    if (!currentUser) return;
    
    // Send to Firestore - real-time listener will update UI
    await addChatMessage(currentUser, text);
  };

  // ===== PANIC MODE HANDLER =====
  // Switches to fake app UI when panic button pressed
  const togglePanic = () => {
    if (mode === AppMode.CHAT) {
      // Step 1: Switch to fake calculator UI
      setMode(AppMode.CALCULATOR);
      
      // Step 2: Update Firestore state
      toggleAppState('panicMode', true);
      toggleAppState('fakeMode', true);
    } else {
      // Exit panic mode - return to chat
      setMode(AppMode.CHAT);
      toggleAppState('panicMode', false);
      toggleAppState('fakeMode', false);
    }
    
    // Close all panels for clean state
    setShowNotes(false);
    setShowSettings(false);
  };

  // ===== LOGIN HANDLER =====
  // Called when user successfully enters correct time-based PIN
  // After login, user goes directly to chat UI
  const handleLogin = (user: 'jupiter' | 'mars') => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleAddNote = (isShared: boolean) => {
    const newNote: Note = {
      id: Math.random().toString(),
      title: 'New Note',
      content: '',
      updatedAt: new Date(),
      isShared
    };
    setNotes(prev => [newNote, ...prev]);
  };

  // ===== RENDERING PRIORITY =====
  // Priority 1: Show login screen if not logged in (time-based PIN)
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }
  
  // Priority 2: Show fake calculator in panic mode
  if (mode === AppMode.CALCULATOR) {
    return <CalculatorView onUnlock={() => setMode(AppMode.CHAT)} />;
  }

  // Priority 3: Show normal app UI (chat, notes, settings)
  // Only visible when logged in and not in panic mode

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div
        className="flex h-screen w-screen overflow-hidden overflow-x-hidden max-w-[100vw] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500"
        style={{
          // CSS vars used by ChatView for padding adjustments
          ['--chat-padding-top' as any]: `${chatUiAdjust.top}px`,
          ['--chat-padding-bottom' as any]: `${chatUiAdjust.bottom}px`,
          ['--chat-padding-horizontal' as any]: `${chatUiAdjust.horizontal}px`,
          ['--chat-row-gap' as any]: chatUiAdjust.density === 'compact' ? '8px' : '16px'
        }}
      >
        {/* Main Content Area */}
        <div className={`flex flex-1 flex-col transition-all duration-300 ${showNotes ? 'md:mr-96' : ''}`}>
          <ChatView 
            messages={messages}
            currentUser={currentUser}
            onSendMessage={(text) => {
              setUserIsTyping(false);
              handleSendMessage(text);
            }}
            onTogglePanic={togglePanic}
            onToggleNotes={() => {
              setShowNotes(!showNotes);
              if (showSettings) setShowSettings(false);
            }}
            onToggleSettings={() => {
              setShowSettings(!showSettings);
              if (showNotes) setShowNotes(false);
            }}
            // Show typing indicator only for the other user
            isTyping={isTyping}
            theme={theme}
            onTypingChange={setUserIsTyping}
          />
          
          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Settings Panel - Left Side Overlay */}
        <SettingsPanel 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          theme={theme}
          onThemeChange={setTheme}
          chatUiAdjust={chatUiAdjust}
          onChatUiAdjustChange={setChatUiAdjust}
        />

        {/* Notes Section - Desktop Sidebar / Mobile Fullscreen Overlay */}
        <NotesPanel 
          notes={notes}
          isOpen={showNotes}
          onClose={() => setShowNotes(false)}
          onAddNote={handleAddNote}
          onUpdateNote={(id, updates) => {
            setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n));
          }}
          onDeleteNote={(id) => setNotes(prev => prev.filter(n => n.id !== id))}
        />
      </div>
    </div>
  );
};

export default App;

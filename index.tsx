import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { collection, doc, addDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Function to add a chat message
export const addChatMessage = async (sender: 'jupiter' | 'mars', text: string) => {
  const chatRef = doc(db, 'chats', 'jupiter_mars');
  const messagesRef = collection(chatRef, 'messages');
  await addDoc(messagesRef, {
    sender,
    text,
    timestamp: serverTimestamp()
  });
};

// Function to listen to chat messages in real-time
export const listenToChatMessages = (callback: (messages: any[]) => void) => {
  const chatRef = doc(db, 'chats', 'jupiter_mars');
  const messagesRef = collection(chatRef, 'messages');
  return onSnapshot(messagesRef, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

// Function to update user mood
export const updateMood = async (userId: 'jupiter' | 'mars', mood: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { mood });
};

// Function to update user typing status
export const updateTypingStatus = async (userId: 'jupiter' | 'mars', isTyping: boolean) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { isTyping });
};

// Function to listen to user status (mood, typing, lastActive)
export const listenToUserStatus = (
  userId: 'jupiter' | 'mars',
  callback: (data: { mood?: string; isTyping?: boolean } | undefined) => void
) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (snapshot) => {
    callback(snapshot.data() as { mood?: string; isTyping?: boolean } | undefined);
  });
};

// Function to add a diary entry
export const addDiaryEntry = async (userId: 'jupiter' | 'mars', text: string) => {
  const diaryRef = doc(db, 'diaries', userId);
  const entriesRef = collection(diaryRef, 'entries');
  await addDoc(entriesRef, {
    text,
    createdAt: serverTimestamp()
  });
};

// Function to listen to diary entries in real-time
export const listenToDiaryEntries = (userId: 'jupiter' | 'mars', callback: (entries: any[]) => void) => {
  const diaryRef = doc(db, 'diaries', userId);
  const entriesRef = collection(diaryRef, 'entries');
  onSnapshot(entriesRef, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(entries);
  });
};

// Function to update shared notes
export const updateSharedNotes = async (text: string) => {
  const notesRef = doc(db, 'shared_notes', 'planet_notes');
  await updateDoc(notesRef, { text, updatedAt: serverTimestamp() });
};

// Function to toggle app state
export const toggleAppState = async (fieldName: 'panicMode' | 'fakeMode' | 'screenshotDetected', value: boolean) => {
  const stateRef = doc(db, 'app_state', 'ui_state');
  await updateDoc(stateRef, { [fieldName]: value });
};

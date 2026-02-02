
import { Message, Note } from './types';

export const INITIAL_MESSAGES: Message[] = [
  { id: '1', sender: 'Mars', text: 'Hey gorgeous, just thinking about you.', timestamp: new Date(Date.now() - 3600000) },
  { id: '2', sender: 'Jupiter', text: 'You always know when I need to hear that ❤️', timestamp: new Date(Date.now() - 3500000) },
  { id: '3', sender: 'Mars', text: 'Ready for our space dinner tonight?', timestamp: new Date(Date.now() - 3400000) },
  { id: '4', sender: 'Jupiter', text: 'Counting down the minutes! 🚀✨', timestamp: new Date(Date.now() - 3300000) },
];

export const INITIAL_NOTES: Note[] = [
  { id: 'n1', title: 'Gift Ideas', content: 'That vintage telescope she liked...', updatedAt: new Date(), isShared: true },
  { id: 'n2', title: 'Private Thoughts', content: 'I really love how we just get each other.', updatedAt: new Date(), isShared: false },
];

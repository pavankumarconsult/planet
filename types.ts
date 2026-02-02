
export type User = 'Jupiter' | 'Mars';
export type Theme = 'light' | 'dark';

export interface Message {
  id: string;
  sender: User;
  text: string;
  timestamp: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
  isShared: boolean;
}

export enum AppMode {
  CHAT = 'chat',
  CALCULATOR = 'calculator'
}

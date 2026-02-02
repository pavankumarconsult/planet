
import React, { useState } from 'react';
import { Note } from '../types';
import { X, Plus, Trash2, Share2, User, Book } from 'lucide-react';

interface NotesPanelProps {
  notes: Note[];
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (isShared: boolean) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ 
  notes, 
  isOpen, 
  onClose, 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote 
}) => {
  const [activeTab, setActiveTab] = useState<'my' | 'our'>('my');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredNotes = notes.filter(n => activeTab === 'our' ? n.isShared : !n.isShared);

  return (
    <div className={`
      fixed inset-0 z-50 transform transition-transform duration-500 ease-in-out bg-zinc-50 dark:bg-zinc-950
      md:static md:w-96 md:border-l md:border-zinc-200 dark:md:border-zinc-800 md:translate-x-0
      ${isOpen ? 'translate-x-0' : 'translate-x-full md:hidden'}
    `}>
      <div className="flex flex-col h-full transition-colors duration-500">
        {/* Panel Header */}
        <header className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-900">
          <h2 className="text-xl font-bold">Archives</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-full md:hidden">
            <X size={20} />
          </button>
        </header>

        {/* Tabs */}
        <div className="flex p-2 gap-2 bg-zinc-200/50 dark:bg-zinc-900/50 mx-4 mt-4 rounded-xl border border-zinc-200 dark:border-zinc-900">
          <button 
            onClick={() => setActiveTab('my')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'my' ? 'bg-white dark:bg-zinc-800 text-rose-500 dark:text-rose-400 shadow-sm' : 'text-zinc-500'}`}
          >
            <User size={14} /> My Diary
          </button>
          <button 
            onClick={() => setActiveTab('our')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'our' ? 'bg-white dark:bg-zinc-800 text-rose-500 dark:text-rose-400 shadow-sm' : 'text-zinc-500'}`}
          >
            <Share2 size={14} /> Our Notes
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {filteredNotes.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 dark:text-zinc-600 opacity-40">
              <Book size={48} className="mb-4" />
              <p className="text-sm">Empty space waiting for your thoughts.</p>
            </div>
          )}
          {filteredNotes.map(note => (
            <div 
              key={note.id} 
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl group transition-all hover:border-rose-200 dark:hover:border-zinc-700 shadow-sm"
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <input 
                    autoFocus
                    className="w-full bg-transparent border-none text-rose-500 dark:text-rose-400 font-semibold focus:ring-0 p-0 text-sm"
                    value={note.title}
                    onChange={(e) => onUpdateNote(note.id, { title: e.target.value })}
                  />
                  <textarea 
                    className="w-full bg-transparent border-none text-zinc-600 dark:text-zinc-300 focus:ring-0 p-0 text-xs min-h-[100px] resize-none"
                    value={note.content}
                    onChange={(e) => onUpdateNote(note.id, { content: e.target.value })}
                    onBlur={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div onClick={() => setEditingId(note.id)}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-rose-500 dark:text-rose-400 text-sm">{note.title || 'Untitled'}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-500 text-zinc-400 dark:text-zinc-600 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-3 leading-relaxed">
                    {note.content || 'Tap to start writing...'}
                  </p>
                  <div className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-600 font-medium tracking-wider uppercase">
                    Last updated {note.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="p-6">
          <button 
            onClick={() => onAddNote(activeTab === 'our')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-zinc-900 border border-rose-500/30 text-rose-500 dark:text-rose-400 rounded-2xl font-bold text-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-95 shadow-lg shadow-rose-900/5"
          >
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;

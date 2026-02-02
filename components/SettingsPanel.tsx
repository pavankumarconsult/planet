
import React from 'react';
import { Theme } from '../types';
import { X, Moon, Sun, Monitor, Palette, Lock } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  theme, 
  onThemeChange 
}) => {
  return (
    <div className={`
      fixed inset-0 z-50 transform transition-transform duration-500 ease-in-out bg-zinc-50 dark:bg-zinc-950
      md:absolute md:left-0 md:top-0 md:bottom-0 md:w-80 md:border-r md:border-zinc-200 dark:md:border-zinc-800
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        {/* Panel Header */}
        <header className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-900">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-full">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Appearance Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
              <Palette size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Appearance</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 font-medium">Choose your interface theme</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onThemeChange('light')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    theme === 'light' 
                      ? 'bg-rose-50 border-rose-500 text-rose-600' 
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  <Sun size={24} />
                  <span className="text-xs font-bold">Light</span>
                </button>
                
                <button 
                  onClick={() => onThemeChange('dark')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    theme === 'dark' 
                      ? 'bg-rose-950/20 border-rose-500 text-rose-400' 
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  <Moon size={24} />
                  <span className="text-xs font-bold">Dark</span>
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* Version Footer */}
        <div className="p-6 text-center">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
            Planet v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

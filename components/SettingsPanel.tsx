
import React from 'react';
import { Theme } from '../types';
import { X, Moon, Sun, Monitor, Palette } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  chatUiAdjust: {
    top: number;
    bottom: number;
    horizontal: number;
    density: 'compact' | 'comfortable';
  };
  onChatUiAdjustChange: (next: {
    top: number;
    bottom: number;
    horizontal: number;
    density: 'compact' | 'comfortable';
  }) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose,
  theme,
  onThemeChange,
  chatUiAdjust,
  onChatUiAdjustChange
}) => {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const handleAdjustChange = (key: 'top' | 'bottom' | 'horizontal', value: number) => {
    onChatUiAdjustChange({
      ...chatUiAdjust,
      [key]: value
    });
  };

  const handleDensityChange = (density: 'compact' | 'comfortable') => {
    onChatUiAdjustChange({
      ...chatUiAdjust,
      density
    });
  };

  const handleReset = () => {
    onChatUiAdjustChange({
      top: 12,
      bottom: 16,
      horizontal: 12,
      density: 'comfortable'
    });
  };

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

          {/* Chat UI Adjustment Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
              <Monitor size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Chat UI Adjustment</h3>
            </div>
            <p className="text-xs text-zinc-500 font-medium">
              Tune spacing so the chat stays visible on your device.
            </p>

            <div className="space-y-4">
              {/* Top Spacing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Top Spacing
                  </span>
                  <span className="text-xs text-zinc-500">{chatUiAdjust.top}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={32}
                  step={1}
                  value={chatUiAdjust.top}
                  onChange={(e) =>
                    handleAdjustChange('top', clamp(Number(e.target.value), 0, 32))
                  }
                  className="w-full accent-rose-500"
                />
              </div>

              {/* Bottom Spacing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Bottom Spacing
                  </span>
                  <span className="text-xs text-zinc-500">{chatUiAdjust.bottom}px</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={48}
                  step={1}
                  value={chatUiAdjust.bottom}
                  onChange={(e) =>
                    handleAdjustChange('bottom', clamp(Number(e.target.value), 8, 48))
                  }
                  className="w-full accent-rose-500"
                />
              </div>

              {/* Left/Right Spacing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Left / Right Spacing
                  </span>
                  <span className="text-xs text-zinc-500">{chatUiAdjust.horizontal}px</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={24}
                  step={1}
                  value={chatUiAdjust.horizontal}
                  onChange={(e) =>
                    handleAdjustChange('horizontal', clamp(Number(e.target.value), 8, 24))
                  }
                  className="w-full accent-rose-500"
                />
              </div>

              {/* Density Toggle */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Density
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDensityChange('compact')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                      chatUiAdjust.density === 'compact'
                        ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                    }`}
                  >
                    Compact
                  </button>
                  <button
                    onClick={() => handleDensityChange('comfortable')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                      chatUiAdjust.density === 'comfortable'
                        ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                    }`}
                  >
                    Comfortable
                  </button>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="w-full mt-2 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60"
              >
                Reset to Default
              </button>
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


import React, { useState } from 'react';

interface CalculatorViewProps {
  onUnlock: () => void;
}

const CalculatorView: React.FC<CalculatorViewProps> = ({ onUnlock }) => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const buttons = [
    'C', '±', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  // Secret long-press on '=' button to unlock
  const handleLongPressStart = (btn: string) => {
    if (btn === '=') {
      const timer = setTimeout(() => {
        onUnlock();
      }, 2000); // 2 second long-press
      setLongPressTimer(timer);
    }
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handlePress = (btn: string) => {
    // Secret sequence to unlock: 1234=
    if (btn === '=') {
      if (display === '1234') {
        onUnlock();
        return;
      }
      try {
        // Simple logic for the fake app feel
        setDisplay(eval(display.replace('×', '*').replace('÷', '/')).toString());
      } catch {
        setDisplay('Error');
      }
      return;
    }

    if (btn === 'C') {
      setDisplay('0');
      setHistory('');
      return;
    }

    if (display === '0' || display === 'Error') {
      setDisplay(btn);
    } else {
      setDisplay(prev => prev + btn);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
        {/* Calc Display */}
        <div className="flex flex-col items-end justify-end p-6 bg-zinc-900 rounded-3xl h-48 border border-zinc-800">
          <span className="text-zinc-500 text-lg mb-1">{history}</span>
          <span className="text-white text-6xl font-light tracking-tighter truncate w-full text-right">
            {display}
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handlePress(btn)}
              onMouseDown={() => handleLongPressStart(btn)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={() => handleLongPressStart(btn)}
              onTouchEnd={handleLongPressEnd}
              className={`
                h-16 rounded-2xl flex items-center justify-center text-xl font-medium transition-all active:scale-90
                ${['C', '±', '%'].includes(btn) ? 'bg-zinc-700 text-zinc-100' : ''}
                ${['÷', '×', '-', '+', '='].includes(btn) ? 'bg-orange-500 text-white' : ''}
                ${!['C', '±', '%', '÷', '×', '-', '+', '='].includes(btn) ? 'bg-zinc-800 text-white' : ''}
                ${btn === '0' ? 'col-span-2' : ''}
              `}
            >
              {btn}
            </button>
          ))}
        </div>
        
        <p className="text-center text-zinc-800 text-[10px] mt-4 tracking-widest uppercase">
          Calculator v4.2.0
        </p>
      </div>
    </div>
  );
};

export default CalculatorView;

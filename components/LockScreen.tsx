import React, { useState } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  
  // ===== PIN CONFIGURATION =====
  // PIN stored only in memory (never persisted)
  const correctPin = '1234';

  // ===== PIN INPUT HANDLER =====
  const handleNumberClick = (num: string) => {
    // Ignore input if already at max length or showing error
    if (pin.length >= 4 || error) return;
    
    const newPin = pin + num;
    setPin(newPin);
    
    // ===== AUTO-VALIDATION =====
    // Check PIN when 4 digits entered
    if (newPin.length === 4) {
      if (newPin === correctPin) {
        // ✅ Correct PIN - unlock app
        onUnlock();
      } else {
        // ❌ Wrong PIN - show error and reset
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 800);
      }
    }
  };

  // ===== CLEAR HANDLER =====
  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    // ===== FULL-SCREEN LOCK OVERLAY =====
    // Blocks all background interaction and scroll
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 overflow-hidden">
      <div className={`w-full max-w-md p-8 ${error ? 'animate-shake' : ''}`}>
        {/* Lock Icon */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Planet</h1>
          <p className="mt-2 text-white/70">Enter PIN to unlock</p>
        </div>

        {/* PIN Display - Masked dots */}
        <div className="mb-8 flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border-2 transition-all ${
                pin.length > i
                  ? error
                    ? 'border-red-500 bg-red-500'
                    : 'border-white bg-white'
                  : 'border-white/30'
              }`}
            />
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              disabled={error}
              className="aspect-square rounded-2xl bg-white/10 text-2xl font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Number ${num}`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={error}
            className="aspect-square rounded-2xl bg-white/5 text-sm text-white/70 backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
            aria-label="Clear PIN"
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            disabled={error}
            className="aspect-square rounded-2xl bg-white/10 text-2xl font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Number 0"
          >
            0
          </button>
          <div className="aspect-square" /> {/* Empty space */}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-center text-sm font-semibold text-red-300 animate-pulse">Incorrect PIN - Try again</p>
        )}
      </div>
    </div>
  );
};

export default LockScreen;

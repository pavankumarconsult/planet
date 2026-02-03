import React, { useState } from 'react';

type UserType = 'jupiter' | 'mars';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // ===== TIME-BASED PIN VALIDATION =====
  // PIN must match current time in HHMM format (e.g., 14:30 → 1430)
  const getCurrentTimePIN = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return hours + minutes;
  };

  // ===== PIN INPUT HANDLER =====
  const handleNumberClick = (num: string) => {
    if (pin.length >= 4 || error) return;
    
    const newPin = pin + num;
    setPin(newPin);
    
    // Auto-validate when 4 digits entered
    if (newPin.length === 4) {
      const correctPin = getCurrentTimePIN();
      
      if (newPin === correctPin && selectedUser) {
        // ✅ Correct PIN - log in
        onLogin(selectedUser);
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

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setPin('');
    setError(false);
  };

  // ===== USER SELECTION SCREEN =====
  if (!selectedUser) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        <div className="w-full max-w-md p-8">
          {/* App Logo */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-5xl">🌍</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Planet</h1>
            <p className="mt-2 text-white/70">Where two hearts orbit</p>
          </div>

          {/* User Selection */}
          <div className="space-y-4">
            <p className="text-center text-sm text-white/70 mb-6">Who are you?</p>
            
            <button
              onClick={() => setSelectedUser('jupiter')}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-left transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">🪐</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">Jupiter</h2>
                  <p className="text-sm text-white/80">The giant heart</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedUser('mars')}
              className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 p-6 text-left transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">🔴</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">Mars</h2>
                  <p className="text-sm text-white/80">The passionate soul</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== PIN ENTRY SCREEN =====
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      <div className={`w-full max-w-md p-8 ${error ? 'animate-shake' : ''}`}>
        {/* User Badge */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <span className="text-4xl">{selectedUser === 'jupiter' ? '🪐' : '🔴'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white capitalize">{selectedUser}</h2>
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
        <div className="grid grid-cols-3 gap-4 mb-4">
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
          <button
            onClick={handleBack}
            disabled={error}
            className="aspect-square rounded-2xl bg-white/5 text-sm text-white/70 backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
            aria-label="Go back"
          >
            Back
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-center text-sm font-semibold text-red-300 animate-pulse">
            Incorrect PIN - Check current time
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;

import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1">
        <span className="animate-bounce text-2xl" style={{ animationDelay: '0ms' }}>❤️</span>
        <span className="animate-bounce text-2xl" style={{ animationDelay: '150ms' }}>❤️</span>
        <span className="animate-bounce text-2xl" style={{ animationDelay: '300ms' }}>❤️</span>
      </div>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">typing...</span>
    </div>
  );
};

export default TypingIndicator;

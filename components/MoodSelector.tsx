import React from 'react';

interface MoodSelectorProps {
  currentMood: string;
  onMoodChange: (mood: string) => void;
}

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '❤️', label: 'Love' },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ currentMood, onMoodChange }) => {
  return (
    <div className="flex gap-2">
      {moods.map((mood) => (
        <button
          key={mood.label}
          onClick={() => onMoodChange(mood.emoji)}
          className={`rounded-full p-2 text-2xl transition-all hover:scale-110 ${
            currentMood === mood.emoji
              ? 'bg-pink-500/20 ring-2 ring-pink-500'
              : 'hover:bg-white/10'
          }`}
          title={mood.label}
        >
          {mood.emoji}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;

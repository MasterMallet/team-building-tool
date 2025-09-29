import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

interface Props {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<Props> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-lg z-50"
      aria-label="テーマ切り替え"
    >
      {theme === 'light' ? (
        <Moon size={24} className="text-gray-800 dark:text-gray-200" />
      ) : (
        <Sun size={24} className="text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
};

import React from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  onDivide: () => void;
  onClear: () => void;
}

export const ControlButtons: React.FC<Props> = ({ onDivide, onClear }) => {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <button
        onClick={onDivide}
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
      >
        <RefreshCw size={24} /> チーム分け実行
      </button>
      <button
        onClick={onClear}
        className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
      >
        <Trash2 size={24} /> リセット
      </button>
    </div>
  );
};

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
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
      >
        <RefreshCw size={24} /> チーム分け実行
      </button>
      <button
        onClick={onClear}
        className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
      >
        <Trash2 size={24} /> リセット
      </button>
    </div>
  );
};
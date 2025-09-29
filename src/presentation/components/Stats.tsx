import React from 'react';
import { Users } from 'lucide-react';

interface Props {
  total: number;
  lowerGrades: number;
  upperGrades: number;
}

export const Stats: React.FC<Props> = ({ total, lowerGrades, upperGrades }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
        <Users size={24} className="text-blue-600 dark:text-blue-400" /> 参加状況
      </h3>
      <div className="space-y-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">総参加者数</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{lowerGrades}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">下級生 (1-3年)</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center border border-purple-200 dark:border-purple-800">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {upperGrades}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">上級生 (4-6年)</div>
        </div>
      </div>
    </div>
  );
};

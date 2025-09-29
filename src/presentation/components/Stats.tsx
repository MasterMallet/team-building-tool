import React from 'react';
import { Users } from 'lucide-react';

interface Props {
  total: number;
  lowerGrades: number;
  upperGrades: number;
}

export const Stats: React.FC<Props> = ({ total, lowerGrades, upperGrades }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Users size={24} /> 参加状況
      </h3>
      <div className="space-y-3">
        <div className="bg-white/20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{total}</div>
          <div className="text-sm">総参加者数</div>
        </div>
        <div className="bg-white/20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{lowerGrades}</div>
          <div className="text-sm">下級生 (1-3年)</div>
        </div>
        <div className="bg-white/20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{upperGrades}</div>
          <div className="text-sm">上級生 (4-6年)</div>
        </div>
      </div>
    </div>
  );
};

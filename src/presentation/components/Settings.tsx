import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

interface Props {
  teamSize: number;
  balanceMode: 'grade' | 'simple';
  hasTeams: boolean;
  moveMode: boolean;
  onTeamSizeChange: (size: number) => void;
  onBalanceModeChange: (mode: 'grade' | 'simple') => void;
  onToggleMoveMode: () => void;
}

export const Settings: React.FC<Props> = ({
  teamSize,
  balanceMode,
  hasTeams,
  moveMode,
  onTeamSizeChange,
  onBalanceModeChange,
  onToggleMoveMode,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
        <SettingsIcon size={24} className="text-blue-600 dark:text-blue-400" /> 設定
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
            1チームの人数:
          </label>
          <input
            type="number"
            value={teamSize}
            onChange={e => onTeamSizeChange(parseInt(e.target.value))}
            min="2"
            max="8"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
            バランス調整:
          </label>
          <select
            value={balanceMode}
            onChange={e => onBalanceModeChange(e.target.value as 'grade' | 'simple')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
          >
            <option value="grade">学年バランス優先</option>
            <option value="simple">シンプル分割</option>
          </select>
        </div>
        {hasTeams && (
          <button
            onClick={onToggleMoveMode}
            className={`w-full py-3 rounded-lg font-bold transition-all shadow-md ${
              moveMode
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100'
            }`}
          >
            {moveMode ? '移動モード中' : 'メンバー移動'}
          </button>
        )}
      </div>
    </div>
  );
};

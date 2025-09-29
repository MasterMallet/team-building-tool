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

export const Settings: React.FC<Props> = ({teamSize, balanceMode, hasTeams, moveMode, onTeamSizeChange, onBalanceModeChange, onToggleMoveMode}) => {
  return (
    <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <SettingsIcon size={24} /> 設定
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm">1チームの人数:</label>
          <input
            type="number"
            value={teamSize}
            onChange={(e) => onTeamSizeChange(parseInt(e.target.value))}
            min="2"
            max="8"
            className="w-full px-4 py-3 rounded-lg text-gray-800"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm">バランス調整:</label>
          <select
            value={balanceMode}
            onChange={(e) => onBalanceModeChange(e.target.value as 'grade' | 'simple')}
            className="w-full px-4 py-3 rounded-lg text-gray-800"
          >
            <option value="grade">学年バランス優先</option>
            <option value="simple">シンプル分割</option>
          </select>
        </div>
        {hasTeams && (
          <button
            onClick={onToggleMoveMode}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              moveMode
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {moveMode ? '移動モード中' : 'メンバー移動'}
          </button>
        )}
      </div>
    </div>
  );
};
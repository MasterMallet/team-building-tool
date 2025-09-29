import React from 'react';
import { Users, Trash2, ArrowLeft } from 'lucide-react';
import { Participant } from '@domain/entities/Participant.ts';
import { TeamDivisionResult } from '@domain/usecases/TeamDivisionUseCase.ts';
import { Stats } from './Stats';
import { Settings } from './Settings';
import { ControlButtons } from './ControlButtons';
import { TeamGroup } from './TeamGroup';

interface SelectedParticipant {
  participant: Participant;
  teamId: string;
}

interface Props {
  participants: Participant[];
  teams: TeamDivisionResult | null;
  teamSize: number;
  balanceMode: 'grade' | 'simple';
  moveMode: boolean;
  selectedParticipant: SelectedParticipant | null;
  stats: { total: number; lowerGrades: number; upperGrades: number };
  onRemove: (id: string) => void;
  onTeamSizeChange: (size: number) => void;
  onBalanceModeChange: (mode: 'grade' | 'simple') => void;
  onToggleMoveMode: () => void;
  onDivideTeams: () => void;
  onClearAll: () => void;
  onSelectParticipant: (selected: SelectedParticipant) => void;
  onMoveParticipant: (toTeamId: string) => void;
  onBackToReception: () => void;
}

export const ManagementScreen: React.FC<Props> = ({
  participants,
  teams,
  teamSize,
  balanceMode,
  moveMode,
  selectedParticipant,
  stats,
  onRemove,
  onTeamSizeChange,
  onBalanceModeChange,
  onToggleMoveMode,
  onDivideTeams,
  onClearAll,
  onSelectParticipant,
  onMoveParticipant,
  onBackToReception,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToReception}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold">管理画面</h1>
                <p className="text-lg opacity-90">参加者管理とチーム分け</p>
              </div>
            </div>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className="mb-6">
          <TabNavigation />
        </div>

        {/* 参加者一覧タブ */}
        <div id="participants-tab">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* 参加者一覧 */}
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Users size={24} className="text-blue-600 dark:text-blue-400" />
                参加者一覧 ({participants.length}人)
              </h3>
              <div className="max-h-[600px] overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {participants.map((p, index) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                          {String(index + 1).padStart(3, '0')}
                        </span>
                        <div>
                          <div className="font-bold">{p.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {p.grade}年生
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(p.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                {participants.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    参加者がまだ登録されていません
                  </div>
                )}
              </div>
            </div>

            {/* 統計 */}
            <div>
              <Stats
                total={stats.total}
                lowerGrades={stats.lowerGrades}
                upperGrades={stats.upperGrades}
              />
            </div>
          </div>
        </div>

        {/* チーム分けタブ */}
        <div id="teams-tab">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-3">
              <Settings
                teamSize={teamSize}
                balanceMode={balanceMode}
                hasTeams={teams !== null}
                moveMode={moveMode}
                onTeamSizeChange={onTeamSizeChange}
                onBalanceModeChange={onBalanceModeChange}
                onToggleMoveMode={onToggleMoveMode}
              />
            </div>
          </div>

          <ControlButtons onDivide={onDivideTeams} onClear={onClearAll} />

          {teams && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.lowerTeams.length > 0 && (
                <TeamGroup
                  title={teams.type === 'grade' ? '🌟 下級生グループ (1-3年)' : '🔵 Aグループ'}
                  teams={teams.lowerTeams}
                  moveMode={moveMode}
                  selectedParticipant={selectedParticipant}
                  onSelectParticipant={onSelectParticipant}
                  onMoveParticipant={onMoveParticipant}
                />
              )}
              {teams.upperTeams.length > 0 && (
                <TeamGroup
                  title={teams.type === 'grade' ? '⭐ 上級生グループ (4-6年)' : '🔴 Bグループ'}
                  teams={teams.upperTeams}
                  moveMode={moveMode}
                  selectedParticipant={selectedParticipant}
                  onSelectParticipant={onSelectParticipant}
                  onMoveParticipant={onMoveParticipant}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// タブナビゲーション
const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'participants' | 'teams'>('participants');

  return (
    <div className="flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setActiveTab('participants')}
        className={`flex-1 py-4 px-6 text-lg font-bold rounded-xl transition-all ${
          activeTab === 'participants'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        参加者一覧
      </button>
      <button
        onClick={() => setActiveTab('teams')}
        className={`flex-1 py-4 px-6 text-lg font-bold rounded-xl transition-all ${
          activeTab === 'teams'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        チーム分け
      </button>
    </div>
  );
};

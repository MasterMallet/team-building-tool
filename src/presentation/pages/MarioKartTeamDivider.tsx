import React, { useState, useEffect, useMemo } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { ReceptionScreen } from '../components/ReceptionScreen';
import { ManagementScreen } from '../components/ManagementScreen';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { Participant } from '@domain/entities/Participant.ts';
import { TeamDivisionResult } from '@domain/usecases/TeamDivisionUseCase.ts';
import { LocalStorageParticipantRepository } from '@infrastructure/repositories/LocalStorageParticipantRepository.ts';
import { ParticipantUseCase } from '@domain/usecases/ParticipantUseCase.ts';
import { TeamDivisionUseCase } from '@domain/usecases/TeamDivisionUseCase.ts';

type Screen = 'reception' | 'management';

export const MarioKartTeamDivider: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [screen, setScreen] = useState<Screen>('reception');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teamSize, setTeamSize] = useState(4);
  const [balanceMode, setBalanceMode] = useState<'grade' | 'simple'>('grade');
  const [teams, setTeams] = useState<TeamDivisionResult | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<{
    participant: Participant;
    teamId: string;
  } | null>(null);
  const [moveMode, setMoveMode] = useState(false);

  const repository = useMemo(() => new LocalStorageParticipantRepository(), []);
  const participantUseCase = useMemo(() => new ParticipantUseCase(repository), [repository]);
  const teamDivisionUseCase = new TeamDivisionUseCase();

  useEffect(() => {
    const loadedParticipants = participantUseCase.getAllParticipants();
    setParticipants(loadedParticipants);
  }, [participantUseCase]);

  const handleAddParticipant = (name: string, grade: number) => {
    if (participants.length >= 160) {
      alert('参加者は最大160人までです');
      return;
    }

    participantUseCase.addParticipant(name, grade);
    setParticipants(participantUseCase.getAllParticipants());
  };

  const handleRemoveParticipant = (id: string) => {
    participantUseCase.removeParticipant(id);
    setParticipants(participantUseCase.getAllParticipants());
  };

  const handleImportParticipants = (importedParticipants: Participant[]) => {
    participantUseCase.clearAll();
    importedParticipants.forEach(p => {
      participantUseCase.addParticipant(p.name, p.grade);
    });
    setParticipants(participantUseCase.getAllParticipants());
    setTeams(null); // チーム分けをリセット
  };

  const handleDivideTeams = () => {
    if (participants.length === 0) {
      alert('参加者を登録してください');
      return;
    }
    const result = teamDivisionUseCase.divideTeams(participants, teamSize, balanceMode);
    setTeams(result);
    setMoveMode(false);
  };

  const handleClearAll = () => {
    if (window.confirm('全てのデータをリセットしますか？')) {
      participantUseCase.clearAll();
      setParticipants([]);
      setTeams(null);
    }
  };

  const handleMoveParticipant = (toTeamId: string) => {
    if (!selectedParticipant || !teams) return;

    const newTeams = teamDivisionUseCase.moveParticipant(
      teams,
      selectedParticipant.participant.id,
      selectedParticipant.teamId,
      toTeamId
    );

    setTeams(newTeams);
    setSelectedParticipant(null);
    setMoveMode(false);
  };

  const stats = participantUseCase.getStats();

  return (
    <>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {/* 管理画面切り替えボタン（受付画面のみ表示） */}
      {screen === 'reception' && (
        <button
          onClick={() => setScreen('management')}
          className="fixed bottom-4 right-4 p-4 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-2xl hover:scale-110 transition-all z-50"
          aria-label="管理画面へ"
        >
          <SettingsIcon size={32} />
        </button>
      )}

      {screen === 'reception' ? (
        <ReceptionScreen onAdd={handleAddParticipant} totalCount={participants.length} />
      ) : (
        <ManagementScreen
          participants={participants}
          teams={teams}
          teamSize={teamSize}
          balanceMode={balanceMode}
          moveMode={moveMode}
          selectedParticipant={selectedParticipant}
          stats={stats}
          onRemove={handleRemoveParticipant}
          onTeamSizeChange={setTeamSize}
          onBalanceModeChange={setBalanceMode}
          onToggleMoveMode={() => setMoveMode(!moveMode)}
          onDivideTeams={handleDivideTeams}
          onClearAll={handleClearAll}
          onSelectParticipant={setSelectedParticipant}
          onMoveParticipant={handleMoveParticipant}
          onBackToReception={() => setScreen('reception')}
          onImportParticipants={handleImportParticipants}
        />
      )}
    </>
  );
};

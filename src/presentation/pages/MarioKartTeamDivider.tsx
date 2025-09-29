import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ParticipantInput } from '../components/ParticipantInput';
import { Stats } from '../components/Stats';
import { Settings } from '../components/Settings';
import { ControlButtons } from '../components/ControlButtons';
import { TeamGroup } from '../components/TeamGroup';
import {Participant} from "@domain/entities/Participant.ts";
import {TeamDivisionResult, TeamDivisionUseCase} from "@domain/usecases/TeamDivisionUseCase.ts";
import {LocalStorageParticipantRepository} from "@infrastructure/repositories/LocalStorageParticipantRepository.ts";
import {ParticipantUseCase} from "@domain/usecases/ParticipantUseCase.ts";

export const MarioKartTeamDivider: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [teamSize, setTeamSize] = useState(4);
  const [balanceMode, setBalanceMode] = useState<'grade' | 'simple'>('grade');
  const [teams, setTeams] = useState<TeamDivisionResult | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<{ participant: Participant; teamId: string } | null>(null);
  const [moveMode, setMoveMode] = useState(false);

  const repository = new LocalStorageParticipantRepository();
  const participantUseCase = new ParticipantUseCase(repository);
  const teamDivisionUseCase = new TeamDivisionUseCase();

  useEffect(() => {
    const loadedParticipants = participantUseCase.getAllParticipants();
    setParticipants(loadedParticipants);
  }, []);

  const handleAddParticipant = () => {
    if (!name.trim()) {
      alert('名前を入力してください');
      return;
    }
    if (participants.length >= 160) {
      alert('参加者は最大160人までです');
      return;
    }

    participantUseCase.addParticipant(name.trim(), grade);
    setParticipants(participantUseCase.getAllParticipants());
    setName('');
  };

  const handleRemoveParticipant = (id: string) => {
    participantUseCase.removeParticipant(id);
    setParticipants(participantUseCase.getAllParticipants());
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 p-4">
      <div className="max-w-7xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-6">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ParticipantInput
            participants={participants}
            name={name}
            grade={grade}
            onNameChange={setName}
            onGradeChange={setGrade}
            onAdd={handleAddParticipant}
            onRemove={handleRemoveParticipant}
          />

          <Stats
            total={stats.total}
            lowerGrades={stats.lowerGrades}
            upperGrades={stats.upperGrades}
          />

          <Settings
            teamSize={teamSize}
            balanceMode={balanceMode}
            hasTeams={teams !== null}
            moveMode={moveMode}
            onTeamSizeChange={setTeamSize}
            onBalanceModeChange={setBalanceMode}
            onToggleMoveMode={() => setMoveMode(!moveMode)}
          />
        </div>

        <ControlButtons onDivide={handleDivideTeams} onClear={handleClearAll} />

        {teams && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.lowerTeams.length > 0 && (
              <TeamGroup
                title={teams.type === 'grade' ? '🌟 下級生グループ (1-3年)' : '🔵 Aグループ'}
                teams={teams.lowerTeams}
                moveMode={moveMode}
                selectedParticipant={selectedParticipant}
                onSelectParticipant={setSelectedParticipant}
                onMoveParticipant={handleMoveParticipant}
              />
            )}
            {teams.upperTeams.length > 0 && (
              <TeamGroup
                title={teams.type === 'grade' ? '⭐ 上級生グループ (4-6年)' : '🔴 Bグループ'}
                teams={teams.upperTeams}
                moveMode={moveMode}
                selectedParticipant={selectedParticipant}
                onSelectParticipant={setSelectedParticipant}
                onMoveParticipant={handleMoveParticipant}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
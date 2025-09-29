import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Participant } from '@domain/entities/Participant.ts';
import { Team } from '@domain/entities/Team.ts';

interface SelectedParticipant {
  participant: Participant;
  teamId: string;
}

interface Props {
  title: string;
  teams: Team[];
  moveMode: boolean;
  selectedParticipant: SelectedParticipant | null;
  onSelectParticipant: (selected: SelectedParticipant) => void;
  onMoveParticipant: (toTeamId: string) => void;
}

export const TeamGroup: React.FC<Props> = ({
  title,
  teams,
  moveMode,
  selectedParticipant,
  onSelectParticipant,
  onMoveParticipant,
}) => {
  return (
    <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h2>
      <div className="space-y-4">
        {teams.map(team => (
          <div
            key={team.id}
            className={`bg-white rounded-xl p-4 border-l-4 border-red-500 transition-all ${
              moveMode && selectedParticipant?.teamId !== team.id
                ? 'hover:shadow-lg cursor-pointer'
                : ''
            }`}
            onClick={() => {
              if (moveMode && selectedParticipant && selectedParticipant.teamId !== team.id) {
                onMoveParticipant(team.id);
              }
            }}
          >
            <div className="font-bold text-lg mb-3 flex items-center justify-between">
              <span>
                {team.name} ({team.memberCount}人)
              </span>
              {moveMode && selectedParticipant?.teamId !== team.id && (
                <ArrowRight className="text-green-500" size={20} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {team.members.map(member => (
                <div
                  key={member.id}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedParticipant?.participant.id === member.id
                      ? 'bg-yellow-300 font-bold'
                      : 'bg-gray-100'
                  } ${moveMode && selectedParticipant?.participant.id !== member.id ? 'hover:bg-blue-100 cursor-pointer' : ''}`}
                  onClick={e => {
                    if (moveMode) {
                      e.stopPropagation();
                      onSelectParticipant({ participant: member, teamId: team.id });
                    }
                  }}
                >
                  {member.name} ({member.grade}年)
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

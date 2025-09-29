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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      <div className="space-y-4">
        {teams.map(team => (
          <div
            key={team.id}
            className={`bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border-l-4 border-blue-500 dark:border-blue-400 transition-all ${
              moveMode && selectedParticipant?.teamId !== team.id
                ? 'hover:shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
                : ''
            }`}
            onClick={() => {
              if (moveMode && selectedParticipant && selectedParticipant.teamId !== team.id) {
                onMoveParticipant(team.id);
              }
            }}
          >
            <div className="font-bold text-lg mb-3 flex items-center justify-between text-gray-800 dark:text-gray-100">
              <span>
                {team.name} ({team.memberCount}人)
              </span>
              {moveMode && selectedParticipant?.teamId !== team.id && (
                <ArrowRight className="text-green-500 dark:text-green-400" size={20} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {team.members.map(member => (
                <div
                  key={member.id}
                  className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                    selectedParticipant?.participant.id === member.id
                      ? 'bg-yellow-200 dark:bg-yellow-800 font-bold border-yellow-400 dark:border-yellow-600'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  } ${moveMode && selectedParticipant?.participant.id !== member.id ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer' : ''} text-gray-800 dark:text-gray-100`}
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

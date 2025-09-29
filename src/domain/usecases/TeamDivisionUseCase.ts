import { Participant } from '@domain/entities/Participant.ts';
import { Team } from '@domain/entities/Team.ts';

export class TeamDivisionUseCase {
  divideTeams(
    participants: Participant[],
    teamSize: number,
    balanceMode: 'grade' | 'simple'
  ): TeamDivisionResult {
    if (participants.length === 0) {
      return { lowerTeams: [], upperTeams: [], type: 'grade' };
    }

    if (balanceMode === 'grade') {
      return this.divideByGradeBalance(participants, teamSize);
    } else {
      return this.divideSimple(participants, teamSize);
    }
  }

  private divideByGradeBalance(participants: Participant[], teamSize: number): TeamDivisionResult {
    const lowerGrades = participants.filter(p => p.grade <= 3);
    const upperGrades = participants.filter(p => p.grade >= 4);

    const diff = Math.abs(lowerGrades.length - upperGrades.length);

    if (diff <= participants.length * 0.2) {
      const lowerTeams = this.createBalancedTeams(lowerGrades, teamSize, '下級生グループ');
      const upperTeams = this.createBalancedTeams(upperGrades, teamSize, '上級生グループ');
      return { lowerTeams, upperTeams, type: 'grade' };
    } else {
      return this.divideSimple(participants, teamSize);
    }
  }

  private divideSimple(participants: Participant[], teamSize: number): TeamDivisionResult {
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    const groupA = this.createBalancedTeams(shuffled.slice(0, mid), teamSize, 'Aグループ');
    const groupB = this.createBalancedTeams(shuffled.slice(mid), teamSize, 'Bグループ');
    return { lowerTeams: groupA, upperTeams: groupB, type: 'simple' };
  }

  private createBalancedTeams(players: Participant[], teamSize: number, groupName: string): Team[] {
    if (players.length === 0) return [];

    const sortedPlayers = [...players].sort((a, b) => a.grade - b.grade);
    const numTeams = Math.ceil(sortedPlayers.length / teamSize);
    const teamArrays: Participant[][] = Array.from({ length: numTeams }, () => []);

    sortedPlayers.forEach((player, index) => {
      const teamIndex = index % numTeams;
      teamArrays[teamIndex].push(player);
    });

    return teamArrays.map(
      (members, index) =>
        new Team(`${groupName}-${index}`, `${groupName} チーム${index + 1}`, members)
    );
  }

  moveParticipant(
    teams: TeamDivisionResult,
    participantId: string,
    fromTeamId: string,
    toTeamId: string
  ): TeamDivisionResult {
    const newTeams: TeamDivisionResult = JSON.parse(JSON.stringify(teams));

    const fromTeam = this.findTeam(newTeams, fromTeamId);
    const toTeam = this.findTeam(newTeams, toTeamId);

    if (!fromTeam || !toTeam) return teams;

    const participantIndex = fromTeam.members.findIndex(p => p.id === participantId);
    if (participantIndex === -1) return teams;

    const [participant] = fromTeam.members.splice(participantIndex, 1);
    toTeam.members.push(participant);

    return newTeams;
  }

  private findTeam(teams: TeamDivisionResult, teamId: string): Team | null {
    const found =
      teams.lowerTeams.find(t => t.id === teamId) || teams.upperTeams.find(t => t.id === teamId);
    return found || null;
  }
}

export interface TeamDivisionResult {
  lowerTeams: Team[];
  upperTeams: Team[];
  type: 'grade' | 'simple';
}

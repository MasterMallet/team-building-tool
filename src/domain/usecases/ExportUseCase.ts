import { Participant } from '../entities/Participant';
import { Team } from '../entities/Team';
import { TeamDivisionResult } from './TeamDivisionUseCase';

export class ExportUseCase {
  // CSV形式でエクスポート
  exportToCSV(participants: Participant[]): string {
    const headers = ['番号', '学年'];
    const rows = participants.map(p => [p.number, p.grade]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // チーム分け結果のCSVエクスポート
  exportTeamsToCSV(teams: TeamDivisionResult): string {
    const headers = ['グループ', 'チーム名', '番号', '学年'];
    const rows: string[][] = [];

    const processTeams = (teamList: Team[], groupName: string) => {
      teamList.forEach(team => {
        team.members.forEach(member => {
          rows.push([groupName, team.name, String(member.number), String(member.grade)]);
        });
      });
    };

    if (teams.lowerTeams.length > 0) {
      processTeams(teams.lowerTeams, teams.type === 'grade' ? '下級生グループ' : 'Aグループ');
    }
    if (teams.upperTeams.length > 0) {
      processTeams(teams.upperTeams, teams.type === 'grade' ? '上級生グループ' : 'Bグループ');
    }

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // CSVからインポート
  importFromCSV(csvContent: string): Participant[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const participants: Participant[] = [];

    const headers = lines[0]
      ?.replace(/^\uFEFF/, '')
      .split(',')
      .map(s => s.trim());
    const numberColumn = headers?.indexOf('番号') ?? -1;
    const gradeColumn = headers?.indexOf('学年') ?? -1;
    if (numberColumn < 0 || gradeColumn < 0) {
      throw new Error('CSVには番号と学年の列が必要です');
    }
    const usedNumbers = new Set<number>();
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map(s => s.trim());
      const number = Number(columns[numberColumn]);
      const grade = Number(columns[gradeColumn]);
      if (
        !Number.isSafeInteger(number) ||
        number < 1 ||
        !Number.isInteger(grade) ||
        grade < 1 ||
        grade > 6 ||
        usedNumbers.has(number)
      ) {
        throw new Error(`${i + 1}行目の番号・学年が不正、または番号が重複しています`);
      }
      usedNumbers.add(number);
      participants.push(Participant.create(number, grade));
    }
    if (participants.length > 160) throw new Error('参加者は最大160人までです');
    participants.sort((a, b) => a.number - b.number);

    return participants;
  }

  // PDFデータ生成用のHTML
  generatePDFHTML(teams: TeamDivisionResult, eventName: string = 'マリオカート大会'): string {
    const generateTeamHTML = (teamList: Team[], groupTitle: string) => {
      return teamList
        .map(
          team => `
        <div class="team">
          <h3>${groupTitle} ${team.name} (${team.memberCount}人)</h3>
          <ul>
            ${team.members
              .map(
                member => `
              <li>${member.number}番 (${member.grade}年生)</li>
            `
              )
              .join('')}
          </ul>
        </div>
      `
        )
        .join('');
    };

    return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${eventName} - チーム分け結果</title>
  <style>
    body { font-family: 'Hiragino Sans', 'Meiryo', sans-serif; padding: 20px; }
    h1 { text-align: center; color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #4b5563; margin-top: 30px; border-left: 5px solid #3b82f6; padding-left: 10px; }
    .team { 
      margin: 20px 0; 
      padding: 15px; 
      border: 2px solid #e5e7eb; 
      border-radius: 8px;
      page-break-inside: avoid;
    }
    .team h3 { color: #1e40af; margin-bottom: 10px; }
    ul { list-style: none; padding: 0; }
    li { padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
    @media print {
      .team { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>🏆 ${eventName} チーム分け結果 🏆</h1>
  ${
    teams.lowerTeams.length > 0
      ? `
    <h2>${teams.type === 'grade' ? '🌟 下級生グループ (1-3年)' : '🔵 Aグループ'}</h2>
    ${generateTeamHTML(teams.lowerTeams, '')}
  `
      : ''
  }
  ${
    teams.upperTeams.length > 0
      ? `
    <h2>${teams.type === 'grade' ? '⭐ 上級生グループ (4-6年)' : '🔴 Bグループ'}</h2>
    ${generateTeamHTML(teams.upperTeams, '')}
  `
      : ''
  }
  <p style="text-align: center; margin-top: 40px; color: #6b7280;">
    生成日時: ${new Date().toLocaleString('ja-JP')}
  </p>
</body>
</html>
    `;
  }
}

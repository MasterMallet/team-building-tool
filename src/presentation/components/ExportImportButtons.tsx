import React, { useRef } from 'react';
import { Download, Upload, FileText, File } from 'lucide-react';
import { Participant } from '@domain/entities/Participant.ts';
import { TeamDivisionResult } from '@domain/usecases/TeamDivisionUseCase.ts';
import { ExportUseCase } from '@domain/usecases/ExportUseCase.ts';

interface Props {
  participants: Participant[];
  teams: TeamDivisionResult | null;
  onImport: (participants: Participant[]) => void;
}

export const ExportImportButtons: React.FC<Props> = ({ participants, teams, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportUseCase = new ExportUseCase();

  const handleExportCSV = () => {
    const csv = exportUseCase.exportToCSV(participants);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participants_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportTeamsCSV = () => {
    if (!teams) {
      alert('先にチーム分けを実行してください');
      return;
    }
    const csv = exportUseCase.exportTeamsToCSV(teams);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `teams_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!teams) {
      alert('先にチーム分けを実行してください');
      return;
    }
    const html = exportUseCase.generatePDFHTML(teams);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');

    // 印刷ダイアログを開く
    setTimeout(() => {
      newWindow?.print();
    }, 500);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const importedParticipants = exportUseCase.importFromCSV(content);

        if (importedParticipants.length === 0) {
          alert('有効なデータが見つかりませんでした');
          return;
        }

        if (
          window.confirm(
            `${importedParticipants.length}人の参加者をインポートしますか？\n（既存のデータは削除されます）`
          )
        ) {
          onImport(importedParticipants);
          alert(`${importedParticipants.length}人をインポートしました`);
        }
      } catch (error) {
        alert('CSVファイルの読み込みに失敗しました');
        console.error(error);
      }
    };
    reader.readAsText(file);

    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportGoogleSheets = () => {
    const csv = exportUseCase.exportToCSV(participants);
    //const encodedData = encodeURIComponent(csv);
    const googleSheetsUrl = `https://docs.google.com/spreadsheets/create?usp=sharing`;

    // CSVデータをクリップボードにコピー
    navigator.clipboard.writeText(csv).then(() => {
      alert(
        'CSVデータをクリップボードにコピーしました。\nGoogle Sheetsを開いて貼り付けてください。'
      );
      window.open(googleSheetsUrl, '_blank');
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        インポート / エクスポート
      </h3>

      <div className="space-y-3">
        {/* インポート */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            データ読み込み
          </h4>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-bold cursor-pointer transition-all"
          >
            <Upload size={20} />
            CSVインポート
          </label>
        </div>

        {/* エクスポート */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            参加者リスト出力
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportCSV}
              disabled={participants.length === 0}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              <File size={20} />
              CSV
            </button>
            <button
              onClick={handleExportGoogleSheets}
              disabled={participants.length === 0}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              <FileText size={20} />
              Sheets
            </button>
          </div>
        </div>

        {/* チーム分け結果エクスポート */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            チーム分け結果出力
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportTeamsCSV}
              disabled={!teams}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              <File size={20} />
              CSV
            </button>
            <button
              onClick={handleExportPDF}
              disabled={!teams}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              <Download size={20} />
              PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>💡 CSVフォーマット: 番号,名前,学年</p>
        <p>💡 PDFは新しいタブで開き、印刷ダイアログが表示されます</p>
      </div>
    </div>
  );
};

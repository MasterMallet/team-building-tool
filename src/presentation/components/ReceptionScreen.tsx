import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Participant } from '@domain/entities/Participant.ts';

interface Props {
  onAdd: (grade: number) => Participant | undefined;
  totalCount: number;
}

export const ReceptionScreen: React.FC<Props> = ({ onAdd, totalCount }) => {
  const [grade, setGrade] = useState<number | null>(null);
  const [lastRegistered, setLastRegistered] = useState<Participant | null>(null);

  const handleAdd = () => {
    if (grade === null) return;
    const participant = onAdd(grade);
    if (participant) {
      setLastRegistered(participant);
      setGrade(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 上部：登録番号表示（反転表示） */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900 flex items-center justify-center p-8 border-b-8 border-white dark:border-gray-700">
        <div className="text-center transform rotate-180">
          <div className="text-gray-200 dark:text-gray-400 text-4xl mb-6 font-bold">
            {lastRegistered ? 'あなたの受付番号' : '学年を教えてください'}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl w-full max-w-3xl">
            <div className="text-8xl font-bold text-gray-800 dark:text-gray-100 mb-4 min-h-[120px] flex items-center justify-center break-all">
              {lastRegistered ? `${lastRegistered.number}番` : '受付中'}
            </div>
            <div className="text-5xl text-gray-600 dark:text-gray-400">
              {lastRegistered ? `${lastRegistered.grade}年生` : '登録後に番号をお伝えします'}
            </div>
          </div>
        </div>
      </div>

      {/* 下部：入力欄 */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-800">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              🏆 マリオカート大会 受付 🏆
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              現在の登録人数:{' '}
              <span className="font-bold text-blue-600 dark:text-blue-400">{totalCount}</span>人
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 shadow-xl border-2 border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              <div
                role="status"
                aria-live="polite"
                className="text-center text-gray-800 dark:text-gray-100"
              >
                {lastRegistered ? (
                  <>
                    <p className="text-xl">登録完了（{lastRegistered.grade}年生）</p>
                    <p className="text-6xl font-bold my-3">{lastRegistered.number}番</p>
                    <p className="text-xl">この番号のリストバンドを渡してください</p>
                  </>
                ) : (
                  <p className="text-xl">学年を選んで登録してください</p>
                )}
              </div>

              {/* 学年選択 */}
              <div>
                <label className="block text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                  学年を選ぶ
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(g => (
                    <button
                      key={g}
                      onClick={() => setGrade(g)}
                      aria-pressed={grade === g}
                      className={`py-6 px-4 text-3xl font-bold rounded-2xl transition-all transform hover:scale-105 ${
                        grade === g
                          ? 'bg-blue-600 text-white shadow-lg scale-105 ring-4 ring-blue-300 dark:ring-blue-700'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-4 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      {g}年生
                    </button>
                  ))}
                </div>
              </div>

              {/* 登録ボタン */}
              <button
                onClick={handleAdd}
                disabled={grade === null || totalCount >= 160}
                className={`w-full py-8 text-4xl font-bold rounded-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-4 shadow-xl ${
                  grade !== null && totalCount < 160
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <Check size={48} />
                {totalCount >= 160 ? '定員に達しました' : '登録する'}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">
              登録 → 表示された番号のリストバンドを渡す → 次の方の学年を選択
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

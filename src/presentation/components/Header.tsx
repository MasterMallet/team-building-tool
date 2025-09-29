import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 rounded-2xl p-6 text-white text-center mb-6 shadow-lg">
      <h1 className="text-4xl font-bold mb-2">🏆 マリオカート大会 🏆</h1>
      <h2 className="text-xl opacity-90">自動チーム分けシステム</h2>
    </div>
  );
};

import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl p-6 text-white text-center mb-6">
      <h1 className="text-4xl font-bold mb-2">🏆 マリオカート大会 🏆</h1>
      <h2 className="text-xl">自動チーム分けシステム</h2>
    </div>
  );
};
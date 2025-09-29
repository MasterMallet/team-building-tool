import React from "react";
import { UserPlus, Trash2 } from "lucide-react";
import {Participant} from "@domain/entities/Participant.ts";

interface Props {
  participants: Participant[];
  name: string;
  grade: number;
  onNameChange: (name: string) => void;
  onGradeChange: (grade: number) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export const ParticipantInput: React.FC<Props> = ({participants, name, grade, onNameChange, onGradeChange, onAdd, onRemove}) => {
  return (
    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <UserPlus size={24} /> 参加者登録
      </h3>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          placeholder="名前を入力"
          className="w-full px-4 py-3 rounded-lg text-gray-800"
        />
        <select
          value={grade}
          onChange={(e) => onGradeChange(parseInt(e.target.value))}
          className="w-full px-4 py-3 rounded-lg text-gray-800"
        >
          {[1, 2, 3, 4, 5, 6].map(g => (
            <option key={g} value={g}>{g}年生</option>
          ))}
        </select>
        <button
          onClick={onAdd}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
        >
          追加
        </button>
      </div>
      <div className="mt-4 max-h-64 overflow-y-auto bg-white/20 rounded-lg p-2">
        {participants.map(p => (
          <div key={p.id} className="flex justify-between items-center bg-white/90 text-gray-800 rounded-lg p-2 mb-2">
            <span>{p.name} ({p.grade}年)</span>
            <button
              onClick={() => onRemove(p.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
import { IParticipantRepository } from '@domain/repositories/IParticipantRepository.ts';
import { Participant } from '@domain/entities/Participant.ts';

export class ParticipantUseCase {
  constructor(private repository: IParticipantRepository) {}

  addParticipant(grade: number): Participant {
    if (!Number.isInteger(grade) || grade < 1 || grade > 6) {
      throw new Error('学年は1〜6年生を選択してください');
    }
    const participant = Participant.create(this.repository.getNextNumber(), grade);
    this.repository.save(participant);
    return participant;
  }

  removeParticipant(id: string): void {
    this.repository.remove(id);
  }

  getAllParticipants(): Participant[] {
    return this.repository.getAll();
  }

  clearAll(): void {
    this.repository.clear();
  }

  getStats(): ParticipantStats {
    const participants = this.repository.getAll();
    const lowerGrades = participants.filter(p => p.grade <= 3).length;
    const upperGrades = participants.filter(p => p.grade >= 4).length;

    return {
      total: participants.length,
      lowerGrades,
      upperGrades,
    };
  }
}

export interface ParticipantStats {
  total: number;
  lowerGrades: number;
  upperGrades: number;
}

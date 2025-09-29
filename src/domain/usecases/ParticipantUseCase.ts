import {IParticipantRepository} from "@domain/repositories/IParticipantRepository.ts";
import {Participant} from "@domain/entities/Participant.ts";

export class ParticipantUseCase {
  constructor(private repository: IParticipantRepository) {}

  addParticipant(name: string, grade: number): Participant {
    const participant = Participant.create(name, grade);
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
      upperGrades
    };
  }
}

export interface ParticipantStats {
  total: number;
  lowerGrades: number;
  upperGrades: number;
}
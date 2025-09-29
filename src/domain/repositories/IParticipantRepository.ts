import { Participant } from '@domain/entities/Participant.ts';

export interface IParticipantRepository {
  save(participant: Participant): void;
  remove(id: string): void;
  getAll(): Participant[];
  clear(): void;
}

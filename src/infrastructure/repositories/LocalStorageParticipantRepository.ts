import {IParticipantRepository} from "@domain/repositories/IParticipantRepository.ts";
import {Participant} from "@domain/entities/Participant.ts";

export class LocalStorageParticipantRepository implements IParticipantRepository {
  private readonly storageKey = 'mario_kart_participants';

  save(participant: Participant): void {
    const participants = this.getAll();
    participants.push(participant);
    this.saveAll(participants);
  }

  remove(id: string): void {
    const participants = this.getAll().filter(p => p.id !== id);
    this.saveAll(participants);
  }

  getAll(): Participant[] {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];

    const rawData = JSON.parse(data);
    return rawData.map((p: Participant) => new Participant(p.id, p.name, p.grade));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  private saveAll(participants: Participant[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(participants));
  }
}
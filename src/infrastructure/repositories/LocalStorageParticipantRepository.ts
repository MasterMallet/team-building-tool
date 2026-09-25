import { IParticipantRepository } from '@domain/repositories/IParticipantRepository.ts';
import { Participant } from '@domain/entities/Participant.ts';

export class LocalStorageParticipantRepository implements IParticipantRepository {
  private readonly storageKey = 'mario_kart_participants';
  private readonly lastNumberKey = 'mario_kart_last_number';

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

    const rawData: Participant[] = JSON.parse(data);
    let lastNumber = Math.max(0, ...rawData.map(p => p.number ?? 0));
    const participants = rawData.map(p => new Participant(p.id, p.number ?? ++lastNumber, p.grade));
    // 旧形式の参加者には保存順で番号を付け、一度だけ移行する。
    if (rawData.some(p => p.number == null)) this.saveAll(participants);
    return participants;
  }

  getNextNumber(): number {
    const participants = this.getAll();
    return (
      Math.max(
        Number(localStorage.getItem(this.lastNumberKey)) || 0,
        ...participants.map(p => p.number)
      ) + 1
    );
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.lastNumberKey);
  }

  private saveAll(participants: Participant[]): void {
    const lastNumber = Math.max(
      Number(localStorage.getItem(this.lastNumberKey)) || 0,
      ...participants.map(p => p.number)
    );
    localStorage.setItem(this.lastNumberKey, String(lastNumber));
    localStorage.setItem(this.storageKey, JSON.stringify(participants));
  }
}

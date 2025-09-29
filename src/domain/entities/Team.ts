import {Participant} from "@domain/entities/Participant.ts";

export class Team {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly members: Participant[]
  ) {}

  get memberCount(): number {
    return this.members.length;
  }

  getGradeBalance(): Record<number, number> {
    const balance: Record<number, number> = {};
    for (let i = 1; i <= 6; i++) {
      balance[i] = this.members.filter(m => m.grade === i).length;
    }
    return balance;
  }
}
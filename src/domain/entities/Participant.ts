export class Participant {
  constructor(
    public readonly id: string,
    public readonly number: number,
    public readonly grade: number
  ) {}

  static create(number: number, grade: number): Participant {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    return new Participant(id, number, grade);
  }
}

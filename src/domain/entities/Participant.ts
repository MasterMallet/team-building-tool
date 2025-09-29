export class Participant {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly grade: number
  ) {}

  static create(name: string, grade: number): Participant {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    return new Participant(id, name, grade);
  }
}

import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true, hmr: false } });
after(() => server.close());
const { LocalStorageParticipantRepository: Repository } = await server.ssrLoadModule(
  '/src/infrastructure/repositories/LocalStorageParticipantRepository.ts'
);
const { ParticipantUseCase } = await server.ssrLoadModule('/src/domain/usecases/ParticipantUseCase.ts');
const { ExportUseCase } = await server.ssrLoadModule('/src/domain/usecases/ExportUseCase.ts');
const { Team } = await server.ssrLoadModule('/src/domain/entities/Team.ts');

beforeEach(() => {
  const storage = new Map();
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
  };
});

test('numbers increase across grades, deletion, and repository reload; reset starts at 1', () => {
  const useCase = new ParticipantUseCase(new Repository());
  const first = useCase.addParticipant(6);
  const second = useCase.addParticipant(1);
  assert.deepEqual([first.number, second.number], [1, 2]);
  useCase.removeParticipant(second.id);
  const reloaded = new ParticipantUseCase(new Repository());
  const third = reloaded.addParticipant(3);
  assert.equal(third.number, 3);
  reloaded.removeParticipant(first.id);
  reloaded.removeParticipant(third.id);
  assert.equal(reloaded.addParticipant(4).number, 4);
  reloaded.clearAll();
  assert.equal(reloaded.addParticipant(2).number, 1);
});

test('legacy data gets stable numbers in saved order before removal', () => {
  localStorage.setItem('mario_kart_participants', JSON.stringify([
    { id: 'a', name: '旧参加者A', grade: 2 },
    { id: 'b', name: '旧参加者B', grade: 5 },
  ]));
  const repository = new Repository();
  assert.deepEqual(repository.getAll().map(p => p.number), [1, 2]);
  repository.remove('b');
  assert.equal(new ParticipantUseCase(new Repository()).addParticipant(1).number, 3);
  assert.equal(repository.getAll()[0].id, 'a');
});

test('CSV round trips preserve gaps and imports continue after the largest number', () => {
  const exporter = new ExportUseCase();
  const participants = exporter.importFromCSV('\uFEFF番号,学年\r\n8,6\r\n2,1');
  assert.equal(exporter.exportToCSV(participants), '番号,学年\n2,1\n8,6');
  const repository = new Repository();
  participants.forEach(p => repository.save(p));
  assert.equal(new ParticipantUseCase(repository).addParticipant(3).number, 9);
  assert.equal(exporter.importFromCSV('番号,名前,学年\n7,旧参加者,4')[0].number, 7);
});

test('invalid CSV, duplicate numbers, and over-capacity imports are rejected', () => {
  const exporter = new ExportUseCase();
  for (const csv of [
    '番号,学年\n1,2\n1,3', '番号,学年\n0,1', '番号,学年\n2,7',
    '番号,学年\n2,1.5', '番号,学年\n2x,1', '名前,学年\n参加者,1',
    '番号,学年\n' + Array.from({ length: 161 }, (_, i) => `${i + 1},1`).join('\n'),
  ]) assert.throws(() => exporter.importFromCSV(csv));
});

test('team CSV and print output use wristband numbers even when member order changes', () => {
  const exporter = new ExportUseCase();
  const members = exporter.importFromCSV('番号,学年\n3,2\n9,5').reverse();
  const teams = { lowerTeams: [new Team('a', 'チーム1', members)], upperTeams: [], type: 'simple' };
  assert.match(exporter.exportTeamsToCSV(teams), /Aグループ,チーム1,9,5/);
  assert.match(exporter.generatePDFHTML(teams), /9番 \(5年生\)/);
  assert.match(exporter.generatePDFHTML(teams), /3番 \(2年生\)/);
});

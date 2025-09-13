import { glob, readFile } from 'node:fs/promises';

import type { Knowledge } from './knowledge.model.js';

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  return knowledges;
}

export const KnowledgeRepository = {
  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByKnowledgeId: (_: string): Promise<Knowledge> => undefined as any,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  upsert: (_: Knowledge): Promise<void> => undefined as any,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  deleteByKnowledgeId: (_: string): Promise<void> => undefined as any,
};

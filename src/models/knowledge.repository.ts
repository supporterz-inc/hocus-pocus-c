import { glob, readFile, rm, writeFile } from 'node:fs/promises';
import type { Knowledge } from './knowledge.model.js';

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  return knowledges;
}

async function upsert(knowledge: Knowledge): Promise<void> {
  const path = `./storage/${knowledge.knowledgeId}.json`;
  const content = JSON.stringify(knowledge, null, 2);

  await writeFile(path, content, 'utf-8');
}

async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge> {
  //Promise 非同期処理をするときに書く?
  const path = `./storage/${knowledgeId}.json`;
  const content = await readFile(path, 'utf-8');

  return JSON.parse(content);
}

async function deleteByKnowledgeId(knowledgeId: string): Promise<void> {
  const path = `./storage/${knowledgeId}.json`;

  await rm(path);
}

export const KnowledgeRepository = {
  getByKnowledgeId,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  upsert,

  deleteByKnowledgeId,
};

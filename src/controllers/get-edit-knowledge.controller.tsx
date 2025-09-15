import { HTTPException } from 'hono/http-exception';
import { KnowledgeEditFeature } from '../features/KnowledgeEditFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getEditKnowledgeController(userId: string, knowledgeId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  // 認可: ログインユーザーがナレッジの作者であるかを確認
  if (knowledge.authorId !== userId) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  return <KnowledgeEditFeature knowledge={knowledge} />;
}

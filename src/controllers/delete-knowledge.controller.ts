import { HTTPException } from 'hono/http-exception';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function deleteKnowledgeController(userId: string, knowledgeId: string) {
  const storedKnowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  // 認可: ログインユーザーがナレッジの作者であるかを確認
  if (storedKnowledge.authorId !== userId) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  await KnowledgeRepository.deleteByKnowledgeId(knowledgeId);
}

import { HTTPException } from 'hono/http-exception';
import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

interface PatchKnowledgeControllerProps {
  userId: string;
  knowledgeId: string;
  title: string;
  content: string;
}

export async function patchKnowledgeController({ userId, knowledgeId, title, content }: PatchKnowledgeControllerProps) {
  const storedKnowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  // 認可: ログインユーザーがナレッジの作者であるかを確認
  if (storedKnowledge.authorId !== userId) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  const updatedKnowledge = Knowledge.update(storedKnowledge, content, title);
  await KnowledgeRepository.upsert(updatedKnowledge);
}

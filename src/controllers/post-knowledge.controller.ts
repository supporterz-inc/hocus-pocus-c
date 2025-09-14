import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

interface PostKnowledgeControllerProps {
  userId: string;
  content: string;
}

export async function postKnowledgeController({ userId, content }: PostKnowledgeControllerProps) {
  const knowledge = Knowledge.create(content, userId);
  await KnowledgeRepository.upsert(knowledge);
}

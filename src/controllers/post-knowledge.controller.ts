import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

interface PostKnowledgeControllerProps {
  userId: string;
  title: string;
  content: string;
}

export async function postKnowledgeController({ userId, title, content }: PostKnowledgeControllerProps) {
  const knowledge = Knowledge.create(content, userId, title);
  await KnowledgeRepository.upsert(knowledge);
}
